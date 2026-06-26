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
        Evaluates ergonomic rules, functional relationships, and conversation furniture groupings.
        """
        reasoning = []
        score = 80.0
        
        # 1. Sofa facing TV focal check
        sofa = next((item for item in furniture if item.get("label", "").lower() == "sofa"), None)
        tv = next((item for item in furniture if item.get("label", "").lower() == "sideboard"), None) # Sideboard often mounts the TV
        
        if sofa and tv:
            sofa_box = sofa["boundingBox"]
            tv_box = tv["boundingBox"]
            
            sc_x = sofa_box["x"] + sofa_box["width"] / 2.0
            sc_y = sofa_box["y"] + sofa_box["height"] / 2.0
            tc_x = tv_box["x"] + tv_box["width"] / 2.0
            tc_y = tv_box["y"] + tv_box["height"] / 2.0
            
            # Check focal alignment (facing horizontally or vertically)
            aligned_h = abs(sc_y - tc_y) > 25.0 and abs(sc_x - tc_x) < 18.0
            aligned_v = abs(sc_x - tc_x) > 25.0 and abs(sc_y - tc_y) < 18.0
            
            if aligned_h or aligned_v:
                score += 10.0
                reasoning.append({
                    "id": "obs-sem-sofa-tv",
                    "title": "Optimal Focal Alignment",
                    "description": "The Sofa directly faces the media console (Sideboard), supporting ergonomic focal lines.",
                    "type": "positive"
                })
            else:
                score -= 10.0
                reasoning.append({
                    "id": "obs-sem-sofa-tv-poor",
                    "title": "Misaligned Focal Line",
                    "description": "The Sofa and media console are offset. Align them to face each other comfortably.",
                    "type": "warning"
                })

        # 2. Bedside tables near Beds
        beds = [item for item in furniture if item.get("label", "").lower() == "bed"]
        tables = [item for item in furniture if item.get("label", "").lower() == "sideboard"]
        
        if beds and tables:
            for bed in beds:
                bed_box = bed["boundingBox"]
                bc_x = bed_box["x"] + bed_box["width"] / 2.0
                bc_y = bed_box["y"] + bed_box["height"] / 2.0
                
                has_nearby_table = False
                for t in tables:
                    t_box = t["boundingBox"]
                    tc_x = t_box["x"] + t_box["width"] / 2.0
                    tc_y = t_box["y"] + t_box["height"] / 2.0
                    
                    dist = math.hypot(bc_x - tc_x, bc_y - tc_y)
                    if dist < 22.0:
                        has_nearby_table = True
                        break
                        
                if has_nearby_table:
                    score += 5.0
                    reasoning.append({
                        "id": "obs-sem-bed-table",
                        "title": "Convenient Nightstands",
                        "description": "Storage tables are placed adjacent to the Bed for easy access.",
                        "type": "positive"
                    })
                else:
                    score -= 5.0
                    reasoning.append({
                        "id": "obs-sem-bed-table-missing",
                        "title": "Isolated Bedside Area",
                        "description": "The Bed bedside area lacks nearby storage surfaces. Position side tables next to the Bed.",
                        "type": "warning"
                    })

        # 3. Chairs near Dining Table
        tables_dining = [item for item in furniture if item.get("label", "").lower() == "dining table"]
        chairs = [item for item in furniture if item.get("label", "").lower() == "chair"]
        
        if tables_dining and chairs:
            for t_din in tables_dining:
                t_box = t_din["boundingBox"]
                tc_x = t_box["x"] + t_box["width"] / 2.0
                tc_y = t_box["y"] + t_box["height"] / 2.0
                
                chairs_nearby = 0
                for ch in chairs:
                    ch_box = ch["boundingBox"]
                    cc_x = ch_box["x"] + ch_box["width"] / 2.0
                    cc_y = ch_box["y"] + ch_box["height"] / 2.0
                    
                    dist = math.hypot(tc_x - cc_x, tc_y - cc_y)
                    if dist < 22.0:
                        chairs_nearby += 1
                        
                if chairs_nearby >= 2:
                    score += 8.0
                    reasoning.append({
                        "id": "obs-sem-dining-chairs",
                        "title": "Functional Dining Zone",
                        "description": f"Chairs are grouped around the Dining Table to support seating.",
                        "type": "positive"
                    })
                else:
                    score -= 10.0
                    reasoning.append({
                        "id": "obs-sem-dining-chairs-missing",
                        "title": "Isolated Dining Table",
                        "description": "Dining Table has insufficient seating nearby. Position dining chairs adjacent to the table.",
                        "type": "warning"
                    })

        # 4. Seating groupings (conversation zones)
        seating_items = [item for item in furniture if item.get("label", "") in SEATING_FURNITURE]
        if len(seating_items) >= 2:
            avg_dist_seating = 0.0
            comparisons = 0
            for i in range(len(seating_items)):
                for j in range(i + 1, len(seating_items)):
                    boxA = seating_items[i]["boundingBox"]
                    boxB = seating_items[j]["boundingBox"]
                    ax = boxA["x"] + boxA["width"] / 2.0
                    ay = boxA["y"] + boxA["height"] / 2.0
                    bx = boxB["x"] + boxB["width"] / 2.0
                    by = boxB["y"] + boxB["height"] / 2.0
                    avg_dist_seating += math.hypot(ax - bx, ay - by)
                    comparisons += 1
                    
            if comparisons > 0:
                mean_dist = avg_dist_seating / comparisons
                if mean_dist < 32.0:
                    score += 5.0
                    reasoning.append({
                        "id": "obs-sem-grouping",
                        "title": "Social Seating Group",
                        "description": "Seating furniture is clustered close together to form a conversational focal zone.",
                        "type": "positive"
                    })
                elif mean_dist > 50.0:
                    score -= 5.0
                    reasoning.append({
                        "id": "obs-sem-grouping-far",
                        "title": "Isolated Seating Items",
                        "description": "Seating layout is fragmented. Group chairs and sofas closer together for visual focus.",
                        "type": "warning"
                    })

        score = max(10.0, min(100.0, score))
        return score, reasoning

