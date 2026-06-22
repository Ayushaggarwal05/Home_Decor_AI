from typing import List, Tuple
from app.ai.generation.generator import RedesignImageGenerator

class ImageGenerationInterface:
    """Interface boundaries wrapping Stable Diffusion / ControlNet redesign engines."""

    def __init__(self):
        self.generator = RedesignImageGenerator()

    def load_pipeline(self) -> None:
        pass

    def generate_redesigned_room(
        self, 
        image_url: str, 
        prompt: str, 
        style: str
    ) -> Tuple[str, List[str]]:
        """
        Submits image and styling prompts to the generative model.
        Returns:
            Tuple: (redesigned_image_url, list_of_suggested_decor_changes)
        """
        return self.generator.generate_redesigned_room(image_url, prompt, style)
