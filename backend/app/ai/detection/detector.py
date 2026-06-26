import logging
import time
import uuid
from typing import List, Dict, Any, Tuple, Optional
import cv2
import numpy as np
import torch
from ultralytics import YOLO

logger = logging.getLogger(__name__)

class YOLOv8Detector:
    """
    Manages YOLOv8 computer vision detection models for furniture and wall boundaries.
    Integrates real-time deep learning inference, hardware acceleration mapping, 
    and cascade fallback mechanisms for maximum resiliency.
    """

    def __init__(
        self, 
        weights_path: str = "yolov8x.pt", 
        conf_threshold: float = 0.5, 
        iou_threshold: float = 0.45
    ) -> None:
        self.weights_path = weights_path
        self.conf_threshold = conf_threshold
        self.iou_threshold = iou_threshold
        
        # Internal configuration representing database categories/labels map
        self.classes = {
            0: "Sofa", 1: "Coffee Table", 2: "Armchair", 3: "Sideboard",
            4: "Bed", 5: "Desk", 6: "Bookshelf", 7: "Door", 8: "Window",
            9: "Dining Table", 10: "Chair", 11: "Potted Plant"
        }
        
        # Set hardware execution device
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model: Optional[YOLO] = None
        
        # Execute model bootloader
        self.load_model()

    def load_model(self) -> None:
        """
        Loads weight parameters and maps tensor execution to GPU or CPU.
        Implements a cascade fallback mechanism to official models if custom weights are missing,
        and automatically falls back to CPU execution if CUDA configuration errors occur.
        """
        fallback_weights = ["yolov8x.pt", "yolov8m.pt", "yolov8n.pt"]
        
        # 1. Attempt loading the primary target weight
        try:
            logger.info(f"Attempting to load YOLOv8 model from path: '{self.weights_path}' on device '{self.device}'")
            self.model = YOLO(self.weights_path)
            self.model.to(self.device)
            logger.info(f"YOLOv8 model successfully loaded on '{self.device}'.")
            return
        except Exception as e:
            logger.warning(
                f"Failed to load weights from '{self.weights_path}' on '{self.device}': {e}. "
                "Retrying with fallback options..."
            )
            # Edge case: If CUDA failed specifically, try loading custom weights on CPU
            if self.device == "cuda":
                try:
                    logger.info("Attempting custom weights load fallback on 'cpu'...")
                    self.model = YOLO(self.weights_path)
                    self.model.to("cpu")
                    self.device = "cpu"
                    logger.info("Successfully loaded custom weights on 'cpu'.")
                    return
                except Exception as cpu_err:
                    logger.warning(f"CPU load fallback failed for custom weights: {cpu_err}")

        # 2. Fallback sequence loop (weights cascade)
        for weight_name in fallback_weights:
            try:
                logger.info(f"Attempting fallback to pretrained weight file: '{weight_name}' on device '{self.device}'...")
                self.model = YOLO(weight_name)
                self.model.to(self.device)
                logger.info(f"Successfully fallback-loaded model: '{weight_name}' on device '{self.device}'.")
                return
            except Exception as fe:
                logger.warning(f"Could not load fallback model '{weight_name}' on '{self.device}': {fe}.")
                # Edge case: Try CPU loading if CUDA fails
                if self.device == "cuda":
                    try:
                        logger.info(f"Retrying fallback model '{weight_name}' on 'cpu'...")
                        self.model = YOLO(weight_name)
                        self.model.to("cpu")
                        self.device = "cpu"
                        logger.info(f"Successfully loaded fallback model '{weight_name}' on 'cpu'.")
                        return
                    except Exception as cpu_fe:
                        logger.warning(f"CPU fallback load failed for model '{weight_name}': {cpu_fe}")

        # 3. Critical failure path
        logger.critical("All YOLOv8 model initialization attempts failed. The perception layer is disabled.")
        self.model = None

    def detect_furniture(
        self, 
        image_bytes: bytes, 
        resize_to: Optional[Tuple[int, int]] = None
    ) -> List[Dict[str, Any]]:
        """
        Runs object detection inferences over raw image streams.
        
        Args:
            image_bytes: Raw bytes of the uploaded room image.
            resize_to: Optional tuple (width, height) to resize the image before inference.
            
        Returns:
            List[Dict]: list of structured detections optimized for downstream spatial layout solvers.
        """
        if not image_bytes:
            logger.warning("Inference cancelled: Empty image stream received.")
            return []

        if self.model is None:
            logger.error("Inference aborted: No active YOLOv8 model loaded.")
            return []

        try:
            start_time = time.time()

            # 1. Convert bytes stream to numpy image tensor
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                logger.warning("Inference aborted: Malformed or unreadable image bytes.")
                return []

            # 2. Resize and normalize image tensor for input layers
            if resize_to:
                img = cv2.resize(img, resize_to)
                
            image_height, image_width, _ = img.shape
            
            # Safeguard edge case: Zero-dimension images to avoid ZeroDivisionError
            if image_width == 0 or image_height == 0:
                logger.warning("Inference aborted: Decoded image dimensions cannot be zero.")
                return []
            
            # Convert BGR (OpenCV default) to RGB for model standard alignment
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # 3. Execute YOLOv8 prediction
            results = self.model(
                img_rgb,
                conf=self.conf_threshold,
                iou=self.iou_threshold,
                verbose=False,
                device=self.device
            )

            inference_duration = time.time() - start_time
            logger.info(f"YOLOv8 inference executed in {inference_duration:.4f} seconds.")

            detections = []
            if not results:
                return detections

            # 4. Parse YOLO detections
            for result in results:
                boxes = result.boxes
                if boxes is None:
                    continue
                    
                for box in boxes:
                    # Get class index and confidence
                    cls_id = int(box.cls[0].item())
                    conf = float(box.conf[0].item())

                    # Double-check confidence filtering
                    if conf < self.conf_threshold:
                        continue

                    # Extract coordinates (xyxy box)
                    xyxy = box.xyxy[0].tolist()
                    x1, y1, x2, y2 = xyxy[0], xyxy[1], xyxy[2], xyxy[3]

                    # 5. Convert to normalized room-space coordinates (percentages)
                    # Protect against coordinates drifting slightly out of image bounds
                    x = max(0.0, min(100.0, (x1 / image_width) * 100.0))
                    y = max(0.0, min(100.0, (y1 / image_height) * 100.0))
                    width = max(0.0, min(100.0 - x, ((x2 - x1) / image_width) * 100.0))
                    height = max(0.0, min(100.0 - y, ((y2 - y1) / image_height) * 100.0))

                    # 6. Map classes dynamically using local config or loaded model names mapping
                    label = self.classes.get(cls_id)
                    if not label and hasattr(self.model, "names") and cls_id in self.model.names:
                        raw_name = self.model.names[cls_id]
                        # Map standard COCO labels to Home Decor standard models vocabulary
                        coco_mapping = {
                            "couch": "Sofa",
                            "dining table": "Dining Table",
                            "chair": "Chair",
                            "potted plant": "Potted Plant",
                            "bed": "Bed"
                        }
                        label = coco_mapping.get(raw_name.lower(), raw_name.capitalize())
                        
                    if not label:
                        label = "Object"

                    # Formulate structured JSON optimized for downstream optimization solvers
                    unique_detection_id = str(uuid.uuid4())
                    detections.append({
                        "id": unique_detection_id,
                        "label": label,
                        "classId": cls_id,
                        "confidence": round(conf, 4),
                        "rotation": 0,  # Extension point: orientation/rotation values
                        "boundingBox": {
                            "x": round(x, 2),
                            "y": round(y, 2),
                            "width": round(width, 2),
                            "height": round(height, 2)
                        }
                    })

            logger.info(f"YOLOv8 detected {len(detections)} furniture assets in the room image.")
            return detections

        except Exception as e:
            logger.error(
                f"Error in YOLOv8 detection inference pipeline: {e}. "
                "Returning empty detections list to prevent API failure.", 
                exc_info=True
            )
            return []
