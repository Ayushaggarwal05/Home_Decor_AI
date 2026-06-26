import unittest
from app.utils.geometry_utils import compute_bounding_box_intersection_ratio
from app.ai.optimization.solver import LayoutConstraintSolver
from app.ai.scoring.scorer import ExplainableScoringEngine

class TestAuraAIEngines(unittest.TestCase):
    """Unit test suite for the research-grade AI spatial engines and geometry utilities."""

    def test_iou_calculation(self):
        """Verify that intersection ratios check overlaps accurately."""
        # 1. Total overlap
        boxA = {"x": 10.0, "y": 10.0, "width": 20.0, "height": 20.0}
        boxB = {"x": 10.0, "y": 10.0, "width": 20.0, "height": 20.0}
        self.assertAlmostEqual(compute_bounding_box_intersection_ratio(boxA, boxB), 1.0)

        # 2. No overlap
        boxC = {"x": 40.0, "y": 40.0, "width": 10.0, "height": 10.0}
        self.assertAlmostEqual(compute_bounding_box_intersection_ratio(boxA, boxC), 0.0)

        # 3. Partial overlap (50% intersection side, IoU should be 0.14)
        boxD = {"x": 20.0, "y": 20.0, "width": 20.0, "height": 20.0}
        # Inter = (30-20) * (30-20) = 100. Union = 400 + 400 - 100 = 700. IoU = 100/700 = 0.1428
        self.assertAlmostEqual(compute_bounding_box_intersection_ratio(boxA, boxD), 100.0/700.0, places=4)

    def test_genetic_solver(self):
        """Verify that the Genetic Solver resolves layout coordinate constraints successfully."""
        solver = LayoutConstraintSolver(population_size=15, generations=10)
        
        # Define highly overlapping layout
        original_layout = [
            {"label": "Sofa", "boundingBox": {"x": 10.0, "y": 10.0, "width": 30.0, "height": 30.0}},
            {"label": "Coffee Table", "boundingBox": {"x": 12.0, "y": 12.0, "width": 20.0, "height": 20.0}}
        ]
        
        # Get baseline score
        scorer = ExplainableScoringEngine()
        baseline_score = scorer.calculate_room_scores(original_layout)["scores"]["overall"]

        # Run optimization
        optimized, suggestions = solver.optimize_layout(original_layout)
        
        # Verify optimized properties
        self.assertEqual(len(optimized), 2)
        self.assertTrue(len(suggestions) > 0)
        
        # Ensure optimized score is higher than baseline (GA should resolve overlaps)
        optimized_score = scorer.calculate_room_scores(optimized)["scores"]["overall"]
        self.assertGreaterEqual(optimized_score, baseline_score)

    def test_scoring_engine(self):
        """Verify that the scoring engine evaluates clutter indices and accessibility correctly."""
        scorer = ExplainableScoringEngine()
        
        # 1. Clean spacious layout
        clean_layout = [
            {"label": "Sofa", "boundingBox": {"x": 10.0, "y": 10.0, "width": 20.0, "height": 10.0}},
            {"label": "Table", "boundingBox": {"x": 75.0, "y": 50.0, "width": 10.0, "height": 10.0}}
        ]
        
        result = scorer.calculate_room_scores(clean_layout)
        self.assertEqual(result["clutter_level"], "Low")
        self.assertGreaterEqual(result["scores"]["overall"], 80)
        self.assertTrue(len(result["reasoning"]) >= 2)

        # 2. Overlapping cluttered layout
        cluttered_layout = [
            {"label": "Sofa", "boundingBox": {"x": 10.0, "y": 10.0, "width": 70.0, "height": 60.0}}, # huge area
            {"label": "Table", "boundingBox": {"x": 15.0, "y": 15.0, "width": 30.0, "height": 30.0}}
        ]
        result_cluttered = scorer.calculate_room_scores(cluttered_layout)
        self.assertEqual(result_cluttered["clutter_level"], "High")
        self.assertLess(result_cluttered["scores"]["accessibility"], 100)
        
        # Ensure overlaps are explicitly flagged in explanation
        overlap_flag = any("overlap" in item["id"] for item in result_cluttered["reasoning"])
        self.assertTrue(overlap_flag)

if __name__ == "__main__":
    unittest.main()
