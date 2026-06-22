from app.ai.scoring import ScoringModelInterface
from typing import Dict

class ScoringService:
    """Manages computation of spatial ratings."""
    
    def __init__(self):
        self.scorer = ScoringModelInterface()

    def evaluate_layout_score(self, layout_grid: list) -> Dict[str, int]:
        """Calculates Flow, Symmetry, and Clutter variables ratings."""
        return self.scorer.calculate_scores(layout_grid)
