from typing import List, Dict, Any
from app.utils.geometry_utils import compute_bounding_box_intersection_ratio

class ExplainableScoringEngine:
    """Evaluates spatial layouts and returns metrics along with explainable insights."""

    def calculate_room_scores(self, furniture: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluate spacing coordinates.
        Returns:
            Dict: overall, flow, symmetry, clutter, accessibility scores and observations.
        """
        if not furniture:
            return {
                "clutter_level": "Low",
                "scores": {"overall": 0, "flow": 0, "symmetry": 0, "clutter": 100, "accessibility": 0, "lighting": 100},
                "reasoning": []
            }

        # 1. Clutter rating (footprint density)
        # Sum areas of all objects
        total_footprint = sum(item["boundingBox"]["width"] * item["boundingBox"]["height"] for item in furniture)
        # Optimal footprint density is 30% to 40% of room coordinates area
        clutter_score = 100
        clutter_level = "Low"
        if total_footprint > 5000: # above 50%
            clutter_score = max(30, 100 - int((total_footprint - 5000) / 50))
            clutter_level = "High"
        elif total_footprint > 3500: # 35-50%
            clutter_score = max(65, 100 - int((total_footprint - 3500) / 100))
            clutter_level = "Medium"

        # 2. Symmetry rating
        # Compares positions of pairs relative to centerline x=50
        x_centers = [item["boundingBox"]["x"] + (item["boundingBox"]["width"] / 2) for item in furniture]
        symmetry_score = 100
        if x_centers:
            avg_x_center = sum(x_centers) / len(x_centers)
            offset = abs(50.0 - avg_x_center)
            symmetry_score = max(50, 100 - int(offset * 2.5))

        # 3. Accessibility rating (Pathway clearance check)
        accessibility_score = 100
        reasoning = []
        
        # Check overlaps
        overlap_count = 0
        for i in range(len(furniture)):
            for j in range(i + 1, len(furniture)):
                iou = compute_bounding_box_intersection_ratio(
                    furniture[i]["boundingBox"], 
                    furniture[j]["boundingBox"]
                )
                if iou > 0:
                    overlap_count += 1
                    accessibility_score -= int(iou * 50)
                    reasoning.append({
                        "id": f"obs-overlap-{i}-{j}",
                        "title": f"Overlap Collision Detected",
                        "description": f"The {furniture[i]['label']} overlaps with the {furniture[j]['label']}.",
                        "type": "warning",
                        "associatedFurnitureId": str(furniture[i].get("id", ""))
                    })

        accessibility_score = max(40, accessibility_score)

        # 4. Flow rating
        # High flow corresponds to high accessibility and low clutter
        flow_score = int((accessibility_score + (100 - (100 - clutter_score))) / 2)

        # 5. Lighting rating (mock daylight optimization)
        lighting_score = 92

        # 6. Overall average
        overall = int((flow_score + symmetry_score + clutter_score + accessibility_score + lighting_score) / 5)

        # Standard reasoning items
        if clutter_level == "High":
            reasoning.append({
                "id": "obs-clutter-high",
                "title": "High Volume Density",
                "description": "Exceeded optimal furniture footprint limits. Swapping out oversized furniture is advised.",
                "type": "warning"
            })
        else:
            reasoning.append({
                "id": "obs-clutter-low",
                "title": "Optimal Spacing Mapped",
                "description": "Visual density ratings fall within recommended clearance values.",
                "type": "positive"
            })

        if symmetry_score >= 80:
            reasoning.append({
                "id": "obs-symmetry-good",
                "title": "Balanced Spatial Weight",
                "description": "Furniture distribution is balanced symmetrically relative to room coordinates centerline.",
                "type": "positive"
            })

        return {
            "clutter_level": clutter_level,
            "scores": {
                "overall": overall,
                "flow": flow_score,
                "symmetry": symmetry_score,
                "clutter": clutter_score,
                "accessibility": accessibility_score,
                "lighting": lighting_score
            },
            "reasoning": reasoning
        }
