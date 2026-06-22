from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies.auth import get_current_user
from app.models.user import User
from app.tasks.analysis_tasks import celery_app
from typing import Any, Dict

router = APIRouter(prefix="/tasks", tags=["Async Task Status"])


@router.get("/{task_id}", response_model=Dict[str, Any])
def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Generic Celery task status polling endpoint.
    Returns task state and result for any queued background job.
    States: PENDING → STARTED → SUCCESS / FAILURE / RETRY
    """
    result = celery_app.AsyncResult(task_id)

    response: Dict[str, Any] = {
        "task_id": task_id,
        "status": result.state,
        "result": None,
        "error": None,
    }

    if result.state == "SUCCESS":
        response["result"] = result.result
    elif result.state == "FAILURE":
        response["error"] = str(result.info)
    elif result.state in ("STARTED", "RETRY"):
        # Include progress metadata if the task emits it via update_state
        if isinstance(result.info, dict):
            response["meta"] = result.info

    return response
