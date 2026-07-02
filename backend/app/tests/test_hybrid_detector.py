import unittest
from unittest.mock import MagicMock, patch
import torch
from app.ai.detection.detector import (
    YOLOv8Detector, 
    reconcile_labels, 
    map_label_to_canonical, 
    map_label_to_semantic_category, 
    calculate_room_relevance_score, 
    suppress_duplicate_detections
)

class TestHybridDetector(unittest.TestCase):
    """Unit test suite for YOLOv8 + Grounding DINO Hybrid Detector features."""

    def test_label_reconciliation(self) -> None:
        """Verify label reconciliation logic for chair, sofa, sideboard, etc."""
        self.assertEqual(reconcile_labels("chair", "armchair"), "Armchair")
        self.assertEqual(reconcile_labels("armchair", "chair"), "Armchair")
        self.assertEqual(reconcile_labels("couch", "sofa"), "Sofa")
        self.assertEqual(reconcile_labels("cabinet", "sideboard"), "Sideboard")
        self.assertEqual(reconcile_labels("coffee table", "side table"), "Coffee Table")
        self.assertEqual(reconcile_labels("unknown_object", "bed"), "Bed")

    def test_semantic_category_mapping(self) -> None:
        """Verify semantic category mapping."""
        self.assertEqual(map_label_to_semantic_category("Sofa"), "Seating")
        self.assertEqual(map_label_to_semantic_category("Armchair"), "Seating")
        self.assertEqual(map_label_to_semantic_category("Coffee Table"), "Tables")
        self.assertEqual(map_label_to_semantic_category("Bed"), "Sleeping")
        self.assertEqual(map_label_to_semantic_category("Sideboard"), "Storage")
        self.assertEqual(map_label_to_semantic_category("Door"), "Structural")
        self.assertEqual(map_label_to_semantic_category("Potted Plant"), "Decor")
        self.assertEqual(map_label_to_semantic_category("unknown"), "Furniture")

    def test_room_relevance_score(self) -> None:
        """Verify room relevance scoring weights."""
        self.assertEqual(calculate_room_relevance_score("Sofa"), 1.0)
        self.assertEqual(calculate_room_relevance_score("Bed"), 1.0)
        self.assertEqual(calculate_room_relevance_score("Door"), 0.9)
        self.assertEqual(calculate_room_relevance_score("Bookshelf"), 0.8)
        self.assertEqual(calculate_room_relevance_score("Potted Plant"), 0.5)

    def test_duplicate_suppression(self) -> None:
        """Verify that duplicate overlap suppression resolves overlapping boxes."""
        # Box 1: [10, 10, 20, 20]
        # Box 2: [11, 11, 21, 21]
        # Intersect: [11, 11, 20, 20] -> Area = 9 * 9 = 81
        # Union: 100 + 100 - 81 = 119
        # IoU = 81 / 119 = 0.68
        detections = [
            {
                "label": "Chair",
                "confidence": 0.9,
                "boundingBox": {"x": 10.0, "y": 10.0, "width": 10.0, "height": 10.0}
            },
            {
                "label": "Armchair",
                "confidence": 0.8,
                "boundingBox": {"x": 11.0, "y": 11.0, "width": 10.0, "height": 10.0}
            }
        ]
        res = suppress_duplicate_detections(detections, iou_threshold=0.5)
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0]["label"], "Chair")

    @patch("app.ai.detection.detector.requests.post")
    @patch("app.ai.detection.detector.YOLO")
    def test_mocked_hybrid_pipeline(self, mock_yolo, mock_post) -> None:
        """Verify full pipeline runs and performs fusion under mocked model outputs."""
        # Clear cache singleton to ensure mocks are used
        from app.ai.detection.detector import ModelRegistry
        ModelRegistry.yolo_model = None
        ModelRegistry.yolo_weights_path = None
        ModelRegistry.dino_model = None
        ModelRegistry.dino_processor = None
        ModelRegistry.dino_model_name = None

        # Setup YOLO mocks
        mock_yolo_instance = MagicMock()
        mock_yolo.return_value = mock_yolo_instance
        
        mock_box = MagicMock()
        mock_box.cls = torch.tensor([10])  # Chair classId
        mock_box.conf = torch.tensor([0.8])
        mock_box.xyxy = torch.tensor([[10.0, 10.0, 90.0, 90.0]])
        
        mock_result = MagicMock()
        mock_result.boxes = [mock_box]
        mock_yolo_instance.return_value = [mock_result]
        
        # Setup requests.post mock for serverless zero-shot API
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [
            {
                "score": 0.7,
                "label": "armchair",
                "box": {
                    "xmin": 10.0,
                    "ymin": 10.0,
                    "xmax": 90.0,
                    "ymax": 90.0
                }
            }
        ]
        mock_post.return_value = mock_response
        
        # Initialize detector with mock configuration under patched HF settings
        from app.core.config import settings
        with patch.object(settings, "HF_TOKEN", "mock_token"):
            detector = YOLOv8Detector(
                weights_path="mock_yolo.pt",
                yolo_weight=0.6,
                dino_weight=0.4,
                iou_match_threshold=0.4
            )
            
            # Create mock 100x100 image bytes
            import cv2
            import numpy as np
            img = np.zeros((100, 100, 3), dtype=np.uint8)
            _, img_bytes = cv2.imencode(".jpg", img)
            
            results = detector.detect_furniture(img_bytes.tobytes())
        
        self.assertEqual(len(results), 1)
        res = results[0]
        self.assertEqual(res["label"], "Armchair")
        # Fusion confidence: 0.6 * 0.8 + 0.4 * 0.7 = 0.48 + 0.28 = 0.76
        self.assertAlmostEqual(res["confidence"], 0.76, places=3)
        self.assertEqual(res["detection_source"], "YOLOv8+GroundingDINO")
        self.assertEqual(res["semantic_category"], "Seating")
        self.assertEqual(res["room_relevance_score"], 1.0)

if __name__ == "__main__":
    unittest.main()
