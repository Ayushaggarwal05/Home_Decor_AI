import math
import heapq
import logging
from typing import List, Dict, Any, Tuple, Set, Optional

logger = logging.getLogger(__name__)

def compute_bounding_box_intersection_ratio(boxA: Optional[dict], boxB: Optional[dict]) -> float:
    """
    Computes the Intersection-over-Union (IoU) ratio between two 2D bounding boxes.
    Expects dict coordinates: {x, y, width, height} in percentage values (0.0 to 100.0).
    
    Returns:
        float: IoU ratio between 0.0 (no overlap) and 1.0 (perfect overlap).
               Returns 0.0 safely on malformed or empty box definitions.
    """
    # 1. Validation and safety checks
    if not boxA or not isinstance(boxA, dict):
        return 0.0
    if not boxB or not isinstance(boxB, dict):
        return 0.0
        
    required_keys = {'x', 'y', 'width', 'height'}
    if not required_keys.issubset(boxA.keys()) or not required_keys.issubset(boxB.keys()):
        logger.debug("IoU calculation skipped: Missing coordinate keys in box dicts.")
        return 0.0

    try:
        # Convert and validate numeric boundaries
        x1_A, y1_A = float(boxA['x']), float(boxA['y'])
        w_A, h_A = float(boxA['width']), float(boxA['height'])
        
        x1_B, y1_B = float(boxB['x']), float(boxB['y'])
        w_B, h_B = float(boxB['width']), float(boxB['height'])
        
        # Area checks: avoid zero-sized or negative footprints
        if w_A <= 0 or h_A <= 0 or w_B <= 0 or h_B <= 0:
            return 0.0

        # Calculate bounding box edges
        x2_A, y2_A = x1_A + w_A, y1_A + h_A
        x2_B, y2_B = x1_B + w_B, y1_B + h_B

        # 2. Determine overlapping rectangle boundaries
        xA = max(x1_A, x1_B)
        yA = max(y1_A, y1_B)
        xB = min(x2_A, x2_B)
        yB = min(y2_A, y2_B)

        # 3. Calculate intersection area
        inter_width = max(0.0, xB - xA)
        inter_height = max(0.0, yB - yA)
        inter_area = inter_width * inter_height

        if inter_area <= 0.0:
            return 0.0

        # 4. Calculate individual areas
        areaA = w_A * h_A
        areaB = w_B * h_B

        # 5. Compute IoU
        union_area = float(areaA + areaB - inter_area)
        if union_area <= 0.0:
            return 0.0
            
        iou = inter_area / union_area
        return iou
        
    except (ValueError, TypeError, KeyError) as e:
        logger.warning(f"Error occurred during IoU calculation: {e}")
        return 0.0


def generate_occupancy_grid(
    furniture_list: List[Dict[str, Any]], 
    resolution: int = 50
) -> List[List[bool]]:
    """
    Converts 0-100 room coordinates space into a 2D discrete grid mapping.
    True represents blocked cells (obstacle), False represents free walkable space.
    """
    grid = [[False for _ in range(resolution)] for _ in range(resolution)]
    cell_scale = 100.0 / resolution  # E.g. 2.0 percentage units per grid cell
    
    for item in furniture_list:
        # Ignore Door and Window objects in path blockages check since they are structural portals
        label = item.get("label", "").lower()
        if label in ["door", "window"]:
            continue
            
        box = item.get("boundingBox")
        if not box or not isinstance(box, dict):
            continue
            
        try:
            x_min = float(box.get("x", 0.0))
            y_min = float(box.get("y", 0.0))
            w = float(box.get("width", 0.0))
            h = float(box.get("height", 0.0))
            x_max, y_max = x_min + w, y_min + h
            
            # Map percentage coordinates (0-100) to grid indexes (0 to resolution-1)
            # Subtract 0.01 from max edge to prevent border alignments from bleeding into next cell
            col_start = max(0, int(x_min / cell_scale))
            col_end = min(resolution - 1, int((x_max - 0.01) / cell_scale))
            row_start = max(0, int(y_min / cell_scale))
            row_end = min(resolution - 1, int((y_max - 0.01) / cell_scale))
            
            # Label occupied cells as blocked
            for r in range(row_start, row_end + 1):
                for c in range(col_start, col_end + 1):
                    grid[r][c] = True
                    
        except (ValueError, TypeError) as e:
            logger.warning(f"Failed to process coordinate cell mapping: {e}")
            
    return grid


