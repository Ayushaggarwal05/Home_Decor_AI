import math
import logging
from typing import List, Dict, Any, Tuple
from app.utils.geometry_utils import compute_bounding_box_intersection_ratio, calculate_clearance_score

logger = logging.getLogger(__name__)

# Configurable weight distributions representing layout optimization priorities
SCORING_WEIGHTS = {
    "accessibility": 0.30,
    "flow": 0.25,
    "symmetry": 0.15,
    "clutter": 0.10,
    "lighting": 0.10,
    "semantic": 0.10
}

# Industry-standard visual weights to calculate balance and center-of-gravity offsets
VISUAL_WEIGHTS = {
    "Sofa": 3.5,
    "Bed": 4.0,
    "Dining Table": 3.0,
    "Armchair": 1.8,
    "Desk": 2.0,
    "Sideboard": 1.5,
    "Bookshelf": 2.2,
    "Chair": 1.0,
    "Potted Plant": 0.5,
    "Window": 0.0,  # Windows are structural elements and do not count towards visual furniture weights
    "Door": 0.0
}

# Semantic Category groupings to resolve functional constraints
SEATING_FURNITURE = {"Sofa", "Armchair", "Chair"}

class ExplainableScoringEngine:
    """
    Evaluates spatial layouts and returns metrics along with explainable insights.
    Integrates geometric pathfinding, visual symmetry, window light obstruction, 
    and semantic relationships.
    """

    def calculate_room_scores(self, furniture: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluate spacing coordinates and return structured scores and reasoning comments.
        
        Returns:
            Dict: overall, flow, symmetry, clutter, accessibility, lighting, and semantic scores.
        """
        if not furniture:
            logger.info("Scoring aborted: No furniture items found in room.")
            return {
                "clutter_level": "Low",
                "scores": {
                    "overall": 0, 
                    "flow": 0, 
                    "symmetry": 0, 
                    "clutter": 100, 
                    "accessibility": 0, 
                    "lighting": 100,
                    "semantic": 100
                },
                "reasoning": [{
                    "id": "obs-empty-room",
                    "title": "Empty Room Mapped",
                    "description": "No furniture detected in space. Upload room objects to compute layout scores.",
                    "type": "info"
                }]
            }

        # 1. Execute sub-scoring engines
        clutter_score, clutter_level, clutter_reasoning = self._calculate_clutter_score(furniture)
        accessibility_score, accessibility_reasoning = self._calculate_accessibility_score(furniture)
        flow_score, flow_reasoning = self._calculate_flow_score(accessibility_score, clutter_score)
        symmetry_score, symmetry_reasoning = self._calculate_symmetry_score(furniture)
        lighting_score, lighting_reasoning = self._calculate_lighting_score(furniture)
        semantic_score, semantic_reasoning = self._calculate_semantic_score(furniture)

        # 2. Merge all reasoning logs
        reasoning = (
            clutter_reasoning + 
            accessibility_reasoning + 
            flow_reasoning + 
            symmetry_reasoning + 
            lighting_reasoning + 
            semantic_reasoning
        )

        # 3. Calculate final overall weighted score
        overall = (
            clutter_score * SCORING_WEIGHTS["clutter"] +
            accessibility_score * SCORING_WEIGHTS["accessibility"] +
            flow_score * SCORING_WEIGHTS["flow"] +
            symmetry_score * SCORING_WEIGHTS["symmetry"] +
            lighting_score * SCORING_WEIGHTS["lighting"] +
            semantic_score * SCORING_WEIGHTS["semantic"]
        )

        return {
            "clutter_level": clutter_level,
            "scores": {
                "overall": int(round(overall)),
                "flow": int(round(flow_score)),
                "symmetry": int(round(symmetry_score)),
                "clutter": int(round(clutter_score)),
                "accessibility": int(round(accessibility_score)),
                "lighting": int(round(lighting_score)),
                "semantic": int(round(semantic_score))
            },
            "reasoning": reasoning
        }

    def _calculate_clutter_score(self, furniture: List[Dict[str, Any]]) -> Tuple[float, str, List[Dict[str, Any]]]:
        """
        Evaluates room openness, occupied footprint density, and free-space fragmentation.
        """
        reasoning = []
        
        # Calculate total coordinate area footprint (in percentages: 0 to 10000 range)
        total_footprint = sum(
            item["boundingBox"]["width"] * item["boundingBox"]["height"] 
            for item in furniture 
            if item.get("label", "").lower() not in ["door", "window"]
        )
        
        # Room total percentage area is 100 * 100 = 10000. Get occupied percentage:
        occupied_percentage = (total_footprint / 10000.0) * 100.0
        
        # Optimal footprint density limit is between 25% and 40% of room space
        clutter_score = 100.0
        clutter_level = "Low"
        
        if occupied_percentage > 50.0:
            clutter_score = max(10.0, 100.0 - (occupied_percentage - 40.0) * 3.0)
            clutter_level = "High"
            reasoning.append({
                "id": "obs-clutter-high",
                "title": "High Volume Density",
                "description": f"Furniture occupies {occupied_percentage:.1f}% of the room space. Spacing feels cramped.",
                "type": "warning"
            })
        elif occupied_percentage > 40.0:
            clutter_score = max(60.0, 100.0 - (occupied_percentage - 40.0) * 1.5)
            clutter_level = "Medium"
            reasoning.append({
                "id": "obs-clutter-med",
                "title": "Moderate Space Usage",
                "description": f"Furniture footprint takes up {occupied_percentage:.1f}% of space. Flow is slightly restricted.",
                "type": "info"
            })
        elif occupied_percentage < 15.0:
            clutter_score = max(70.0, 100.0 - (15.0 - occupied_percentage) * 2.0)
            reasoning.append({
                "id": "obs-clutter-under",
                "title": "Under-Furnished Layout",
                "description": f"Only {occupied_percentage:.1f}% of space is occupied. Consider adding furniture to improve utility.",
                "type": "info"
            })
        else:
            reasoning.append({
                "id": "obs-clutter-optimal",
                "title": "Optimal Spacing Mapped",
                "description": "Visual density ratings fall within recommended spatial guidelines.",
                "type": "positive"
            })

        # Evaluate layout spatial concentration (clustering check)
        centers_x = []
        centers_y = []
        for item in furniture:
            if item.get("label", "").lower() not in ["door", "window"]:
                box = item["boundingBox"]
                centers_x.append(box["x"] + box["width"] / 2.0)
                centers_y.append(box["y"] + box["height"] / 2.0)
                
        if len(centers_x) >= 3:
            mean_x = sum(centers_x) / len(centers_x)
            mean_y = sum(centers_y) / len(centers_y)
            # Calculate standard deviation of center points
            var_x = sum((x - mean_x) ** 2 for x in centers_x) / len(centers_x)
            var_y = sum((y - mean_y) ** 2 for y in centers_y) / len(centers_y)
            std_dev = math.sqrt(var_x + var_y)
            
            # If standard deviation is extremely low, it means everything is clustered in one single spot
            if std_dev < 12.0:
                clutter_score = max(10.0, clutter_score - 15.0)
                reasoning.append({
                    "id": "obs-clutter-concentration",
                    "title": "Uneven Furniture Concentration",
                    "description": "Furniture is clustered tightly in one corner of the room, leaving other areas empty.",
                    "type": "warning"
                })

        return clutter_score, clutter_level, reasoning

    def _calculate_accessibility_score(self, furniture: List[Dict[str, Any]]) -> Tuple[float, List[Dict[str, Any]]]:
        """
        Evaluates room pathfinding walkability, collision checks, and safety clearance.
        Reuses geometry_utils logic to prevent redundancy.
        """
        reasoning = []
        
        # 1. Fetch clearance score from geometry utility layer
        res = calculate_clearance_score(furniture, resolution=50)
        base_score = res["score"]
        
        # Map geometry reasoning observations directly
        for obs in res["reasoning"]:
            reasoning.append({
                "id": f"obs-access-path-{hash(obs['title']) % 1000}",
                "title": obs["title"],
                "description": obs["description"],
                "type": obs["type"]
            })

        # 2. Check for physical overlaps/collisions (IoU)
        overlaps_detected = 0
        for i in range(len(furniture)):
            for j in range(i + 1, len(furniture)):
                boxA = furniture[i]["boundingBox"]
                boxB = furniture[j]["boundingBox"]
                iou = compute_bounding_box_intersection_ratio(boxA, boxB)
                
                if iou > 0.05: # ignore minor coordinate line touches (under 5% IoU)
                    overlaps_detected += 1
                    base_score -= int(iou * 45.0)
                    reasoning.append({
                        "id": f"obs-access-overlap-{i}-{j}",
                        "title": "Furniture Overlap Detected",
                        "description": f"The {furniture[i]['label']} overlaps with the {furniture[j]['label']}. Adjust positions to avoid collisions.",
                        "type": "warning"
                    })

        accessibility_score = max(10.0, min(100.0, base_score))
        return accessibility_score, reasoning

    def _calculate_flow_score(self, accessibility: float, clutter: float) -> Tuple[float, List[Dict[str, Any]]]:
        """
        Evaluates movement corridors, circulation smoothness, and layout flow continuity.
        """
        reasoning = []
        
        # Flow is mathematically calculated from accessibility and density consistency
        flow_score = accessibility * 0.6 + clutter * 0.4
        
        if flow_score >= 85.0:
            reasoning.append({
                "id": "obs-flow-good",
                "title": "Excellent Circulation",
                "description": "The layout provides smooth, open pathways and comfortable walking corridors.",
                "type": "positive"
            })
        elif flow_score < 55.0:
            reasoning.append({
                "id": "obs-flow-bad",
                "title": "Obstructed Room Flow",
                "description": "Walking paths are severely bottlenecked. Rearrange layout to clear circulation paths.",
                "type": "warning"
            })
            
        return flow_score, reasoning

    def _calculate_symmetry_score(self, furniture: List[Dict[str, Any]]) -> Tuple[float, List[Dict[str, Any]]]:
        """
        Computes weighted centerline visual balance based on object masses and surface areas.
        """
        reasoning = []
        
        weighted_x_sum = 0.0
        weight_sum = 0.0
        
        for item in furniture:
            label = item.get("label", "Object")
            box = item["boundingBox"]
            
            # structural elements like door/windows do not contribute to visual furniture weights
            if label.lower() in ["door", "window"]:
                continue
                
            # Compute visual weight mass = constant weight * surface area
            base_mass = VISUAL_WEIGHTS.get(label, 1.5)
            area = box["width"] * box["height"]
            visual_weight = base_mass * area
            
            # Horizontal center of bounding box
            x_center = box["x"] + box["width"] / 2.0
            
            weighted_x_sum += x_center * visual_weight
            weight_sum += visual_weight

        if weight_sum > 0.0:
            weighted_x_center = weighted_x_sum / weight_sum
            # Deviation from centerline (center of room horizontal axis is 50.0)
            deviation = abs(50.0 - weighted_x_center)
            
            # Deduct points based on offset
            symmetry_score = max(10.0, min(100.0, 100.0 - deviation * 3.5))
        else:
            symmetry_score = 100.0
            deviation = 0.0

        if symmetry_score >= 85.0:
            reasoning.append({
                "id": "obs-symmetry-good",
                "title": "Balanced Spatial Balance",
                "description": "Visual weight is distributed symmetrically relative to the room centerline.",
                "type": "positive"
            })
        elif symmetry_score < 60.0:
            reasoning.append({
                "id": "obs-symmetry-imbalanced",
                "title": "Visual Weight Imbalance",
                "description": "Layout feels lopsided. Shift heavy items (like Sofa or Bed) to restore visual balance.",
                "type": "warning"
            })
            
        return symmetry_score, reasoning

    def _calculate_lighting_score(self, furniture: List[Dict[str, Any]]) -> Tuple[float, List[Dict[str, Any]]]:
        """
        Evaluates natural light exposure and detects window obstructions.
        """
        reasoning = []
        
        # Locate windows
        windows = [item for item in furniture if item.get("label", "").lower() == "window"]
        
        if not windows:
            reasoning.append({
                "id": "obs-light-no-windows",
                "title": "No Windows Detected",
                "description": "No window openings mapped. Natural daylight scoring deactivated.",
                "type": "info"
            })
            return 80.0, reasoning

        lighting_score = 90.0
        blocked_windows_count = 0
        rewarded_daylight_items = 0
        
        large_blockers = {"sofa", "bed", "bookshelf", "sideboard"}
        daylight_receivers = {"desk", "potted plant", "armchair"}

        for win in windows:
            win_box = win["boundingBox"]
            win_center_x = win_box["x"] + win_box["width"] / 2.0
            win_center_y = win_box["y"] + win_box["height"] / 2.0
            
            for item in furniture:
                label = item.get("label", "").lower()
                if label == "window":
                    continue
                    
                box = item["boundingBox"]
                item_center_x = box["x"] + box["width"] / 2.0
                item_center_y = box["y"] + box["height"] / 2.0
                
                # Check distance to window
                dist = math.hypot(win_center_x - item_center_x, win_center_y - item_center_y)
                
                if dist < 18.0:  # Proximity threshold of 18 percentage units
                    # Check horizontal/vertical alignment overlap (alignment blocking)
                    overlap_x = max(0.0, min(win_box["x"] + win_box["width"], box["x"] + box["width"]) - max(win_box["x"], box["x"]))
                    overlap_y = max(0.0, min(win_box["y"] + win_box["height"], box["y"] + box["height"]) - max(win_box["y"], box["y"]))
                    
                    is_aligned = (overlap_x > 0.0) or (overlap_y > 0.0)
                    
                    if is_aligned and label in large_blockers:
                        blocked_windows_count += 1
                        lighting_score -= 25.0
                        reasoning.append({
                            "id": f"obs-light-blocked-{hash(item['label']) % 100}",
                            "title": f"Blocked Window Light",
                            "description": f"The {item['label']} is placed directly in front of a window, blocking natural daylight.",
                            "type": "warning"
                        })
                    elif is_aligned and label in daylight_receivers:
                        rewarded_daylight_items += 1
                        lighting_score += 8.0
                        reasoning.append({
                            "id": f"obs-light-rewarded-{hash(item['label']) % 100}",
                            "title": f"Optimal Daylight Access",
                            "description": f"Placed the {item['label']} near a window to maximize natural light exposure.",
                            "type": "positive"
                        })

        if blocked_windows_count == 0 and rewarded_daylight_items == 0:
            reasoning.append({
                "id": "obs-light-clear",
                "title": "Clear Daylight Portals",
                "description": "Windows are completely unobstructed by furniture items.",
                "type": "positive"
            })
            
        lighting_score = max(10.0, min(100.0, lighting_score))
        return lighting_score, reasoning

    def _calculate_semantic_score(self, furniture: List[Dict[str, Any]]) -> Tuple[float, List[Dict[str, Any]]]:
        """
        Evaluates layout relationships using a formal Spatial Relationship Graph (NetworkX).
        """
        from app.ai.spatial.spatial_relationship_graph import SpatialRelationshipGraph
        
        reasoning = []
        
        # Build relationship graph
        graph = SpatialRelationshipGraph(furniture)
        
        rel_score = graph.compute_relationship_score()
        align_score = graph.compute_alignment_score()
        cohesion_score = graph.compute_group_cohesion()
        conv_score = graph.compute_conversation_score()
        path_score = graph.compute_path_connectivity()
        
        # Final semantic rating is a combined average of graph metrics
        final_score = (rel_score * 0.35) + (align_score * 0.20) + (cohesion_score * 0.20) + (conv_score * 0.15) + (path_score * 0.10)
        
        # Generate graph-based explainable reasoning logs
        if rel_score >= 85.0:
            reasoning.append({
                "id": "obs-graph-rel-good",
                "title": "Optimized Spatial Coherence",
                "description": "Furniture placement satisfies core semantic layout constraints and relational expectations.",
                "type": "positive"
            })
        elif rel_score < 60.0:
            reasoning.append({
                "id": "obs-graph-rel-poor",
                "title": "Weak Layout Coherence",
                "description": "Adjust spatial distances between paired items (e.g. bed bedside tables or dining chairs) to restore cohesion.",
                "type": "warning"
            })
            
        if align_score >= 85.0:
            reasoning.append({
                "id": "obs-graph-align-good",
                "title": "Sofa Focal Alignment Strengthened",
                "description": "The Sofa and media console Sideboard are correctly aligned to maximize ergonomic focal lines.",
                "type": "positive"
            })
        elif align_score < 65.0:
            reasoning.append({
                "id": "obs-graph-align-poor",
                "title": "Misaligned Focal Line",
                "description": "Sofa and TV console are offset. Align them to face each other comfortably.",
                "type": "warning"
            })
            
        if cohesion_score >= 85.0:
            reasoning.append({
                "id": "obs-graph-cohesion-good",
                "title": "Dining Cluster Cohesion Improved",
                "description": "Dining chairs are symmetrically and compactly clustered around the dining table.",
                "type": "positive"
            })
        elif cohesion_score < 65.0:
            reasoning.append({
                "id": "obs-graph-cohesion-poor",
                "title": "Fragmented Furniture Clusters",
                "description": "The dining table or bed grouping has high coordinate variance. Keep bedside tables and dining chairs compactly close to their primary nodes.",
                "type": "warning"
            })
            
        if conv_score >= 85.0:
            reasoning.append({
                "id": "obs-graph-conv-good",
                "title": "Conversational Seating Symmetry Increased",
                "description": "Seating furniture is grouped close together, forming an active conversational focal zone.",
                "type": "positive"
            })
        elif conv_score < 65.0:
            reasoning.append({
                "id": "obs-graph-conv-poor",
                "title": "Fragmented Seating Group",
                "description": "Armchairs and sofas are placed too far apart. Position them closer to encourage conversation.",
                "type": "warning"
            })
            
        if path_score >= 85.0:
            reasoning.append({
                "id": "obs-graph-path-good",
                "title": "Accessibility Pathways Connected",
                "description": "Pathway connections are fully linked from the doorway entrance to all major semantic groups.",
                "type": "positive"
            })
        elif path_score < 65.0:
            reasoning.append({
                "id": "obs-graph-path-poor",
                "title": "Isolated Semantic Zones",
                "description": "Some layout areas are inaccessible due to obstacle blocks. Clear pathways to ensure navigability.",
                "type": "warning"
            })
            
        score = max(10.0, min(100.0, final_score))
        return score, reasoning

