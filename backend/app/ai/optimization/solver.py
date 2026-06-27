import random
import copy
import math
import logging
from typing import List, Dict, Any, Tuple, Optional
from app.ai.scoring.scorer import ExplainableScoringEngine

logger = logging.getLogger(__name__)

class LayoutConstraintSolver:
    """
    NSGA-II Multi-Objective layout optimization engine for room furniture arrangement.
    Optimizes coordinate boundaries, visual symmetry, window light obstruction,
    and semantic groupings with elitism and adaptive mutations.
    """

    def __init__(
        self, 
        population_size: int = 40, 
        generations: int = 60, 
        mutation_rate: float = 0.20,
        crossover_rate: float = 0.75,
        seed: Optional[int] = None
    ):
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.crossover_rate = crossover_rate
        
        self.scorer = ExplainableScoringEngine()
        self._score_cache = {}
        
        if seed is not None:
            random.seed(seed)

    def optimize_layout(
        self, 
        original_furniture: List[Dict[str, Any]], 
        room_length: float = 16.0, 
        room_width: float = 12.0
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, str]]]:
        """
        Executes NSGA-II Genetic Algorithm to optimize furniture coordinates and orientation.
        
        Returns:
            Tuple: (optimized_furniture_list, list_of_explainable_changes)
        """
        if not original_furniture:
            logger.info("Optimization aborted: No furniture items specified.")
            return [], []

        # 1. Initialize parent population
        parents_layout = self._initialize_population(original_furniture)
        parents_wrapper = [{"layout": layout} for layout in parents_layout]
        
        # 2. GA Optimization loop
        for gen in range(self.generations):
            # Evaluate parent objectives
            self._evaluate_population(parents_wrapper)
            
            # Generate offspring
            children_wrapper = self._generate_next_generation(parents_wrapper, gen)
            
            # Evaluate offspring objectives
            self._evaluate_population(children_wrapper)
            
            # Merge parents and children (size 2N)
            merged_wrapper = parents_wrapper + children_wrapper
            
            # Run non-dominated sort and crowding distance assignment on merged population
            merged_ranks = [0] * len(merged_wrapper)
            merged_cd = [0.0] * len(merged_wrapper)
            
            merged_fronts = self._fast_non_dominated_sort(merged_wrapper)
            for rank_idx, front in enumerate(merged_fronts):
                for idx in front:
                    merged_ranks[idx] = rank_idx
                
                front_cd = self._calculate_crowding_distances(front, [ind["objectives"] for ind in merged_wrapper])
                for idx, cd in front_cd.items():
                    merged_cd[idx] = cd
            
            # Select the best N individuals for the next generation
            next_parents = []
            for front in merged_fronts:
                if len(next_parents) + len(front) <= self.population_size:
                    next_parents.extend([merged_wrapper[idx] for idx in front])
                else:
                    # Sort remaining front elements by crowding distance in descending order
                    sorted_front = sorted(front, key=lambda idx: merged_cd[idx], reverse=True)
                    space_left = self.population_size - len(next_parents)
                    next_parents.extend([merged_wrapper[idx] for idx in sorted_front[:space_left]])
                    break
                    
            parents_wrapper = next_parents

        # 3. Select final best layout from the top Pareto front (maximizes overall weighted score)
        self._evaluate_population(parents_wrapper)
        final_fronts = self._fast_non_dominated_sort(parents_wrapper)
        
        best_layout = None
        best_overall = -1.0
        
        for idx in final_fronts[0]:
            layout = parents_wrapper[idx]["layout"]
            res = self._evaluate_individual(layout)
            overall = res["scores"]["overall"]
            if overall > best_overall:
                best_overall = overall
                best_layout = layout
                
        if not best_layout:
            best_layout = parents_wrapper[0]["layout"]
            
        # Clean layout representations before returning
        final_layout = []
        for item in best_layout:
            clean_item = {
                "label": item["label"],
                "rotation": item.get("rotation", 0),
                "boundingBox": {
                    "x": round(item["boundingBox"]["x"], 2),
                    "y": round(item["boundingBox"]["y"], 2),
                    "width": round(item["boundingBox"]["width"], 2),
                    "height": round(item["boundingBox"]["height"], 2)
                }
            }
            final_layout.append(clean_item)

        # 4. Generate recommendations comparing optimized layout coordinates to original
        suggestions = self._generate_explainable_changes(original_furniture, final_layout)
        
        return final_layout, suggestions

    def _initialize_population(self, original: List[Dict[str, Any]]) -> List[List[Dict[str, Any]]]:
        """Generates starting layouts with wall anchoring and rotation initialization."""
        population = []
        
        # Always seed layout 0 with the original layout unchanged
        orig_seed = copy.deepcopy(original)
        for item in orig_seed:
            if "original_width" not in item:
                item["original_width"] = item["boundingBox"]["width"]
                item["original_height"] = item["boundingBox"]["height"]
            if "rotation" not in item:
                item["rotation"] = 0
            self._update_item_bounding_box(item)
        population.append(orig_seed)
        
        for _ in range(self.population_size - 1):
            individual = []
            for item in original:
                mutated_item = copy.deepcopy(item)
                if "original_width" not in mutated_item:
                    mutated_item["original_width"] = mutated_item["boundingBox"]["width"]
                    mutated_item["original_height"] = mutated_item["boundingBox"]["height"]
                
                # Randomize starting rotations (0, 90, 180, 270)
                mutated_item["rotation"] = random.choice([0, 90, 180, 270])
                
                orig_w = mutated_item["original_width"]
                orig_h = mutated_item["original_height"]
                rot = mutated_item["rotation"]
                w = orig_h if rot in [90, 270] else orig_w
                h = orig_w if rot in [90, 270] else orig_h
                
                # Position randomly within bounds
                mutated_item["boundingBox"]["x"] = random.uniform(0.0, 100.0 - w)
                mutated_item["boundingBox"]["y"] = random.uniform(0.0, 100.0 - h)
                
                # Snap to wall if structural/anchored item
                label_lower = mutated_item.get("label", "").lower()
                if label_lower in ["bed", "bookshelf", "sideboard", "desk"]:
                    self._snap_to_wall(mutated_item, w, h)
                    
                self._update_item_bounding_box(mutated_item)
                individual.append(mutated_item)
                
            population.append(individual)
            
        return population

    def _evaluate_population(self, population_wrapper: List[Dict[str, Any]]) -> None:
        """Evaluates all individuals in the population and stores objective vectors."""
        for ind in population_wrapper:
            if "objectives" not in ind:
                res = self._evaluate_individual(ind["layout"])
                scores = res["scores"]
                # 6 objectives to maximize
                ind["objectives"] = (
                    float(scores["accessibility"]),
                    float(scores["flow"]),
                    float(scores["symmetry"]),
                    float(scores["clutter"]),
                    float(scores["semantic"]),
                    float(scores["lighting"])
                )

    def _evaluate_individual(self, individual: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Evaluates an individual using ExplainableScoringEngine with cache layer mapping."""
        state = tuple(sorted(
            (
                item["label"], 
                round(item["boundingBox"]["x"], 2), 
                round(item["boundingBox"]["y"], 2),
                round(item["boundingBox"]["width"], 2), 
                round(item["boundingBox"]["height"], 2),
                item.get("rotation", 0)
            ) 
            for item in individual
        ))
        
        if state in self._score_cache:
            return self._score_cache[state]
            
        formatted = []
        for item in individual:
            formatted.append({
                "label": item["label"],
                "rotation": item.get("rotation", 0),
                "boundingBox": {
                    "x": item["boundingBox"]["x"],
                    "y": item["boundingBox"]["y"],
                    "width": item["boundingBox"]["width"],
                    "height": item["boundingBox"]["height"]
                }
            })
            
        res = self.scorer.calculate_room_scores(formatted)
        self._score_cache[state] = res
        return res

    def _fast_non_dominated_sort(self, population_wrapper: List[Dict[str, Any]]) -> List[List[int]]:
        """Organizes individuals into fronts of non-dominated ranks (NSGA-II)."""
        n = len(population_wrapper)
        S = [[] for _ in range(n)]
        np_count = [0] * n
        fronts = [[]]
        
        for p in range(n):
            for q in range(n):
                # Check if objective p dominates objective q (Maximization)
                p_dom_q = True
                q_dom_p = True
                p_better = False
                q_better = False
                
                for obj in range(6):
                    val_p = population_wrapper[p]["objectives"][obj]
                    val_q = population_wrapper[q]["objectives"][obj]
                    if val_p < val_q:
                        p_dom_q = False
                    if val_p > val_q:
                        p_better = True
                        
                    if val_q < val_p:
                        q_dom_p = False
                    if val_q > val_p:
                        q_better = True
                        
                p_dominates = p_dom_q and p_better
                q_dominates = q_dom_p and q_better
                
                if p_dominates:
                    S[p].append(q)
                elif q_dominates:
                    np_count[p] += 1
            
            if np_count[p] == 0:
                fronts[0].append(p)
                
        i = 0
        while len(fronts[i]) > 0:
            next_front = []
            for p in fronts[i]:
                for q in S[p]:
                    np_count[q] -= 1
                    if np_count[q] == 0:
                        next_front.append(q)
            i += 1
            fronts.append(next_front)
            
        if len(fronts[-1]) == 0:
            fronts.pop()
            
        return fronts

    def _calculate_crowding_distances(
        self, 
        front_indices: List[int], 
        objective_values: List[Tuple[float, ...]]
    ) -> Dict[int, float]:
        """Calculates crowding distances within a single Pareto front."""
        distances = {idx: 0.0 for idx in front_indices}
        num_individuals = len(front_indices)
        if num_individuals <= 2:
            for idx in front_indices:
                distances[idx] = float('inf')
            return distances
            
        for obj in range(6):
            # Sort indices based on current objective parameter
            sorted_indices = sorted(front_indices, key=lambda idx: objective_values[idx][obj])
            
            # Endpoints get infinite crowding distances
            distances[sorted_indices[0]] = float('inf')
            distances[sorted_indices[-1]] = float('inf')
            
            min_val = objective_values[sorted_indices[0]][obj]
            max_val = objective_values[sorted_indices[-1]][obj]
            val_range = max_val - min_val
            
            if val_range == 0.0:
                continue
                
            for k in range(1, num_individuals - 1):
                idx = sorted_indices[k]
                prev_idx = sorted_indices[k-1]
                next_idx = sorted_indices[k+1]
                distances[idx] += (objective_values[next_idx][obj] - objective_values[prev_idx][obj]) / val_range
                
        return distances

    def _select_parents(
        self, 
        population_wrapper: List[Dict[str, Any]], 
        ranks: List[int], 
        crowding_distances: List[float]
    ) -> List[Dict[str, Any]]:
        """Tournament selection favoring individuals with lower rank and higher crowding distance."""
        selected = []
        n = len(population_wrapper)
        for _ in range(n):
            idx1, idx2 = random.sample(range(n), 2)
            if ranks[idx1] < ranks[idx2]:
                best_idx = idx1
            elif ranks[idx2] < ranks[idx1]:
                best_idx = idx2
            else:
                best_idx = idx1 if crowding_distances[idx1] >= crowding_distances[idx2] else idx2
            selected.append(population_wrapper[best_idx])
        return selected

    def _generate_next_generation(
        self, 
        population_wrapper: List[Dict[str, Any]], 
        generation: int
    ) -> List[Dict[str, Any]]:
        """Generates offspring layouts using tournament selection, functional crossovers, and adaptive mutations."""
        # 1. Compute ranks and crowding distances for the parents
        ranks = [0] * len(population_wrapper)
        crowding_distances = [0.0] * len(population_wrapper)
        
        fronts = self._fast_non_dominated_sort(population_wrapper)
        for rank_idx, front in enumerate(fronts):
            for idx in front:
                ranks[idx] = rank_idx
            
            front_cd = self._calculate_crowding_distances(front, [ind["objectives"] for ind in population_wrapper])
            for idx, cd in front_cd.items():
                crowding_distances[idx] = cd
                
        # 2. Select parents via tournaments
        selected = self._select_parents(population_wrapper, ranks, crowding_distances)
        
        # 3. Create children through crossovers and mutations
        children_wrapper = []
        n = len(population_wrapper)
        
        while len(children_wrapper) < n:
            parent1 = random.choice(selected)
            parent2 = random.choice(selected)
            
            # Crossover
            child_layout = self._perform_crossover(parent1["layout"], parent2["layout"])
            
            # Mutation
            self._apply_mutation(child_layout, generation)
            
            children_wrapper.append({
                "layout": child_layout
            })
            
        return children_wrapper

    def _perform_crossover(
        self, 
        parent1: List[Dict[str, Any]], 
        parent2: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Performs crossover by swapping cohesive semantic subgraphs (connected components) 
        of the relationship graph between parents to preserve groups.
        """
        if random.random() > self.crossover_rate:
            return copy.deepcopy(parent1)
            
        child = [None] * len(parent1)
        
        from app.ai.spatial.spatial_relationship_graph import SpatialRelationshipGraph
        import networkx as nx
        
        graph = SpatialRelationshipGraph(parent1)
        
        # Extract components of movable nodes
        movable_nodes = [
            node_id for node_id, attrs in graph.graph.nodes(data=True) 
            if attrs.get("movable", True)
        ]
        
        subgraph = graph.graph.subgraph(movable_nodes)
        components = list(nx.connected_components(subgraph))
        
        # Map parent1 indices
        id_to_idx = {}
        for idx, item in enumerate(parent1):
            node_id = item.get("id", f"{item['label']}_{idx}")
            id_to_idx[node_id] = idx
            
        # Swap components
        for comp in components:
            inherit_parent = parent1 if random.random() > 0.5 else parent2
            for node_id in comp:
                idx = id_to_idx.get(node_id)
                if idx is None:
                    continue
                label = parent1[idx]["label"]
                if idx < len(inherit_parent) and inherit_parent[idx]["label"] == label:
                    child[idx] = copy.deepcopy(inherit_parent[idx])
                else:
                    match = next((item for item in inherit_parent if item["label"] == label), None)
                    if match:
                        child[idx] = copy.deepcopy(match)
                    else:
                        child[idx] = copy.deepcopy(parent1[idx])
                        
        # Fill non-movable items (doors, windows) and default fallbacks
        for idx in range(len(parent1)):
            if child[idx] is None:
                child[idx] = copy.deepcopy(parent1[idx])
                
        return child

    def _apply_mutation(self, individual: List[Dict[str, Any]], generation: int) -> None:
        """Applies graph-aware, adaptive mutation operators using SpatialRelationshipGraph."""
        progress = generation / self.generations
        mutation_range = max(1.0, 15.0 * (1.0 - progress))  # Exploratory range decays
        adaptive_rate = self.mutation_rate * (1.0 - 0.5 * progress)
        
        from app.ai.spatial.spatial_relationship_graph import SpatialRelationshipGraph
        import networkx as nx
        
        # Build relationship graph of individual layout
        graph = SpatialRelationshipGraph(individual)
        
        # Group components
        movable_nodes = [n for n, attrs in graph.graph.nodes(data=True) if attrs.get("movable", True)]
        subgraph = graph.graph.subgraph(movable_nodes)
        components = list(nx.connected_components(subgraph))
        
        id_to_idx = {item.get("id", f"{item['label']}_{idx}"): idx for idx, item in enumerate(individual)}
        
        # Decide mutation strategies
        strategy = random.choice([
            "group_slide", 
            "focal_align", 
            "wall_snap", 
            "conversational_balance",
            "avoid_doorway"
        ])
        
        if random.random() >= adaptive_rate:
            return
            
        if strategy == "group_slide" and components:
            # 1. Group-preserving mutation: slide whole connected component together
            comp = random.choice(components)
            dx = random.uniform(-mutation_range, mutation_range)
            dy = random.uniform(-mutation_range, mutation_range)
            for node_id in comp:
                idx = id_to_idx.get(node_id)
                if idx is not None:
                    item = individual[idx]
                    box = item["boundingBox"]
                    box["x"] = max(0.0, min(100.0 - box["width"], box["x"] + dx))
                    box["y"] = max(0.0, min(100.0 - box["height"], box["y"] + dy))
                    self._update_item_bounding_box(item)
                    
        elif strategy == "focal_align":
            # 2. Focal-alignment mutation: align nodes with aligned_with/faces edges
            aligned_edges = [
                (u, v) for u, v, d in graph.graph.edges(data=True) 
                if d.get("relationship_type") == "aligned_with"
            ]
            if aligned_edges:
                u, v = random.choice(aligned_edges)
                idx_u, idx_v = id_to_idx.get(u), id_to_idx.get(v)
                if idx_u is not None and idx_v is not None:
                    item_u, item_v = individual[idx_u], individual[idx_v]
                    box_u, box_v = item_u["boundingBox"], item_v["boundingBox"]
                    
                    # Align centers vertically or horizontally
                    u_cx = box_u["x"] + box_u["width"] / 2.0
                    u_cy = box_u["y"] + box_u["height"] / 2.0
                    v_cx = box_v["x"] + box_v["width"] / 2.0
                    v_cy = box_v["y"] + box_v["height"] / 2.0
                    
                    # Decide alignment direction: check which offset is smaller
                    if abs(u_cx - v_cx) < abs(u_cy - v_cy):
                        # Align X centers
                        box_v["x"] = max(0.0, min(100.0 - box_v["width"], u_cx - box_v["width"] / 2.0))
                    else:
                        # Align Y centers
                        box_v["y"] = max(0.0, min(100.0 - box_v["height"], u_cy - box_v["height"] / 2.0))
                        
                    self._update_item_bounding_box(item_v)

        elif strategy == "wall_snap":
            # 3. Wall-snapping mutation using attached_to_wall edges
            wall_edges = [
                (u, v) for u, v, d in graph.graph.edges(data=True) 
                if d.get("relationship_type") == "attached_to_wall"
            ]
            if wall_edges:
                u, wall = random.choice(wall_edges)
                idx = id_to_idx.get(u)
                if idx is not None:
                    item = individual[idx]
                    box = item["boundingBox"]
                    if wall == "Wall_Left":
                        box["x"] = 0.0
                    elif wall == "Wall_Right":
                        box["x"] = 100.0 - box["width"]
                    elif wall == "Wall_Top":
                        box["y"] = 0.0
                    elif wall == "Wall_Bottom":
                        box["y"] = 100.0 - box["height"]
                    self._update_item_bounding_box(item)
                    
        elif strategy == "conversational_balance":
            # 4. Conversational-balancing mutation: pull seating nodes toward centroid
            seating_nodes = [n for n, attrs in graph.graph.nodes(data=True) if attrs.get("category") == "seating"]
            if len(seating_nodes) >= 2:
                centers = []
                for n in seating_nodes:
                    idx = id_to_idx.get(n)
                    if idx is not None:
                        item = individual[idx]
                        box = item["boundingBox"]
                        centers.append((box["x"] + box["width"]/2.0, box["y"] + box["height"]/2.0, idx))
                if centers:
                    avg_x = sum(pt[0] for pt in centers) / len(centers)
                    avg_y = sum(pt[1] for pt in centers) / len(centers)
                    # Pull each seating node 15% toward centroid
                    for cx, cy, idx in centers:
                        item = individual[idx]
                        box = item["boundingBox"]
                        dx = (avg_x - cx) * 0.15
                        dy = (avg_y - cy) * 0.15
                        box["x"] = max(0.0, min(100.0 - box["width"], box["x"] + dx))
                        box["y"] = max(0.0, min(100.0 - box["height"], box["y"] + dy))
                        self._update_item_bounding_box(item)
                        
        elif strategy == "avoid_doorway":
            # 5. Accessibility-preserving mutation: avoid door boundaries
            doors = [n for n, attrs in graph.graph.nodes(data=True) if attrs.get("label", "").lower() == "door"]
            if doors:
                door_node = graph.graph.nodes[doors[0]]
                door_cx = door_node["center_x"]
                door_cy = door_node["center_y"]
                
                # Push a random movable node away from the door
                u = random.choice(movable_nodes)
                idx = id_to_idx.get(u)
                if idx is not None:
                    item = individual[idx]
                    box = item["boundingBox"]
                    cx = box["x"] + box["width"] / 2.0
                    cy = box["y"] + box["height"] / 2.0
                    dist = math.hypot(cx - door_cx, cy - door_cy)
                    if dist < 25.0 and dist > 0:
                        push_scale = 10.0
                        dx = ((cx - door_cx) / dist) * push_scale
                        dy = ((cy - door_cy) / dist) * push_scale
                        box["x"] = max(0.0, min(100.0 - box["width"], box["x"] + dx))
                        box["y"] = max(0.0, min(100.0 - box["height"], box["y"] + dy))
                        self._update_item_bounding_box(item)

    def _update_item_bounding_box(self, item: Dict[str, Any]) -> None:
        """Updates the bounding box dimensions based on rotation (0, 90, 180, 270)."""
        rot = item.get("rotation", 0) % 360
        if rot not in [0, 90, 180, 270]:
            rot = min([0, 90, 180, 270], key=lambda x: abs(x - rot))
        item["rotation"] = rot
        
        orig_w = item.get("original_width", item["boundingBox"]["width"])
        orig_h = item.get("original_height", item["boundingBox"]["height"])
        
        # Swap width/height if rotated 90 or 270 degrees
        if rot in [90, 270]:
            item["boundingBox"]["width"] = orig_h
            item["boundingBox"]["height"] = orig_w
        else:
            item["boundingBox"]["width"] = orig_w
            item["boundingBox"]["height"] = orig_h
            
        # Enforce room boundary boundaries (0.0 to 100.0)
        w = item["boundingBox"]["width"]
        h = item["boundingBox"]["height"]
        item["boundingBox"]["x"] = max(0.0, min(100.0 - w, item["boundingBox"]["x"]))
        item["boundingBox"]["y"] = max(0.0, min(100.0 - h, item["boundingBox"]["y"]))

    def _snap_to_wall(self, item: Dict[str, Any], w: float, h: float) -> None:
        """Snaps an item to the nearest room wall boundary."""
        box = item["boundingBox"]
        dist_left = box["x"]
        dist_right = 100.0 - w - box["x"]
        dist_top = box["y"]
        dist_bottom = 100.0 - h - box["y"]
        
        min_dist = min(dist_left, dist_right, dist_top, dist_bottom)
        if min_dist == dist_left:
            box["x"] = 0.0
        elif min_dist == dist_right:
            box["x"] = 100.0 - w
        elif min_dist == dist_top:
            box["y"] = 0.0
        else:
            box["y"] = 100.0 - h

    def _generate_explainable_changes(
        self, 
        original: List[Dict[str, Any]], 
        optimized: List[Dict[str, Any]]
    ) -> List[Dict[str, str]]:
        """Generates clear, natural language explanations describing optimized shifts."""
        suggestions = []
        
        for orig_item in original:
            opt_item = next((item for item in optimized if item["label"] == orig_item["label"]), None)
            if not opt_item:
                continue
                
            orig_box = orig_item["boundingBox"]
            opt_box = opt_item["boundingBox"]
            
            dx = opt_box["x"] - orig_box["x"]
            dy = opt_box["y"] - orig_box["y"]
            
            orig_rot = orig_item.get("rotation", 0)
            opt_rot = opt_item.get("rotation", 0)
            
            label = orig_item["label"]
            changes = []
            
            if orig_rot != opt_rot:
                changes.append(f"rotate by {opt_rot}°")
                
            if abs(dx) > 2.0 or abs(dy) > 2.0:
                dir_x = "right" if dx > 0 else "left"
                dir_y = "down" if dy > 0 else "up"
                
                if abs(dx) > 2.0 and abs(dy) > 2.0:
                    changes.append(f"shift slightly {dir_x} and {dir_y}")
                elif abs(dx) > 2.0:
                    changes.append(f"shift slightly {dir_x}")
                else:
                    changes.append(f"shift slightly {dir_y}")
            
            if changes:
                desc = f"Modify the {label} layout: " + ", and ".join(changes) + "."
                label_lower = label.lower()
                if label_lower in ["bed", "sideboard"]:
                    desc += " This improves bedside nightstand accessibility and clearances."
                elif label_lower in ["sofa", "coffee table"]:
                    desc += " This aligns focal points and creates a comfortable lounge seating circle."
                elif label_lower == "desk":
                    desc += " This positions the work zone for optimal natural window daylight."
                elif label_lower in ["dining table", "chair"]:
                    desc += " This optimizes seating clearances around the dining zone."
                else:
                    desc += " This increases walkability and room circulation flow."
                    
                suggestions.append({
                    "id": f"sug-{label_lower}-{random.randint(100, 999)}",
                    "title": f"Optimize {label} Layout",
                    "description": desc
                })
                
        if not suggestions:
            suggestions.append({
                "id": "sug-general",
                "title": "Layout Optimal",
                "description": "Furniture clearances are already within the optimal boundaries."
            })
            
        return suggestions