def inflate_obstacles(
    grid: List[List[bool]], 
    padding_cells: int = 1
) -> List[List[bool]]:
    """
    Inflates obstacle cells by a safety padding radius to model human body width clearances.
    
    Args:
        grid: Original 2D boolean grid mapping.
        padding_cells: Radial distance (number of cells) to dilate obstacles.
        
    Returns:
        List[List[bool]]: Dilated/inflated grid where safety clearances around furniture are blocked.
    """
    if padding_cells <= 0:
        return grid
        
    resolution = len(grid)
    inflated = [[grid[r][c] for c in range(resolution)] for r in range(resolution)]
    
    for r in range(resolution):
        for c in range(resolution):
            if grid[r][c]:  # If original cell is an obstacle, inflate outwards
                for dr in range(-padding_cells, padding_cells + 1):
                    for dc in range(-padding_cells, padding_cells + 1):
                        # Circular coordinate check for safety bubble radius expansion
                        if abs(dr) + abs(dc) <= padding_cells:
                            nr, nc = r + dr, c + dc
                            if 0 <= nr < resolution and 0 <= nc < resolution:
                                inflated[nr][nc] = True
                                
    return inflated


def is_cell_walkable(grid: List[List[bool]], row: int, col: int) -> bool:
    """
    Check if a specific cell index lies inside the grid boundaries and is free space.
    """
    resolution = len(grid)
    if 0 <= row < resolution and 0 <= col < resolution:
        return not grid[row][col]
    return False


def _find_nearest_free_cell(
    grid: List[List[bool]], 
    row: int, 
    col: int, 
    max_search: int = 5
) -> Optional[Tuple[int, int]]:
    """
    Performs BFS outward expansion to find the nearest free/unblocked cell if start/end points are blocked.
    """
    resolution = len(grid)
    if not grid[row][col]:
        return row, col
        
    queue = [(row, col)]
    visited = {(row, col)}
    
    while queue:
        curr_r, curr_c = queue.pop(0)
        
        # Enforce search scope radius limits
        if abs(curr_r - row) > max_search or abs(curr_c - col) > max_search:
            continue
            
        if not grid[curr_r][curr_c]:
            return curr_r, curr_c
            
        # Check 8 directions
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]:
            nr, nc = curr_r + dr, curr_c + dc
            if 0 <= nr < resolution and 0 <= nc < resolution and (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc))
                
    return None


def find_accessible_path(
    grid: List[List[bool]], 
    start_pct: Tuple[float, float], 
    end_pct: Tuple[float, float]
) -> Optional[List[Tuple[float, float]]]:
    """
    Executes A* pathfinding over the grid to locate a walkable path.
    
    Args:
        grid: 2D boolean grid mapping obstacles.
        start_pct: Start point in percentage coordinates (0.0 to 100.0).
        end_pct: Target point in percentage coordinates (0.0 to 100.0).
        
    Returns:
        List[Tuple[float, float]] or None: Waypoint percentage coordinates [(x, y), ...] 
                                          representing the path, or None if unreachable.
    """
    resolution = len(grid)
    cell_scale = 100.0 / resolution
    
    # Convert percentage room space to grid indexes
    start_c = int(max(0.0, min(99.0, start_pct[0])) / cell_scale)
    start_r = int(max(0.0, min(99.0, start_pct[1])) / cell_scale)
    end_c = int(max(0.0, min(99.0, end_pct[0])) / cell_scale)
    end_r = int(max(0.0, min(99.0, end_pct[1])) / cell_scale)
    
    # Bind coordinates within grid index sizes
    start_c = max(0, min(resolution - 1, start_c))
    start_r = max(0, min(resolution - 1, start_r))
    end_c = max(0, min(resolution - 1, end_c))
    end_r = max(0, min(resolution - 1, end_r))
    
    # Resilient fallback: locate nearest walkable cells if points sit directly inside padded obstacles
    start_pt = _find_nearest_free_cell(grid, start_r, start_c)
    end_pt = _find_nearest_free_cell(grid, end_r, end_c)
    
    if not start_pt or not end_pt:
        logger.debug("A* Pathfinding aborted: Start or target point is completely enclosed inside obstacles.")
        return None
        
    sr, sc = start_pt
    er, ec = end_pt
    
    # A* algorithm setup
    counter = 0
    # Queue stores: (f_score, tie_breaker_counter, row, col)
    open_set = [(0.0, counter, sr, sc)]
    came_from = {}
    
    g_score = {(r, c): float('inf') for r in range(resolution) for c in range(resolution)}
    g_score[(sr, sc)] = 0.0
    
    f_score = {(r, c): float('inf') for r in range(resolution) for c in range(resolution)}
    f_score[(sr, sc)] = math.hypot(er - sr, ec - sc)
    
    in_open_set = {(sr, sc)}
    
    while open_set:
        _, _, curr_r, curr_c = heapq.heappop(open_set)
        
        # Path solved
        if (curr_r, curr_c) == (er, ec):
            path = []
            curr = (er, ec)
            while curr in came_from:
                # Convert grid indexes back to room percentage coordinates (center of cells)
                pct_x = (curr[1] + 0.5) * cell_scale
                pct_y = (curr[0] + 0.5) * cell_scale
                path.append((pct_x, pct_y))
                curr = came_from[curr]
            # Add start coordinate
            pct_sx = (sc + 0.5) * cell_scale
            pct_sy = (sr + 0.5) * cell_scale
            path.append((pct_sx, pct_sy))
            path.reverse()
            return path
            
        in_open_set.remove((curr_r, curr_c))
        
        # Support 8-way navigation layout: horizontal, vertical, and diagonal steps
        directions = [
            (-1, 0, 1.0), (1, 0, 1.0), (0, -1, 1.0), (0, 1, 1.0),  # orthogonal
            (-1, -1, 1.414), (-1, 1, 1.414), (1, -1, 1.414), (1, 1, 1.414)  # diagonal
        ]
        
        for dr, dc, step_cost in directions:
            nr, nc = curr_r + dr, curr_c + dc
            
            if 0 <= nr < resolution and 0 <= nc < resolution:
                if grid[nr][nc]:  # Occupied/blocked cell
                    continue
                    
                tentative_g = g_score[(curr_r, curr_c)] + step_cost
                if tentative_g < g_score[(nr, nc)]:
                    came_from[(nr, nc)] = (curr_r, curr_c)
                    g_score[(nr, nc)] = tentative_g
                    h = math.hypot(er - nr, ec - nc)
                    f_score[(nr, nc)] = tentative_g + h
                    if (nr, nc) not in in_open_set:
                        counter += 1
                        heapq.heappush(open_set, (f_score[(nr, nc)], counter, nr, nc))
                        in_open_set.add((nr, nc))
                        
    return None  # Unreachable


