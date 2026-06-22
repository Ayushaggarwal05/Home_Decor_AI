from typing import List, Tuple
from app.ai.detection.detector import YOLOv8Detector

class DetectionModelInterface:
    """Interface boundaries for YOLO furniture bounding box detection models."""
    
    def __init__(self):
        self.detector = YOLOv8Detector()
        
    def load_model(self) -> None:
        """Initialize and cache model weight parameters from cloud storages."""
        self.detector.load_model()

    def predict_objects(self, image_bytes: bytes) -> List[Tuple[str, float, List[float]]]:
        """
        Receives raw image bytes and predicts object bounding coordinates.
        Returns:
            List of tuples: (label, confidence, [x, y, width, height])
        """
        detections = self.detector.detect_furniture(image_bytes)
        return [
            (d["label"], d["confidence"], [
                d["boundingBox"]["x"],
                d["boundingBox"]["y"],
                d["boundingBox"]["width"],
                d["boundingBox"]["height"]
            ])
            for d in detections
        ]
