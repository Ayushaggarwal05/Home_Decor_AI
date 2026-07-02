import logging
import time
import uuid
from typing import List, Dict, Any, Tuple, Optional
import cv2
import numpy as np
import torch
import requests
import base64
from PIL import Image
from ultralytics import YOLO
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection

logger = logging.getLogger(__name__)

# Resilient import of geometry utilities for IoU calculation
try:
    from app.utils.geometry_utils import compute_bounding_box_intersection_ratio
except ImportError:
    def compute_bounding_box_intersection_ratio(boxA: Optional[dict], boxB: Optional[dict]) -> float:
        """
        Fallback IoU calculation in case geometry utilities cannot be imported.
        Expects coordinates format: {x, y, width, height}
        """
        if not boxA or not isinstance(boxA, dict) or not boxB or not isinstance(boxB, dict):
            return 0.0
        try:
            x1_A, y1_A = float(boxA['x']), float(boxA['y'])
            w_A, h_A = float(boxA['width']), float(boxA['height'])
            x1_B, y1_B = float(boxB['x']), float(boxB['y'])
            w_B, h_B = float(boxB['width']), float(boxB['height'])
            if w_A <= 0 or h_A <= 0 or w_B <= 0 or h_B <= 0:
                return 0.0
            x2_A, y2_A = x1_A + w_A, y1_A + h_A
            x2_B, y2_B = x1_B + w_B, y1_B + h_B
            xA = max(x1_A, x1_B)
            yA = max(y1_A, y1_B)
            xB = min(x2_A, x2_B)
            yB = min(y2_A, y2_B)
            inter_area = max(0.0, xB - xA) * max(0.0, yB - yA)
            if inter_area <= 0.0:
                return 0.0
            union_area = (w_A * h_A) + (w_B * h_B) - inter_area
            return inter_area / union_area if union_area > 0 else 0.0
        except Exception:
            return 0.0


class ModelRegistry:
    """
    Singleton cache registry to manage loaded PyTorch and YOLO models in memory.
    Prevents repeated reload latency and model duplication overhead.
    """
    yolo_model: Optional[YOLO] = None
    yolo_weights_path: Optional[str] = None
    dino_model: Optional[Any] = None
    dino_processor: Optional[Any] = None
    dino_model_name: Optional[str] = None


def map_label_to_canonical(label: str) -> str:
    """
    Translates raw class labels into canonical Home Decor standard furniture vocabulary.
    """
    lbl_lower = label.lower().strip()
    mapping = {
        "sofa": "Sofa",
        "couch": "Sofa",
        "bed": "Bed",
        "dining table": "Dining Table",
        "coffee table": "Coffee Table",
        "side table": "Coffee Table",
        "chair": "Chair",
        "desk": "Desk",
        "bookshelf": "Bookshelf",
        "cabinet": "Sideboard",
        "sideboard": "Sideboard",
        "potted plant": "Potted Plant",
        "tv console": "Sideboard",
        "door": "Door",
        "window": "Window",
        "armchair": "Armchair"
    }
    for key, val in mapping.items():
        if key == lbl_lower or key in lbl_lower or lbl_lower in key:
            return val
    return label.capitalize()


def reconcile_labels(yolo_label: str, dino_label: str) -> str:
    """
    Resolves discrepancies between YOLO classes and Grounding DINO labels
    using class hierarchy and semantic specificity.
    """
    yl = yolo_label.lower().strip()
    dl = dino_label.lower().strip()

    # Seating specificity reconciliation
    if "chair" in yl and "armchair" in dl:
        return "Armchair"
    if "armchair" in yl and "chair" in dl:
        return "Armchair"

    # Couch / Sofa standardizing
    if yl in ["sofa", "couch"] or dl in ["sofa", "couch"]:
        return "Sofa"

    # Storage and TV console mappings
    if yl in ["sideboard", "cabinet", "tv console"] or dl in ["sideboard", "cabinet", "tv console"]:
        return "Sideboard"

    # Table categories standardizing
    if yl in ["coffee table", "side table"] or dl in ["coffee table", "side table"]:
        return "Coffee Table"

    # Fallback to standard canonical vocabularies
    canonical_list = [
        "Sofa", "Coffee Table", "Armchair", "Sideboard", "Bed", "Desk",
        "Bookshelf", "Door", "Window", "Dining Table", "Chair", "Potted Plant"
    ]
    yolo_can = map_label_to_canonical(yolo_label)
    dino_can = map_label_to_canonical(dino_label)

    if yolo_can in canonical_list:
        return yolo_can
    if dino_can in canonical_list:
        return dino_can

    return yolo_can


