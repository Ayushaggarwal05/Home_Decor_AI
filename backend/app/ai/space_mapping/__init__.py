from typing import Dict, Any
from app.ai.space_mapping.mapper import OccupancyGridGenerator

class SpaceMapperInterface:
    """Interface boundaries to map detected bounding frames to 2D room layouts."""

    def generate_occupancy_matrix(self, detections: list, room_dim: tuple) -> Dict[str, Any]:
        """Convert bounding boxes to occupied coordinate cells."""
        formatted_detections = []
        for det in detections:
            if hasattr(det, "label") and hasattr(det, "x"):
                formatted_detections.append({
                    "label": det.label,
                    "confidence": getattr(det, "confidence", 0.9),
                    "boundingBox": {"x": det.x, "y": det.y, "width": det.width, "height": det.height}
                })
            elif isinstance(det, dict) and "boundingBox" in det:
                formatted_detections.append(det)
            elif isinstance(det, dict) and "x" in det:
                formatted_detections.append({
                    "label": det.get("label", "Object"),
                    "confidence": det.get("confidence", 0.9),
                    "boundingBox": {"x": det["x"], "y": det["y"], "width": det["width"], "height": det["height"]}
                })
                
        generator = OccupancyGridGenerator()
        length, width = room_dim
        return generator.generate_occupancy_map(formatted_detections, room_length=length or 16.0, room_width=width or 12.0)
