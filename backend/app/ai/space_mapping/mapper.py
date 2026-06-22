from typing import List, Dict, Any

class OccupancyGridGenerator:
    """Calculates 2D coordinates matrix grids from spatial bounding box percentages."""

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
        Maps bounding box frames into a discrete row x col grid.
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
                    "weight": 0.05
                })
            grid.append(row)

        # 2. Iterate detections and overlay coordinate cells
        # Convert percent bounds (0-100) to grid coordinates (0-9)
        for det in detections:
            box = det["boundingBox"]
            start_col = max(0, int(box["x"] / 10))
            end_col = min(self.cols - 1, int((box["x"] + box["width"]) / 10))
            start_row = max(0, int(box["y"] / 10))
            end_row = min(self.rows - 1, int((box["y"] + box["height"]) / 10))

            for r in range(start_row, end_row + 1):
                for c in range(start_col, end_col + 1):
                    grid[r][c] = {
                        "x": c,
                        "y": r,
                        "status": "occupied",
                        "weight": det.get("confidence", 0.9)
                    }

        # 3. Compute surrounding buffers (clearance paths near furniture walls)
        for r in range(self.rows):
            for c in range(self.cols):
                if grid[r][c]["status"] == "empty":
                    # Check adjacent cells for occupancy
                    is_near_occupied = False
                    for dr in [-1, 0, 1]:
                        for dc in [-1, 0, 1]:
                            nr, nc = r + dr, c + dc
                            if 0 <= nr < self.rows and 0 <= nc < self.cols:
                                if grid[nr][nc]["status"] == "occupied":
                                    is_near_occupied = True
                                    break
                    if is_near_occupied:
                        grid[r][c] = {
                            "x": c,
                            "y": r,
                            "status": "buffer",
                            "weight": 0.25
                        }

        # 4. Calculate spatial metrics
        total_cells = self.rows * self.cols
        occupied_count = sum(1 for r in grid for cell in r if cell["status"] == "occupied")
        buffer_count = sum(1 for r in grid for cell in r if cell["status"] == "buffer")
        empty_count = total_cells - occupied_count - buffer_count
        
        walkable_ratio = round((empty_count / total_cells) * 100)
        footprint_ratio = round((occupied_count / total_cells) * 100)

        return {
            "rows": self.rows,
            "cols": self.cols,
            "grid": grid,
            "metrics": {
                "walkable_percentage": walkable_ratio,
                "footprint_percentage": footprint_ratio,
                "buffer_percentage": round((buffer_count / total_cells) * 100)
            }
        }