def map_label_to_semantic_category(label: str) -> str:
    """
    Categorizes furniture labels into general layout-related semantic families.
    """
    lbl = label.lower()
    if any(k in lbl for k in ["sofa", "couch", "armchair", "chair"]):
        return "Seating"
    if any(k in lbl for k in ["table", "desk"]):
        return "Tables"
    if "bed" in lbl:
        return "Sleeping"
    if any(k in lbl for k in ["bookshelf", "sideboard", "cabinet", "console"]):
        return "Storage"
    if any(k in lbl for k in ["door", "window"]):
        return "Structural"
    if "plant" in lbl:
        return "Decor"
    return "Furniture"


def calculate_room_relevance_score(label: str) -> float:
    """
    Returns a layout weight score (0.0 to 1.0) representing layout constraint priority.
    """
    lbl = label.lower()
    # Primary room layout objects
    if any(k in lbl for k in ["sofa", "couch", "bed", "dining table", "desk", "armchair", "coffee table"]):
        return 1.0
    # Secondary objects or structural features
    if any(k in lbl for k in ["door", "window"]):
        return 0.9
    if any(k in lbl for k in ["bookshelf", "sideboard", "cabinet"]):
        return 0.8
    # Flexible decor
    if "plant" in lbl:
        return 0.5
    return 0.6


def suppress_duplicate_detections(detections: List[Dict[str, Any]], iou_threshold: float = 0.5) -> List[Dict[str, Any]]:
    """
    Non-Maximum Suppression (NMS) designed specifically to remove duplicate or highly 
    overlapping predictions belonging to matching labels or subclass groups.
    """
    sorted_dets = sorted(detections, key=lambda x: x["confidence"], reverse=True)
    kept = []

    for det in sorted_dets:
        box = det["boundingBox"]
        overlap = False
        for k_det in kept:
            k_box = k_det["boundingBox"]
            iou = compute_bounding_box_intersection_ratio(box, k_box)
            if iou > iou_threshold:
                # Check subclass matches (e.g. Chair and Armchair overlapping)
                lbl1, lbl2 = det["label"].lower(), k_det["label"].lower()
                is_similar_class = (
                    lbl1 == lbl2 or
                    ("chair" in lbl1 and "chair" in lbl2) or
                    ("sofa" in lbl1 and "sofa" in lbl2) or
                    ("table" in lbl1 and "table" in lbl2)
                )
                if is_similar_class:
                    overlap = True
                    logger.info(
                        f"NMS Suppressed: Overlap between {det['label']} ({det['confidence']:.2f}) "
                        f"and {k_det['label']} ({k_det['confidence']:.2f}) with IoU: {iou:.2f}"
                    )
                    break
        if not overlap:
            kept.append(det)

    return kept


