from typing import Dict
from app.ai.scoring.scorer import ExplainableScoringEngine

class ScoringModelInterface:
    """Interface boundaries evaluating spatial scores (Flow, Symmetry, Accessibility, Light, Clutter)."""

    def calculate_scores(self, furniture_list: list) -> Dict[str, int]:
        """Calculates 0-100 values for spatial integrity attributes."""
        formatted_list = []
        for det in furniture_list:
            if hasattr(det, "label") and hasattr(det, "x"):
                formatted_list.append({
                    "label": det.label,
                    "confidence": getattr(det, "confidence", 0.9),
                    "boundingBox": {"x": det.x, "y": det.y, "width": det.width, "height": det.height}
                })
            elif isinstance(det, dict) and "boundingBox" in det:
                formatted_list.append(det)
            elif isinstance(det, dict) and "x" in det:
                formatted_list.append({
                    "label": det.get("label", "Object"),
                    "confidence": det.get("confidence", 0.9),
                    "boundingBox": {"x": det["x"], "y": det["y"], "width": det["width"], "height": det["height"]}
                })

        scorer = ExplainableScoringEngine()
        res = scorer.calculate_room_scores(formatted_list)
        return res["scores"]
