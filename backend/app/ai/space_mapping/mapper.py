from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class OccupancyGridGenerator:
    """Calculates rich 2D coordinate matrix grids and utilization metrics from spatial bounding box percentages."""

    def __init__(self, rows: int = 10, cols: int = 10):
        self.rows = rows
        self.cols = cols

    def generate_occupancy_map(
        self, 
        detections: List[Dict[str, Any]], 
        room_length: float = 16.0, 
        room_width: float = 12.0
    ) -> Dict[str, Any]:
        """
        Maps bounding box frames into a discrete row x col grid with detailed semantic metadata.
        """
        # 1. Initialize empty coordinate matrix
        grid = []
        for r in range(self.rows):
            row = []
            for c in range(self.cols):
                row.append({
                    "x": c,
                    "y": r,
                    "status": "empty",
                    "label": "Walkway",
                    "weight": 0.05
                })
            grid.append(row)

        # 2. Iterate detections and overlay coordinate cells
        # Convert percent bounds (0-100) to grid coordinates (0 to self.cols-1 / self.rows-1)
        for det in detections:
            box = det.get("boundingBox")
            if not box or not isinstance(box, dict):
                continue
                
            try:
                # Safe coordinate extraction
                x = float(box.get("x", 0.0))
                y = float(box.get("y", 0.0))
                w = float(box.get("width", 0.0))
                h = float(box.get("height", 0.0))
                
                label = det.get("label", "Object")
                confidence = float(det.get("confidence", 0.9))
                
                # Compute discrete grid index boundaries
                start_col = max(0, min(self.cols - 1, int(x / 10.0)))
                end_col = max(0, min(self.cols - 1, int((x + w - 0.1) / 10.0)))
                start_row = max(0, min(self.rows - 1, int(y / 10.0)))
                end_row = max(0, min(self.rows - 1, int((y + h - 0.1) / 10.0)))

                for r in range(start_row, end_row + 1):
                    for c in range(start_col, end_col + 1):
                        grid[r][c] = {
                            "x": c,
                            "y": r,
                            "status": "occupied",
                            "label": label,
                            "weight": confidence
                        }
            except (ValueError, TypeError) as e:
                logger.warning(f"Error mapping layout bounding box: {e}")

        # 3. Compute surrounding buffers (safety clearance buffers near occupied cells)
        for r in range(self.rows):
            for c in range(self.cols):
                if grid[r][c]["status"] == "empty":
                    # Check neighboring cells (including diagonals)
                    source_label = None
                    for dr in [-1, 0, 1]:
                        for dc in [-1, 0, 1]:
                            if dr == 0 and dc == 0:
                                continue
                            nr, nc = r + dr, c + dc
                            if 0 <= nr < self.rows and 0 <= nc < self.cols:
                                if grid[nr][nc]["status"] == "occupied":
                                    source_label = grid[nr][nc]["label"]
                                    break
                        if source_label:
                            break
                            
                    if source_label:
                        grid[r][c] = {
                            "x": c,
                            "y": r,
                            "status": "buffer",
                            "label": f"Clearance ({source_label})",
                            "weight": 0.25
                        }

        # 4. Calculate spatial coverage and utilization metrics
        total_cells = self.rows * self.cols
        occupied_count = sum(1 for r in grid for cell in r if cell["status"] == "occupied")
        buffer_count = sum(1 for r in grid for cell in r if cell["status"] == "buffer")
        empty_count = total_cells - occupied_count - buffer_count
        
        walkable_ratio = round((empty_count / total_cells) * 100)
        footprint_ratio = round((occupied_count / total_cells) * 100)
        buffer_ratio = round((buffer_count / total_cells) * 100)

        return {
            "rows": self.rows,
            "cols": self.cols,
            "grid": grid,
            "metrics": {
                "walkable_percentage": walkable_ratio,
                "footprint_percentage": footprint_ratio,
                "buffer_percentage": buffer_ratio
            }
        }
