import unittest
from app.utils.geometry_utils import (
    compute_bounding_box_intersection_ratio,
    generate_occupancy_grid,
    inflate_obstacles,
    is_cell_walkable,
    find_accessible_path,
    calculate_clearance_score,
    check_walkway_clearance
)

class TestGeometryUtils(unittest.TestCase):
    """Unit test suite for the spatial geometry engine and pathfinding engine."""

    def test_iou_safety_checks(self):
        """Verify that IoU handles valid, empty, and malformed boxes cleanly."""
        boxA = {"x": 10.0, "y": 10.0, "width": 20.0, "height": 20.0}
        boxB = {"x": 10.0, "y": 10.0, "width": 20.0, "height": 20.0}
        self.assertAlmostEqual(compute_bounding_box_intersection_ratio(boxA, boxB), 1.0)

        # Invalid/Malformed parameters
        self.assertEqual(compute_bounding_box_intersection_ratio(None, boxB), 0.0)
        self.assertEqual(compute_bounding_box_intersection_ratio({"x": 10}, boxB), 0.0)
        self.assertEqual(compute_bounding_box_intersection_ratio(boxA, {"x": 0, "y": 0, "width": -5, "height": 10}), 0.0)

    def test_occupancy_grid_mapping(self):
        """Verify that room furniture maps correctly onto the occupancy grid."""
        furniture = [
            {"label": "Sofa", "boundingBox": {"x": 20.0, "y": 20.0, "width": 10.0, "height": 10.0}}
        ]
        grid = generate_occupancy_grid(furniture, resolution=10)
        
        # Grid scale is 100/10 = 10 units per cell.
        # Sofa starts at col 2 (20/10) and occupies up to 30.0 (end col 2 since it has width 10.0).
        # Cell (2,2) should be blocked (True)
        self.assertTrue(grid[2][2])
        self.assertFalse(grid[3][3])
        # Corner (0,0) should be free (False)
        self.assertFalse(grid[0][0])

    def test_obstacle_inflation(self):
        """Verify that dilating obstacles expands bounding margins properly."""
        grid = [[False for _ in range(5)] for _ in range(5)]
        grid[2][2] = True # Block center cell
        
        inflated = inflate_obstacles(grid, padding_cells=1)
        
        # Adjacent cells should be blocked
        self.assertTrue(inflated[2][2])
        self.assertTrue(inflated[1][2]) # row-1 (above)
        self.assertTrue(inflated[2][1]) # col-1 (left)
        # Corner cells beyond radius 1 should remain walkable
        self.assertFalse(inflated[0][0])

    def test_astar_pathfinding(self):
        """Verify that A* pathfinding calculates valid coordinate pathways."""
        # Clean grid (no obstacles)
        grid = [[False for _ in range(10)] for _ in range(10)]
        
        # Path from top-left (10, 10) to bottom-right (90, 90)
        path = find_accessible_path(grid, (10.0, 10.0), (90.0, 90.0))
        self.assertIsNotNone(path)
        self.assertTrue(len(path) > 1)
        
        # Test obstructed path: place a wall completely blocking middle
        # Block row 5 entirely
        blocked_grid = [[True if r == 5 else False for c in range(10)] for r in range(10)]
        blocked_path = find_accessible_path(blocked_grid, (10.0, 10.0), (90.0, 90.0))
        self.assertIsNone(blocked_path)

    def test_clearance_scoring(self):
        """Verify that accessibility ratings deduct points accurately for blocked layouts."""
        # 1. Empty room gets 100
        res_empty = calculate_clearance_score([])
        self.assertEqual(res_empty["score"], 100.0)

        # 2. Blocked room gets lower scores
        blocked_layout = [
            # Sofa blocks center
            {"label": "Sofa", "boundingBox": {"x": 40.0, "y": 40.0, "width": 20.0, "height": 20.0}},
            # Bed blocks door/bottom center
            {"label": "Bed", "boundingBox": {"x": 40.0, "y": 80.0, "width": 20.0, "height": 18.0}}
        ]
        res_blocked = calculate_clearance_score(blocked_layout, resolution=10)
        self.assertLess(res_blocked["score"], 100.0)
        self.assertTrue(len(res_blocked["reasoning"]) > 0)

    def test_check_walkway_clearance(self):
        """Verify that clearance verifier flags tight vs clear spaces correctly."""
        # Clean room
        self.assertTrue(check_walkway_clearance([]))

        # Obstructed room center
        blocked_layout = [
            {"label": "Sofa", "boundingBox": {"x": 0.0, "y": 40.0, "width": 100.0, "height": 20.0}} # horizontal wall
        ]
        self.assertFalse(check_walkway_clearance(blocked_layout))

if __name__ == "__main__":
    unittest.main()
