from app.ai.retrieval import ConceptRetrievalInterface
from typing import List

class RetrievalService:
    """Queries aesthetic templates matching specific user prompt criteria."""

    def __init__(self):
        self.retrieval_client = ConceptRetrievalInterface()

    def get_style_inspirations(self, prompt: str, style: str) -> List[str]:
        """Resolve matched image URLs based on semantic search queries."""
        return self.retrieval_client.fetch_matching_inspirations(prompt, style)
