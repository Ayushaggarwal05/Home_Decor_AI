import logging
import time
from typing import Dict, Any

logger = logging.getLogger(__name__)

try:
    import cv2
    import numpy as np
    HAS_CV = True
except ImportError:
    HAS_CV = False
    logger.warning("OpenCV not found for segmentation mapper pipeline.")


class RoomSegmenter:
    """
    Classical computer-vision room boundary extractor.

    Replaces a foundation segmentation model (e.g. SAM) with a lightweight,
    deterministic, CPU-only pipeline:

        grayscale -> Gaussian blur -> Otsu threshold -> Canny edges
        -> morphological closing -> external contour extraction
        (Suzuki-Abe border following, as implemented by cv2.findContours)
        -> Douglas-Peucker polygon simplification

    Output is the largest enclosed boundary polygon in the frame, normalized
    to percentage coordinates [0, 100] x [0, 100], plus the free-space area
    it covers as a percentage of the full frame.
    """

    def __init__(
        self,
        gaussian_kernel: int = 5,
        gaussian_sigma: float = 1.2,
        morph_kernel: int = 7,
        dp_epsilon_ratio: float = 0.02,
    ):
        self.gaussian_kernel = gaussian_kernel
        self.gaussian_sigma = gaussian_sigma
        self.morph_kernel = morph_kernel
        self.dp_epsilon_ratio = dp_epsilon_ratio

    def segment_walls_and_floor(self, image_bytes: bytes) -> Dict[str, Any]:
        if not HAS_CV:
            return self._fallback_result(reason="opencv_unavailable")

        t0 = time.perf_counter()
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                return self._fallback_result(reason="decode_failed")

            h, w = img.shape[:2]

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            k = self.gaussian_kernel
            blurred = cv2.GaussianBlur(gray, (k, k), self.gaussian_sigma)

            otsu_val, _ = cv2.threshold(
                blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
            )
            t_low = max(0.0, 0.5 * otsu_val)
            t_high = otsu_val
            edges = cv2.Canny(blurred, t_low, t_high)

            kernel = cv2.getStructuringElement(
                cv2.MORPH_RECT, (self.morph_kernel, self.morph_kernel)
            )
            closed = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)

            contours, _ = cv2.findContours(
                closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
            )

            if not contours:
                return self._fallback_result(reason="no_contours_found")

            largest = max(contours, key=cv2.contourArea)
            raw_points = len(largest)

            perimeter = cv2.arcLength(largest, True)
            epsilon = self.dp_epsilon_ratio * perimeter
            approx = cv2.approxPolyDP(largest, epsilon, True)

            polygon_norm = [
                [round(float(pt[0][0]) / w * 100.0, 2), round(float(pt[0][1]) / h * 100.0, 2)]
                for pt in approx
            ]

            contour_area_px = cv2.contourArea(largest)
            free_space_area = round(contour_area_px / (w * h) * 100.0, 2)

            latency_ms = round((time.perf_counter() - t0) * 1000.0, 3)

            return {
                "floor_mask": polygon_norm,
                "walls_polygon": [[0.0, 0.0], [100.0, 0.0], [100.0, 100.0], [0.0, 100.0]],
                "free_space_area": free_space_area,
                "num_contour_points": raw_points,
                "num_polygon_points": len(approx),
                "otsu_threshold": round(float(otsu_val), 2),
                "latency_ms": latency_ms,
                "method": "classical_cv_gaussian_otsu_canny_dp",
                "image_w": w,
                "image_h": h,
            }

        except Exception as e:
            logger.error(f"Error in classical CV boundary extractor: {e}")
            return self._fallback_result(reason=f"exception:{e}")

    def _fallback_result(self, reason: str) -> Dict[str, Any]:
        return {
            "floor_mask": [],
            "walls_polygon": [[0.0, 0.0], [100.0, 0.0], [100.0, 100.0], [0.0, 100.0]],
            "free_space_area": 0.0,
            "num_contour_points": 0,
            "num_polygon_points": 0,
            "latency_ms": 0.0,
            "method": "fallback",
            "fallback_reason": reason,
        }