def calculate_clearance_score(
    furniture_coords: List[Dict[str, Any]], 
    resolution: int = 50
) -> Dict[str, Any]:
    """
    Computes a mathematical accessibility score (0 to 100) representing room flow.
    Deducts score points for overlapping items, blocked pathways, and isolated assets.
    
    Args:
        furniture_coords: List of room items.
        resolution: Internal grid density resolution.
        
    Returns:
        Dict: Contains the final accessibility score and lists of qualitative reasons/observations.
    """
    score = 100.0
    reasoning = []
    
    if not furniture_coords:
        return {
            "score": 100.0,
            "reasoning": [{
                "title": "Open Layout Space", 
                "description": "No furniture detected; circulation pathways are completely open.", 
                "type": "positive"
            }]
        }

    # 1. Parse grids with different inflation levels to gauge comfortable walkway widths
    grid_0 = generate_occupancy_grid(furniture_coords, resolution)
    grid_1 = inflate_obstacles(grid_0, padding_cells=1)  # Minimal body safety clearance
    grid_2 = inflate_obstacles(grid_0, padding_cells=2)  # Generous safety clearance

    # 2. Identify primary entryway door
    door_pos = (50.0, 95.0)
    has_door = False
    for item in furniture_coords:
        if item.get("label", "").lower() == "door" and "boundingBox" in item:
            box = item["boundingBox"]
            door_pos = (box["x"] + box["width"] / 2.0, box["y"] + box["height"] / 2.0)
            has_door = True
            break

    # Calculate grid indices for door and center to check explicit blockages
    cell_scale = 100.0 / resolution
    door_c = int(max(0.0, min(99.0, door_pos[0])) / cell_scale)
    door_r = int(max(0.0, min(99.0, door_pos[1])) / cell_scale)
    center_c = int(50.0 / cell_scale)
    center_r = int(50.0 / cell_scale)

    # Apply direct penalties if entrance or center are directly obstructed by obstacles
    if grid_0[door_r][door_c]:
        score -= 20.0
        reasoning.append({
            "title": "Blocked Entrance Access",
            "description": "Furniture is placed directly in front of the entrance doorway, obstructing entry.",
            "type": "warning"
        })
    if grid_0[center_r][center_c]:
        score -= 15.0
        reasoning.append({
            "title": "Obstructed Room Center",
            "description": "The exact center of the room is occupied by furniture, restricting general flow.",
            "type": "warning"
        })

    # 3. Assess Pathway A: Entrance Door to Room Center (Walkway flow)
    center_pos = (50.0, 50.0)
    path_c2 = find_accessible_path(grid_2, door_pos, center_pos)
    path_c1 = find_accessible_path(grid_1, door_pos, center_pos)
    path_c0 = find_accessible_path(grid_0, door_pos, center_pos)
    
    if not path_c0:
        score -= 45.0
        reasoning.append({
            "title": "Blocked Central Pathway",
            "description": "Main entry to the center of the room is blocked. Rearrange furniture to create open paths.",
            "type": "warning"
        })
    elif not path_c1:
        score -= 20.0
        reasoning.append({
            "title": "Narrow Central Circulation",
            "description": "Pathway to the room center exists but is extremely narrow (below body width standards).",
            "type": "warning"
        })
    elif not path_c2:
        score -= 8.0
        reasoning.append({
            "title": "Tight Central Spacing",
            "description": "Main room pathway is open but lacks comfortable buffer widths.",
            "type": "warning"
        })
    else:
        reasoning.append({
            "title": "Clear Circulation Loop",
            "description": "The central walkway is spacious and comfortable to navigate.",
            "type": "positive"
        })

    # 4. Assess Pathway B: Entrance Door to Major furniture items (Comfortable access)
    major_labels = {"sofa", "bed", "dining table", "desk", "armchair"}
    major_items = [item for item in furniture_coords if item.get("label", "").lower() in major_labels]
    
    for item in major_items:
        box = item.get("boundingBox")
        if not box:
            continue
        label = item["label"]
        obj_center = (box["x"] + box["width"] / 2.0, box["y"] + box["height"] / 2.0)
        
        path_o2 = find_accessible_path(grid_2, door_pos, obj_center)
        path_o1 = find_accessible_path(grid_1, door_pos, obj_center)
        path_o0 = find_accessible_path(grid_0, door_pos, obj_center)
        
        if not path_o0:
            score -= 15.0
            reasoning.append({
                "title": f"Blocked Access to {label}",
                "description": f"The route from the entrance to the {label} is obstructed by surrounding items.",
                "type": "warning"
            })
        elif not path_o1:
            score -= 8.0
            reasoning.append({
                "title": f"Tight Access to {label}",
                "description": f"Walkway access to the {label} is tight and lacks comfortable clearance.",
                "type": "warning"
            })
        elif not path_o2:
            score -= 3.0

    # 5. General room coverage fallback: check corner zones accessibility
    if not major_items:
        corners = [
            ("Top-Left", (15.0, 15.0)),
            ("Top-Right", (85.0, 15.0)),
            ("Bottom-Left", (15.0, 85.0)),
            ("Bottom-Right", (85.0, 85.0))
        ]
        blocked_corners = 0
        for name, pos in corners:
            if not find_accessible_path(grid_1, door_pos, pos):
                blocked_corners += 1
                score -= 10.0
                reasoning.append({
                    "title": f"Blocked {name} Zone",
                    "description": f"Access to the {name} corner zone of the room is blocked.",
                    "type": "warning"
                })
        if blocked_corners == 0:
            reasoning.append({
                "title": "Open Floor Access",
                "description": "All quadrants of the room remain fully accessible.",
                "type": "positive"
            })

    # Limit baseline boundary score minimum
    score = max(10.0, min(100.0, score))
    return {
        "score": round(score, 1),
        "reasoning": reasoning
    }


