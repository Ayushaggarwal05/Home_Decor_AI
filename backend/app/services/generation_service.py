from app.ai.generation import ImageGenerationInterface
from typing import Tuple, List

class GenerationService:
    """Manages invoking image redesign model grids."""

    def __init__(self):
        self.generator = ImageGenerationInterface()

    def generate_redesigned_concept(
        self, 
        image_url: str, 
        prompt: str, 
        style: str
    ) -> Tuple[str, List[str]]:
        """Invokes diffusion pipelines and returns render links and decorators advice list."""
        return self.generator.generate_redesigned_room(image_url, prompt, style)
