from typing import List
from app.ai.retrieval.retriever import InspirationMatcher

class ConceptRetrievalInterface:
    """Interface boundaries matching user styles with database catalog concepts."""

    def __init__(self):
        self.matcher = InspirationMatcher()

    def fetch_matching_inspirations(self, prompt: str, style: str) -> List[str]:
        """Returns visual catalog URLs matching search embedding vectors."""
        return self.matcher.retrieve_inspirations(prompt, style)
