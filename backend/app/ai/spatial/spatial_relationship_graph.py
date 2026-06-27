import math
import logging
from typing import List, Dict, Any, Tuple, Optional
import networkx as nx

logger = logging.getLogger(__name__)

# Semantic mapping constants
CATEGORIES = {
    "sofa": "seating",
    "armchair": "seating",
    "chair": "seating",
    "dining table": "dining",
    "bed": "focal",
    "sideboard": "storage",
    "bookshelf": "storage",
    "desk": "work",
    "potted plant": "decor",
    "window": "structural",
    "door": "structural"
}

ANCHOR_PRIORITIES = {
    "bed": "high",
    "bookshelf": "high",
    "sideboard": "medium",
    "desk": "medium",
    "sofa": "low",
    "dining table": "low",
    "armchair": "low"
}

class SpatialRelationshipGraph:
    """
    Constructs a semantic and geometric graph of furniture layouts.
    Leverages networkx to represent furniture items as nodes and spatial
    relationships as edges to compute cohesion, accessibility, and alignment metrics.
    """

    def __init__(self, furniture_list: List[Dict[str, Any]], room_length: float = 16.0, room_width: float = 12.0):
        self.graph = nx.Graph()
        self.room_length = room_length
        self.room_width = room_width
        self.furniture_list = furniture_list
        self._build_graph()

    def _build_graph(self):
        """Constructs graph nodes and infers semantic edges between objects."""
        # 1. Add virtual wall boundary nodes for structural anchoring
        walls = {
            "Wall_Left": {"center_x": 0.0, "center_y": 50.0},
            "Wall_Right": {"center_x": 100.0, "center_y": 50.0},
            "Wall_Top": {"center_x": 50.0, "center_y": 0.0},
            "Wall_Bottom": {"center_x": 50.0, "center_y": 100.0}
        }
        for wall_name, wall_attrs in walls.items():
            self.graph.add_node(
                wall_name,
                id=wall_name,
                label="Wall",
                boundingBox={"x": wall_attrs["center_x"], "y": wall_attrs["center_y"], "width": 0.0, "height": 0.0},
                center_x=wall_attrs["center_x"],
                center_y=wall_attrs["center_y"],
                area=0.0,
                category="structural",
                movable=False,
                anchor_priority="none"
            )

        # 2. Add detected furniture items as nodes
        nodes_list = []
        for idx, item in enumerate(self.furniture_list):
            label = item.get("label", "Object")
            label_lower = label.lower()
            box = item.get("boundingBox", {"x": 0.0, "y": 0.0, "width": 0.0, "height": 0.0})
            
            # Compute centers
            cx = box["x"] + box["width"] / 2.0
            cy = box["y"] + box["height"] / 2.0
            area = box["width"] * box["height"]
            
            category = CATEGORIES.get(label_lower, "decor")
            movable = label_lower not in ["door", "window"]
            anchor_priority = ANCHOR_PRIORITIES.get(label_lower, "none")
            
            # Guarantee unique node ID
            node_id = item.get("id", f"{label}_{idx}")
            
            self.graph.add_node(
                node_id,
                id=node_id,
                label=label,
                boundingBox=box,
                center_x=cx,
                center_y=cy,
                area=area,
                category=category,
                movable=movable,
                anchor_priority=anchor_priority
            )
            
            # Record for edge inference (exclude virtual walls)
            nodes_list.append((node_id, label, category, box, cx, cy))

        # 3. Add wall snap constraint edges (attached_to_wall)
        for node_id, label, category, box, cx, cy in nodes_list:
            label_lower = label.lower()
            if label_lower in ["door", "window"]:
                continue
                
            if category in ["focal", "storage", "work"]:
                dist_left = box["x"]
                dist_right = 100.0 - box["x"] - box["width"]
                dist_top = box["y"]
                dist_bottom = 100.0 - box["y"] - box["height"]
                
                # Threshold of 6.0% room coordinates for wall snapped edges
                if dist_left < 6.0:
                    self.graph.add_edge(
                        node_id, "Wall_Left", 
                        relationship_type="attached_to_wall", 
                        weight=1.0, 
                        ideal_distance=0.0, 
                        semantic_priority=1.5
                    )
                elif dist_right < 6.0:
                    self.graph.add_edge(
                        node_id, "Wall_Right", 
                        relationship_type="attached_to_wall", 
                        weight=1.0, 
                        ideal_distance=0.0, 
                        semantic_priority=1.5
                    )
                elif dist_top < 6.0:
                    self.graph.add_edge(
                        node_id, "Wall_Top", 
                        relationship_type="attached_to_wall", 
                        weight=1.0, 
                        ideal_distance=0.0, 
                        semantic_priority=1.5
                    )
                elif dist_bottom < 6.0:
                    self.graph.add_edge(
                        node_id, "Wall_Bottom", 
                        relationship_type="attached_to_wall", 
                        weight=1.0, 
                        ideal_distance=0.0, 
                        semantic_priority=1.5
                    )

        # 4. Infer semantic relationship edges dynamically
        for i in range(len(nodes_list)):
            for j in range(i + 1, len(nodes_list)):
                id1, label1, category1, box1, cx1, cy1 = nodes_list[i]
                id2, label2, category2, box2, cx2, cy2 = nodes_list[j]
                
                lbl1, lbl2 = label1.lower(), label2.lower()
                dist = math.hypot(cx1 - cx2, cy1 - cy2)
                
                # Pair A: Sofa facing Sideboard (TV Console)
                if (lbl1 == "sofa" and lbl2 == "sideboard") or (lbl1 == "sideboard" and lbl2 == "sofa"):
                    aligned_h = abs(cy1 - cy2) > 20.0 and abs(cx1 - cx2) < 18.0
                    aligned_v = abs(cx1 - cx2) > 20.0 and abs(cy1 - cy2) < 18.0
                    
                    if aligned_h or aligned_v:
                        self.graph.add_edge(
                            id1, id2, 
                            relationship_type="aligned_with", 
                            weight=1.0, 
                            ideal_distance=30.0, 
                            semantic_priority=2.0
                        )
                        self.graph.add_edge(
                            id1, id2, 
                            relationship_type="faces", 
                            weight=1.0, 
                            ideal_distance=30.0, 
                            semantic_priority=2.0
                        )
                    else:
                        self.graph.add_edge(
                            id1, id2, 
                            relationship_type="aligned_with", 
                            weight=0.4, 
                            ideal_distance=30.0, 
                            semantic_priority=2.0
                        )
                
                # Pair B: Bed and bedside tables (Sideboards)
                elif (lbl1 == "bed" and lbl2 == "sideboard") or (lbl1 == "sideboard" and lbl2 == "bed"):
                    if dist < 26.0:
                        self.graph.add_edge(
                            id1, id2, 
                            relationship_type="grouped_with", 
                            weight=1.0, 
                            ideal_distance=15.0, 
                            semantic_priority=1.5
                        )
                        self.graph.add_edge(
                            id1, id2, 
                            relationship_type="near", 
                            weight=1.0, 
                            ideal_distance=15.0, 
                            semantic_priority=1.5
                        )
                        
                # Pair C: Dining Table and Chairs
                elif (lbl1 == "dining table" and lbl2 == "chair") or (lbl1 == "chair" and lbl2 == "dining table"):
                    if dist < 26.0:
                        self.graph.add_edge(
                            id1, id2, 
                            relationship_type="grouped_with", 
                            weight=1.0, 
                            ideal_distance=15.0, 
                            semantic_priority=1.5
                        )
                        self.graph.add_edge(
                            id1, id2, 
                            relationship_type="near", 
                            weight=1.0, 
                            ideal_distance=15.0, 
                            semantic_priority=1.5
                        )
                        
                # Pair D: Seating conversational layout
                elif category1 == "seating" and category2 == "seating":
                    if dist < 45.0:
                        self.graph.add_edge(
                            id1, id2, 
                            relationship_type="conversational_with", 
                            weight=1.0, 
                            ideal_distance=25.0, 
                            semantic_priority=1.2
                        )
                        
                # Pair E: Desk and Window
                elif (lbl1 == "desk" and lbl2 == "window") or (lbl1 == "window" and lbl2 == "desk"):
                    if dist < 35.0:
                        self.graph.add_edge(
                            id1, id2, 
                            relationship_type="near", 
                            weight=1.0, 
                            ideal_distance=15.0, 
                            semantic_priority=1.0
                        )
                
                # General pathway connectivity neighbors
                if dist < 30.0 and lbl1 not in ["door", "window"] and lbl2 not in ["door", "window"]:
                    self.graph.add_edge(
                        id1, id2, 
                        relationship_type="pathway_connected", 
                        weight=0.8, 
                        ideal_distance=20.0, 
                        semantic_priority=0.5
                    )

    def compute_relationship_score(self) -> float:
        """Evaluates overall metric deviations across inferred semantic edges."""
        scores_sum = 0.0
        priorities_sum = 0.0
        
        for u, v, d in self.graph.edges(data=True):
            if d.get("relationship_type") == "pathway_connected":
                continue
                
            u_node = self.graph.nodes[u]
            v_node = self.graph.nodes[v]
            
            # Compute actual center distance
            dist = math.hypot(u_node["center_x"] - v_node["center_x"], u_node["center_y"] - v_node["center_y"])
            ideal = d.get("ideal_distance", 15.0)
            priority = d.get("semantic_priority", 1.0)
            weight = d.get("weight", 1.0)
            
            # Compute penalty based on distance deviation
            penalty = abs(dist - ideal)
            edge_score = max(10.0, 100.0 - penalty * 3.8)
            
            scores_sum += edge_score * priority * weight
            priorities_sum += priority * weight
            
        if priorities_sum == 0.0:
            return 80.0
            
        return scores_sum / priorities_sum

    def compute_alignment_score(self) -> float:
        """Evaluates horizontal/vertical coordinate focal alignments."""
        alignments = []
        
        for u, v, d in self.graph.edges(data=True):
            if d.get("relationship_type") == "aligned_with":
                u_node = self.graph.nodes[u]
                v_node = self.graph.nodes[v]
                
                # Check horizontal/vertical alignment error offsets
                err_x = abs(u_node["center_x"] - v_node["center_x"])
                err_y = abs(u_node["center_y"] - v_node["center_y"])
                
                # Check which axis is being aligned
                alignment_error = min(err_x, err_y)
                score = max(10.0, 100.0 - alignment_error * 4.2)
                alignments.append(score)
                
        if not alignments:
            return 100.0
            
        return sum(alignments) / len(alignments)

    def compute_group_cohesion(self) -> float:
        """Evaluates standard deviation and spatial compact cohesion inside cliques/groups."""
        group_cohesions = []
        
        # Identify group parent nodes (Bed, Dining Table)
        for node_id, node_attrs in self.graph.nodes(data=True):
            lbl = node_attrs.get("label", "").lower()
            if lbl not in ["bed", "dining table"]:
                continue
                
            # Find grouped children
            children = []
            for neighbor in self.graph.neighbors(node_id):
                edge_data = self.graph.get_edge_data(node_id, neighbor)
                if edge_data and edge_data.get("relationship_type") == "grouped_with":
                    children.append(neighbor)
                    
            if not children:
                continue
                
            distances = []
            cx = node_attrs["center_x"]
            cy = node_attrs["center_y"]
            
            for child in children:
                c_node = self.graph.nodes[child]
                distances.append(math.hypot(cx - c_node["center_x"], cy - c_node["center_y"]))
                
            # Evaluate group compactness
            mean_dist = sum(distances) / len(distances)
            mean_diff = abs(mean_dist - 15.0)  # Ideal Group distance is 15.0
            
            # Evaluate group symmetry (standard deviation of child offsets)
            if len(distances) >= 2:
                variance = sum((d - mean_dist) ** 2 for d in distances) / len(distances)
                std_dev = math.sqrt(variance)
            else:
                std_dev = 0.0
                
            cohesion_score = max(10.0, 100.0 - std_dev * 5.0 - mean_diff * 4.0)
            group_cohesions.append(cohesion_score)
            
        if not group_cohesions:
            return 100.0
            
        return sum(group_cohesions) / len(group_cohesions)

    def compute_conversation_score(self) -> float:
        """Evaluates seating subgraphs conversational clustering and average distances."""
        seating_nodes = [node_id for node_id, attrs in self.graph.nodes(data=True) if attrs.get("category") == "seating"]
        if len(seating_nodes) < 2:
            return 100.0
            
        distances = []
        for i in range(len(seating_nodes)):
            for j in range(i + 1, len(seating_nodes)):
                u_node = self.graph.nodes[seating_nodes[i]]
                v_node = self.graph.nodes[seating_nodes[j]]
                distances.append(math.hypot(u_node["center_x"] - v_node["center_x"], u_node["center_y"] - v_node["center_y"]))
                
        mean_dist = sum(distances) / len(distances)
        
        # Penalize if too far (>35%) or too close (<18%)
        if mean_dist > 35.0:
            penalty = (mean_dist - 35.0) * 3.5
        elif mean_dist < 18.0:
            penalty = (18.0 - mean_dist) * 4.5
        else:
            penalty = 0.0
            
        return max(10.0, 100.0 - penalty)

    def compute_accessibility_graph_score(self, clearance_res: Dict[str, Any]) -> float:
        """Penalizes graph scores for major furniture items disconnected from accessibility walkways."""
        blocked_nodes = 0
        major_categories = {"seating", "focal", "work"}
        
        # Walk through clearance reasoning to extract blocked object types
        blocked_labels = []
        for obs in clearance_res.get("reasoning", []):
            title = obs.get("title", "")
            if "Blocked Access to" in title:
                # e.g., "Blocked Access to Bed" -> "Bed"
                lbl = title.replace("Blocked Access to", "").strip()
                blocked_labels.append(lbl.lower())
                
        for node_id, attrs in self.graph.nodes(data=True):
            if attrs.get("category") in major_categories and attrs.get("movable", True):
                if attrs.get("label", "").lower() in blocked_labels:
                    blocked_nodes += 1
                    
        penalty = blocked_nodes * 25.0
        return max(10.0, 100.0 - penalty)

    def compute_path_connectivity(self) -> float:
        """Evaluates connectivity metrics over the general walkability pathway neighborhood graph."""
        # Filters structural door/window boundaries, then checks pathway subgraph
        pathway_nodes = [
            node_id for node_id, attrs in self.graph.nodes(data=True) 
            if attrs.get("movable", True) or attrs.get("label", "").lower() == "door"
        ]
        
        if len(pathway_nodes) < 2:
            return 100.0
            
        subgraph = self.graph.subgraph(pathway_nodes)
        
        # Verify if a path connects all movable nodes to the door
        door_node = next((n for n, attrs in self.graph.nodes(data=True) if attrs.get("label", "").lower() == "door"), None)
        if not door_node:
            # Fallback connectivity component check
            components = list(nx.connected_components(subgraph))
            largest_size = len(max(components, key=len)) if components else 0
            return (largest_size / len(pathway_nodes)) * 100.0
            
        # Check components connected to door node
        connected_count = 0
        for node in pathway_nodes:
            if nx.has_path(subgraph, door_node, node):
                connected_count += 1
                
        return (connected_count / len(pathway_nodes)) * 100.0
