from typing import Any

class SegmentationInterface:
    """Interface boundaries for Segment Anything (SAM) layout segmentation."""

    def load_model(self) -> None:
        pass

    def segment_floor_and_walls(self, image_bytes: bytes) -> Any:
        """Isolates floor plan coordinates to compute flat perspective metrics."""
        return None
