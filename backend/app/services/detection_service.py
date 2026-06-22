from app.ai.detection import DetectionModelInterface
from typing import List, Dict, Any

class DetectionService:
    """Coordinates calling AI detection models to map furniture bounding coordinates."""
    
    def __init__(self) -> None:
        self.detector = DetectionModelInterface()

    def detect_furniture_elements(self, image_bytes: bytes) -> List[Dict[str, Any]]:
        """Processes image files and returns unified coordinates dict format."""
        detections = self.detector.predict_objects(image_bytes)
        
        formatted_detections = []
        for idx, (label, conf, box) in enumerate(detections):
            formatted_detections.append({
                "id": idx + 1,
                "label": label,
                "confidence": conf,
                "boundingBox": {
                    "x": box[0],
                    "y": box[1],
                    "width": box[2],
                    "height": box[3]
                }
            })
        return formatted_detections
