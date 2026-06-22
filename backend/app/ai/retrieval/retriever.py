import logging
from typing import List

logger = logging.getLogger(__name__)

# Fallback structures for local environments
try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False

class InspirationMatcher:
    """Manages visual similarity indexing utilizing CLIP embeddings."""

    def __init__(self):
        # Sample database catalog of inspiration layout concepts
        self.catalog = [
            {
                "url": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
                "style": "Japandi Harmony",
                "tags": ["minimalist", "wood", "warm", "linen"]
            },
            {
                "url": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
                "style": "Industrial Loft",
                "tags": ["brick", "iron", "dark", "leather"]
            },
            {
                "url": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
                "style": "Scandinavian Crisp",
                "tags": ["nordic", "white", "light", "pastel"]
            },
            {
                "url": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
                "style": "Modern Biophilic",
                "tags": ["greenery", "natural", "light", "oak"]
            }
        ]

    def retrieve_inspirations(self, prompt: str, style: str) -> List[str]:
        """
        Embeds user prompts and retrieves nearest neighbor visual assets.
        In production: query FAISS index using CLIP model vectors.
        """
        logger.info(f"Retrieving inspirations for style '{style}' with prompt key '{prompt}'")
        
        # Simple string-matching/tag-checking fallback
        matches = []
        words = prompt.lower().split()
        
        for item in self.catalog:
            # Match style directly or check overlap tags
            if item["style"].lower() == style.lower():
                matches.append(item["url"])
            elif any(tag in words for tag in item["tags"]):
                matches.append(item["url"])

        # Fallback to returning all if no match found
        if not matches:
            return [item["url"] for item in self.catalog[:3]]
            
        return matches
