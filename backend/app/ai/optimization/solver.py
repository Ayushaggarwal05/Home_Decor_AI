import random
import copy
from typing import List, Dict, Any, Tuple
from app.utils.geometry_utils import compute_bounding_box_intersection_ratio

class LayoutConstraintSolver:
    """Genetic Algorithm Optimization engine for resolving spatial furniture arrangements."""

    def __init__(
        self, 
        population_size: int = 40, 
        generations: int = 60, 
        mutation_rate: float = 0.15
    ):
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate

    def optimize_layout(
        self, 
        original_furniture: List[Dict[str, Any]], 
        room_length: float = 16.0, 
        room_width: float = 12.0
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, str]]]:
        """
        Executes Genetic Algorithm to optimize furniture coordinates.
        Returns:
            Tuple: (optimized_furniture_list, list_of_explainable_changes)
        """
        if not original_furniture:
            return [], []

        # 1. Initialize population
        population = self._initialize_population(original_furniture)
        
        # 2. GA Loop
        best_individual = population[0]
        best_fitness = -999999.0
        
        for gen in range(self.generations):
            # Calculate fitness for all individuals
            fitness_scores = [self._calculate_fitness(ind, room_length, room_width) for ind in population]
            
            # Track best
            for i, score in enumerate(fitness_scores):
                if score > best_fitness:
                    best_fitness = score
                    best_individual = copy.deepcopy(population[i])

            # Selection (Tournament selection)
            selected = self._select_parents(population, fitness_scores)
            
            # Crossover & Mutation to create next generation
            next_generation = []
            while len(next_generation) < self.population_size:
                parent1 = random.choice(selected)
                parent2 = random.choice(selected)
                child = self._crossover(parent1, parent2)
                self._mutate(child)
                next_generation.append(child)
                
            population = next_generation

        # 3. Formulate explainable changes suggestions
        suggestions = self._generate_explainable_changes(original_furniture, best_individual)
        
        return best_individual, suggestions

    def _initialize_population(self, original: List[Dict[str, Any]]) -> List[List[Dict[str, Any]]]:
        """Generates random starting layouts with slight coordinate offsets."""
        population = []
        for _ in range(self.population_size):
            individual = []
            for item in original:
                mutated_item = copy.deepcopy(item)
                box = mutated_item["boundingBox"]
                # Add random offset (-15% to +15% coordinate sliding)
                box["x"] = max(0.0, min(100.0 - box["width"], box["x"] + random.uniform(-15, 15)))
                box["y"] = max(0.0, min(100.0 - box["height"], box["y"] + random.uniform(-15, 15)))
                individual.append(mutated_item)
            population.append(individual)
        return population

    def _calculate_fitness(self, layout: List[Dict[str, Any]], length: float, width: float) -> float:
        """
        Fitness evaluator representing layout scoring variables.
        High scores = better layout. Deducts points for overlap collisions or blocking pathways.
        """
        score = 100.0

        # Penalty 1: Bounding Box overlap checks (Collision checking)
        for i in range(len(layout)):
            for j in range(i + 1, len(layout)):
                boxA = layout[i]["boundingBox"]
                boxB = layout[j]["boundingBox"]
                iou = compute_bounding_box_intersection_ratio(boxA, boxB)
                if iou > 0:
                    # Heavy penalty for overlapping furniture footprints
                    score -= iou * 65.0

        # Penalty 2: Doorway/window blockage checks
        for item in layout:
            box = item["boundingBox"]
            label = item.get("label", "").lower()
            
            # If item is placed directly in doorway entryways (lower center coordinates)
            if label not in ["door", "window"]:
                # Check proximity to edges (boundary paths clearance)
                if box["y"] + box["height"] > 95.0 and (40.0 < box["x"] < 60.0): # Mock doorway zone
                    score -= 40.0 # Heavy pathway blockage penalty

        # Reward 1: Visual weight symmetry alignments
        # Align center of coordinates with visual grid center
        x_centers = [item["boundingBox"]["x"] + (item["boundingBox"]["width"] / 2) for item in layout]
        if x_centers:
            avg_x_center = sum(x_centers) / len(x_centers)
            symmetry_offset = abs(50.0 - avg_x_center)
            score -= symmetry_offset * 0.8 # Mild penalty for asymmetrical weight

        return score

    def _select_parents(self, population: List[List[Dict[str, Any]]], scores: List[float]) -> List[List[Dict[str, Any]]]:
        """Tournament selection of fittest parents."""
        selected = []
        for _ in range(len(population) // 2):
            # Select 3 random individuals and compare
            idx1, idx2, idx3 = random.sample(range(len(population)), 3)
            best_idx = idx1
            if scores[idx2] > scores[best_idx]:
                best_idx = idx2
            if scores[idx3] > scores[best_idx]:
                best_idx = idx3
            selected.append(population[best_idx])
        return selected

    def _crossover(self, parent1: List[Dict[str, Any]], parent2: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Performs crossover by swapping coordinate parameters of elements."""
        child = []
        for i in range(len(parent1)):
            if random.random() > 0.5:
                child.append(copy.deepcopy(parent1[i]))
            else:
                child.append(copy.deepcopy(parent2[i]))
        return child

    def _mutate(self, individual: List[Dict[str, Any]]) -> None:
        """Mutates coordinates of items occasionally."""
        for item in individual:
            if random.random() < self.mutation_rate:
                box = item["boundingBox"]
                # Slight coordinate adjustment (-5% to +5% sliding)
                box["x"] = max(0.0, min(100.0 - box["width"], box["x"] + random.uniform(-5, 5)))
                box["y"] = max(0.0, min(100.0 - box["height"], box["y"] + random.uniform(-5, 5)))

    def _generate_explainable_changes(
        self, 
        original: List[Dict[str, Any]], 
        optimized: List[Dict[str, Any]]
    ) -> List[Dict[str, str]]:
        """Generates readable descriptions comparing layouts."""
        suggestions = []
        for orig_item in original:
            opt_item = next((item for item in optimized if item["label"] == orig_item["label"]), None)
            if not opt_item:
                continue

            orig_box = orig_item["boundingBox"]
            opt_box = opt_item["boundingBox"]
            
            dx = opt_box["x"] - orig_box["x"]
            dy = opt_box["y"] - orig_box["y"]
            
            label = orig_item["label"]

            # If displacement exceeds threshold (e.g. 3% shift)
            if abs(dx) > 3.0 or abs(dy) > 3.0:
                dir_x = "right" if dx > 0 else "left"
                dir_y = "south" if dy > 0 else "north"
                
                desc = f"Move the {label} slightly "
                if abs(dx) > 3.0 and abs(dy) > 3.0:
                    desc += f"{dir_x} and {dir_y} to optimize pathway clearances."
                elif abs(dx) > 3.0:
                    desc += f"{dir_x} to clear visual lines."
                else:
                    desc += f"{dir_y} to increase symmetry."
                
                suggestions.append({
                    "id": f"sug-{label.lower()}",
                    "title": f"Optimize {label} Coordinate Location",
                    "description": desc
                })
                
        # Fallback suggestion if no shifts occurred
        if not suggestions:
            suggestions.append({
                "id": "sug-general",
                "title": "Layout Optimal",
                "description": "Furniture clearances are already within the optimal boundaries."
            })
            
        return suggestions
