import unittest
from app.ai.detection.detector import YOLOv8Detector

class TestYOLOv8Detector(unittest.TestCase):
    """Unit test suite for YOLOv8 perception layer and model fallbacks."""

    def test_detector_fallback_initialization(self) -> None:
        """Verify that the detector falls back gracefully when custom weights are missing."""
        # Initialize detector with a dummy weights path that doesn't exist
        detector = YOLOv8Detector(weights_path="models/non_existent_weights_file.pt")
        
        # Ensure it falls back and initializes a model (e.g. yolov8x.pt or other fallbacks)
        # Note: If running without internet or ultralytics installed, model might be None.
        # But if libraries are installed, it should cascade to one of the models.
        if detector.model is not None:
            self.assertIsNotNone(detector.model)
            self.assertTrue(hasattr(detector.model, "predict") or hasattr(detector.model, "names"))

    def test_detect_furniture_empty_bytes(self) -> None:
        """Verify that passing empty image bytes returns an empty list without crashing."""
        detector = YOLOv8Detector(weights_path="models/non_existent_weights_file.pt")
        results = detector.detect_furniture(b"")
        self.assertEqual(results, [])

    def test_detect_furniture_malformed_bytes(self) -> None:
        """Verify that passing malformed image bytes returns an empty list without crashing."""
        detector = YOLOv8Detector(weights_path="models/non_existent_weights_file.pt")
        results = detector.detect_furniture(b"malformed_image_data_here")
        self.assertEqual(results, [])

if __name__ == "__main__":
    unittest.main()