def check_walkway_clearance(
    furniture_coords: List[Dict[str, Any]], 
    clearance_threshold: float = 3.0
) -> bool:
    """
    Verifies that safety clearance margins between bounding nodes remain open.
    Returns True if primary room circulation is unblocked, False if navigation is impossible.
    
    Args:
        furniture_coords: List of furniture boxes.
        clearance_threshold: Visual width clearance limit.
    """
    grid = generate_occupancy_grid(furniture_coords, resolution=50)
    
    # Map threshold sizes to grid cells inflation logic (e.g. padding cells check)
    padding = 1 if clearance_threshold >= 3.0 else 0
    inflated_grid = inflate_obstacles(grid, padding_cells=padding)
    
    # Identify entrance point
    door_pos = (50.0, 95.0)
    for item in furniture_coords:
        if item.get("label", "").lower() == "door" and "boundingBox" in item:
            box = item["boundingBox"]
            door_pos = (box["x"] + box["width"] / 2.0, box["y"] + box["height"] / 2.0)
            break
            
    # Calculate grid cells indices
    cell_scale = 100.0 / 50
    door_c = int(max(0.0, min(99.0, door_pos[0])) / cell_scale)
    door_r = int(max(0.0, min(99.0, door_pos[1])) / cell_scale)
    center_c = 25
    center_r = 25
    
    # If the entrance door itself or the center itself is directly blocked by obstacles, walkway clearance is False
    if grid[door_r][door_c] or grid[center_r][center_c]:
        return False
        
    # Check if a path exists to the center zone
    center_pos = (50.0, 50.0)
    path = find_accessible_path(inflated_grid, door_pos, center_pos)
    
    # If path is blocked under padding, fallback check if any basic path exists at all
    if not path:
        path_no_padding = find_accessible_path(grid, door_pos, center_pos)
        return path_no_padding is not None
        
    return True