class YOLOv8Detector:
    """
    Hybrid YOLOv8 + Grounding DINO semantic spatial perception engine.
    Integrates deep learning inference, hardware acceleration mapping,
    and a robust cascade fallback mechanism with confidence fusion.
    """

    def __init__(
        self, 
        weights_path: str = "yolov8x.pt", 
        conf_threshold: float = 0.5, 
        iou_threshold: float = 0.45,
        dino_model_name: str = "IDEA-Research/grounding-dino-tiny",
        yolo_weight: float = 0.55,
        dino_weight: float = 0.45,
        dino_box_threshold: float = 0.25,
        dino_text_threshold: float = 0.25,
        iou_match_threshold: float = 0.4,
        adaptive_yolo_threshold: float = 0.55,
        dino_only_threshold: float = 0.35,
        dedup_iou_threshold: float = 0.5
    ) -> None:
        self.weights_path = weights_path
        self.conf_threshold = conf_threshold
        self.iou_threshold = iou_threshold
        
        # Configuration for hybrid models
        self.dino_model_name = dino_model_name
        self.yolo_weight = yolo_weight
        self.dino_weight = dino_weight
        self.dino_box_threshold = dino_box_threshold
        self.dino_text_threshold = dino_text_threshold
        self.iou_match_threshold = iou_match_threshold
        self.adaptive_yolo_threshold = adaptive_yolo_threshold
        self.dino_only_threshold = dino_only_threshold
        self.dedup_iou_threshold = dedup_iou_threshold

        # Target classification map
        self.classes = {
            0: "Sofa", 1: "Coffee Table", 2: "Armchair", 3: "Sideboard",
            4: "Bed", 5: "Desk", 6: "Bookshelf", 7: "Door", 8: "Window",
            9: "Dining Table", 10: "Chair", 11: "Potted Plant"
        }
        self.label_to_class_id = {v: k for k, v in self.classes.items()}

        # Prompts specifically targeted for indoor room object grounding
        self.dino_prompts = [
            "sofa", "couch", "bed", "dining table", "coffee table", "side table",
            "chair", "desk", "bookshelf", "cabinet", "sideboard", "potted plant",
            "TV console", "door", "window"
        ]

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model: Optional[YOLO] = None
        self.dino_model: Optional[Any] = None
        self.dino_processor: Optional[Any] = None

        # Run model bootloader
        self.load_model()

    def load_model(self) -> None:
        """
        Initializes YOLOv8 and Grounding DINO networks using lazy loading cached singletons.
        Implements cascade CPU-GPU fallback configurations.
        """
        # 1. Load YOLOv8 Model
        if ModelRegistry.yolo_model is not None and ModelRegistry.yolo_weights_path == self.weights_path:
            self.model = ModelRegistry.yolo_model
            logger.info("YOLOv8 retrieved from cache singleton.")
        else:
            fallback_weights = [self.weights_path, "yolov8x.pt", "yolov8m.pt", "yolov8n.pt"]
            loaded = False
            for weights_file in fallback_weights:
                try:
                    logger.info(f"Attempting to load YOLOv8 from '{weights_file}' on '{self.device}'")
                    model = YOLO(weights_file)
                    model.to(self.device)
                    
                    # Warmup run to compile and initialize CUDA contexts
                    try:
                        dummy_img = np.zeros((640, 640, 3), dtype=np.uint8)
                        model(dummy_img, verbose=False, device=self.device)
                        logger.info("YOLOv8 warmup executed successfully.")
                    except Exception as wu_err:
                        logger.warning(f"YOLOv8 warmup failed: {wu_err}")

                    self.model = model
                    ModelRegistry.yolo_model = model
                    ModelRegistry.yolo_weights_path = weights_file
                    self.weights_path = weights_file
                    loaded = True
                    break
                except Exception as e:
                    logger.warning(f"Failed loading YOLOv8 '{weights_file}' on '{self.device}': {e}.")
                    # Device load fallback to CPU if CUDA failure occurred
                    if self.device == "cuda":
                        try:
                            logger.info(f"Retrying YOLOv8 '{weights_file}' on 'cpu' fallback...")
                            model = YOLO(weights_file)
                            model.to("cpu")
                            self.device = "cpu"
                            
                            # Warmup on CPU
                            dummy_img = np.zeros((640, 640, 3), dtype=np.uint8)
                            model(dummy_img, verbose=False, device="cpu")

                            self.model = model
                            ModelRegistry.yolo_model = model
                            ModelRegistry.yolo_weights_path = weights_file
                            self.weights_path = weights_file
                            loaded = True
                            break
                        except Exception as cpu_err:
                            logger.warning(f"CPU load fallback failed for YOLOv8 weights: {cpu_err}")

            if not loaded:
                logger.critical("All YOLOv8 model loading sequences failed. Primary detection is disabled.")
                self.model = None

        # 2. Load Grounding DINO Model
        # Bypassed local loading: Serverless HF Inference API is configured for Zero-Shot Object Detection
        self.dino_model = None
        self.dino_processor = None

    def detect_furniture(
        self, 
        image_bytes: bytes, 
        resize_to: Optional[Tuple[int, int]] = None
    ) -> List[Dict[str, Any]]:
        """
        Runs object detection inferences over raw image bytes using the hybrid pipeline.
        Fuses predictions from YOLOv8 and Grounding DINO to produce highly precise layout detections.
        """
        if not image_bytes:
            logger.warning("Inference cancelled: Empty image stream received.")
            return []

        # 1. Decode Image
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            logger.error(f"Failed decoding image bytes stream: {e}", exc_info=True)
            return []

        if img is None:
            logger.warning("Inference aborted: Malformed or unreadable image bytes.")
            return []

        if resize_to:
            img = cv2.resize(img, resize_to)

        image_height, image_width, _ = img.shape
        if image_width == 0 or image_height == 0:
            logger.warning("Inference aborted: Image dimension cannot be zero.")
            return []

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # 2. YOLOv8 Detections Run
        yolo_detections = []
        if self.model is not None:
            try:
                start_yolo = time.time()
                results = self.model(
                    img_rgb,
                    conf=self.conf_threshold,
                    iou=self.iou_threshold,
                    verbose=False,
                    device=self.device
                )
                logger.info(f"YOLOv8 inference completed in {time.time() - start_yolo:.4f}s.")

                if results:
                    for result in results:
                        boxes = result.boxes
                        if boxes is None:
                            continue
                        for box in boxes:
                            cls_id = int(box.cls[0].item())
                            conf = float(box.conf[0].item())
                            
                            xyxy = box.xyxy[0].tolist()
                            x1, y1, x2, y2 = xyxy[0], xyxy[1], xyxy[2], xyxy[3]

                            # Convert coordinate box frame to room spacing percentage scale
                            x = max(0.0, min(100.0, (x1 / image_width) * 100.0))
                            y = max(0.0, min(100.0, (y1 / image_height) * 100.0))
                            width = max(0.0, min(100.0 - x, ((x2 - x1) / image_width) * 100.0))
                            height = max(0.0, min(100.0 - y, ((y2 - y1) / image_height) * 100.0))

                            label = self.classes.get(cls_id)
                            if not label and hasattr(self.model, "names") and cls_id in self.model.names:
                                raw_name = self.model.names[cls_id]
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

                            yolo_detections.append({
                                "label": label,
                                "classId": cls_id,
                                "confidence": conf,
                                "boundingBox": {
                                    "x": round(x, 2),
                                    "y": round(y, 2),
                                    "width": round(width, 2),
                                    "height": round(height, 2)
                                }
                            })
            except Exception as y_err:
                logger.error(f"Error executing YOLOv8 inference pipeline: {y_err}", exc_info=True)

        # 3. Grounding DINO Detections Run via Serverless API
        dino_detections = []
        from app.core.config import settings
        
        hf_token = getattr(settings, "HF_TOKEN", None)
        if hf_token:
            try:
                start_dino = time.time()
                # Encode image to base64
                img_b64 = base64.b64encode(image_bytes).decode('utf-8')
                
                model_id = getattr(settings, "DINO_API_MODEL", "google/owlv2-base-patch16-ensemble")
                api_url = f"https://api-inference.huggingface.co/models/{model_id}"
                
                headers = {"Authorization": f"Bearer {hf_token}"}
                payload = {
                    "inputs": img_b64,
                    "parameters": {
                        "candidate_labels": self.dino_prompts
                    }
                }
                
                # Retry loop to handle 503 model-loading codes gracefully
                retries = 3
                wait_time = 5.0
                response = None
                for attempt in range(retries):
                    try:
                        response = requests.post(api_url, headers=headers, json=payload, timeout=25)
                        if response.status_code == 200:
                            break
                        elif response.status_code == 503:
                            err_data = response.json()
                            est_time = err_data.get("estimated_time", wait_time)
                            sleep_dur = min(est_time, 10.0)
                            logger.warning(f"Model {model_id} is loading on HF. Retrying in {sleep_dur}s (Attempt {attempt+1}/{retries})...")
                            time.sleep(sleep_dur)
                        else:
                            break
                    except requests.RequestException as req_err:
                        logger.warning(f"Network error on HF API call: {req_err}. Retrying...")
                        time.sleep(2.0)
                
                if response is not None and response.status_code == 200:
                    api_results = response.json()
                    logger.info(f"Hugging Face Zero-Shot API inference completed in {time.time() - start_dino:.4f}s.")
                    
                    if isinstance(api_results, list):
                        for det in api_results:
                            score = det.get("score", 0.0)
                            label_str = det.get("label", "Object")
                            box = det.get("box", {})
                            
                            # Filter weak detections based on threshold
                            if score < self.dino_box_threshold:
                                continue
                                
                            x1 = float(box.get("xmin", 0.0))
                            y1 = float(box.get("ymin", 0.0))
                            x2 = float(box.get("xmax", 0.0))
                            y2 = float(box.get("ymax", 0.0))
                            
                            # Normalize to room percentage coordinate scale
                            x = max(0.0, min(100.0, (x1 / image_width) * 100.0))
                            y = max(0.0, min(100.0, (y1 / image_height) * 100.0))
                            width = max(0.0, min(100.0 - x, ((x2 - x1) / image_width) * 100.0))
                            height = max(0.0, min(100.0 - y, ((y2 - y1) / image_height) * 100.0))
                            
                            dino_detections.append({
                                "label": label_str,
                                "confidence": score,
                                "boundingBox": {
                                    "x": round(x, 2),
                                    "y": round(y, 2),
                                    "width": round(width, 2),
                                    "height": round(height, 2)
                                }
                            })
                    else:
                        logger.error(f"Hugging Face API returned unexpected structure: {api_results}")
                elif response is not None:
                    logger.error(f"Hugging Face API error: {response.status_code} - {response.text}")
                else:
                    logger.error("Hugging Face API connection failed. No response received.")
            except Exception as d_err:
                logger.error(f"Error calling Hugging Face Zero-Shot Detection API: {d_err}", exc_info=True)
        else:
            logger.warning("HF_TOKEN is not configured in settings. Skipping serverless Zero-Shot DINO detection API.")

        # 4. Confidence Fusion and Multi-Model Validation Pipeline
        fused_detections = []
        dino_matched_indices = set()

        # Step 1: Match YOLO boxes with DINO boxes and fuse them
        for y_det in yolo_detections:
            best_iou = -1.0
            best_dino_idx = -1

            for d_idx, d_det in enumerate(dino_detections):
                if d_idx in dino_matched_indices:
                    continue
                iou = compute_bounding_box_intersection_ratio(y_det["boundingBox"], d_det["boundingBox"])
                if iou > best_iou:
                    best_iou = iou
                    best_dino_idx = d_idx

            if best_iou >= self.iou_match_threshold:
                d_det = dino_detections[best_dino_idx]
                dino_matched_indices.add(best_dino_idx)

                # Class label semantic reconciliation
                refined_label = reconcile_labels(y_det["label"], d_det["label"])

                # Weighted Confidence fusion formula
                fused_conf = (self.yolo_weight * y_det["confidence"]) + (self.dino_weight * d_det["confidence"])

                # Bounding box coordinate fusion (weighted average by confidence)
                total_conf = y_det["confidence"] + d_det["confidence"]
                w_yolo = y_det["confidence"] / total_conf
                w_dino = d_det["confidence"] / total_conf

                f_box = {
                    "x": round(y_det["boundingBox"]["x"] * w_yolo + d_det["boundingBox"]["x"] * w_dino, 2),
                    "y": round(y_det["boundingBox"]["y"] * w_yolo + d_det["boundingBox"]["y"] * w_dino, 2),
                    "width": round(y_det["boundingBox"]["width"] * w_yolo + d_det["boundingBox"]["width"] * w_dino, 2),
                    "height": round(y_det["boundingBox"]["height"] * w_yolo + d_det["boundingBox"]["height"] * w_dino, 2),
                }

                class_id = self.label_to_class_id.get(refined_label, y_det["classId"])

                fused_detections.append({
                    "id": str(uuid.uuid4()),
                    "label": refined_label,
                    "classId": class_id,
                    "confidence": round(fused_conf, 4),
                    "rotation": 0,
                    "boundingBox": f_box,
                    # Additive semantic details fields:
                    "semantic_category": map_label_to_semantic_category(refined_label),
                    "detection_source": "YOLOv8+GroundingDINO",
                    "refined_label": refined_label,
                    "room_relevance_score": calculate_room_relevance_score(refined_label)
                })
                logger.info(
                    f"Fused YOLO '{y_det['label']}' and DINO '{d_det['label']}' detections into '{refined_label}' "
                    f"(conf: {fused_conf:.4f}, IoU overlap: {best_iou:.4f})"
                )
            else:
                # YOLO-only detection fallback: apply adaptive threshold filters to suppress false positives
                if y_det["confidence"] >= self.adaptive_yolo_threshold:
                    refined_label = map_label_to_canonical(y_det["label"])
                    class_id = self.label_to_class_id.get(refined_label, y_det["classId"])

                    fused_detections.append({
                        "id": str(uuid.uuid4()),
                        "label": refined_label,
                        "classId": class_id,
                        "confidence": round(y_det["confidence"], 4),
                        "rotation": 0,
                        "boundingBox": y_det["boundingBox"],
                        # Additive semantic details fields:
                        "semantic_category": map_label_to_semantic_category(refined_label),
                        "detection_source": "YOLOv8",
                        "refined_label": refined_label,
                        "room_relevance_score": calculate_room_relevance_score(refined_label)
                    })
                    logger.info(f"Retained YOLO-only detection '{refined_label}' (conf: {y_det['confidence']:.4f})")
                else:
                    logger.info(
                        f"Discarded weak YOLO-only prediction '{y_det['label']}' "
                        f"(conf: {y_det['confidence']:.4f} < adaptive: {self.adaptive_yolo_threshold})"
                    )

        # Step 2: Unmatched DINO detections (discovers objects missed by YOLO)
        for d_idx, d_det in enumerate(dino_detections):
            if d_idx in dino_matched_indices:
                continue
            if d_det["confidence"] >= self.dino_only_threshold:
                refined_label = map_label_to_canonical(d_det["label"])
                class_id = self.label_to_class_id.get(refined_label, 99)  # 99 for custom Grounding DINO classes

                fused_detections.append({
                    "id": str(uuid.uuid4()),
                    "label": refined_label,
                    "classId": class_id,
                    "confidence": round(d_det["confidence"], 4),
                    "rotation": 0,
                    "boundingBox": d_det["boundingBox"],
                    # Additive semantic details fields:
                    "semantic_category": map_label_to_semantic_category(refined_label),
                    "detection_source": "GroundingDINO",
                    "refined_label": refined_label,
                    "room_relevance_score": calculate_room_relevance_score(refined_label)
                })
                logger.info(f"Discovered DINO-only detection '{refined_label}' (conf: {d_det['confidence']:.4f})")
            else:
                logger.info(
                    f"Discarded weak DINO-only prediction '{d_det['label']}' "
                    f"(conf: {d_det['confidence']:.4f} < threshold: {self.dino_only_threshold})"
                )

        # Step 3: Apply NMS-based duplicate overlap suppression
        final_detections = suppress_duplicate_detections(fused_detections, self.dedup_iou_threshold)
        logger.info(f"Fusion pipeline completed. Returned {len(final_detections)} validated spatial detections.")

        return final_detections
