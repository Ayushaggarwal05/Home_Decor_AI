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
        style: str,
        blueprint_id: str = None,
        blueprint_layout: list = None
    ) -> Tuple[str, List[str]]:
        """
        Submits image, styling prompts, and blueprint layout to the generative model.
        Returns:
            Tuple: (redesigned_image_url, list_of_suggested_decor_changes)
        """
        return self.generator.generate_redesigned_room(
            original_image_url=image_url,
            prompt=prompt,
            style=style,
            blueprint_id=blueprint_id,
            blueprint_layout=blueprint_layout
        )
