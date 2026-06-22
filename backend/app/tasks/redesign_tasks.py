from app.tasks.analysis_tasks import celery_app
from app.database.session import SessionLocal
from app.models.redesign import Redesign
from app.ai.generation import ImageGenerationInterface
import logging
import time

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=15)
def run_generative_redesign_task(self, redesign_id: int) -> int:
    """Asynchronously triggers Stable Diffusion diffusion checks and links renders."""
    logger.info(f"Starting generative redesign background task for ID: {redesign_id}")
    db = SessionLocal()
    try:
        redesign = db.query(Redesign).filter(Redesign.id == redesign_id).first()
        if not redesign:
            logger.error(f"Redesign record {redesign_id} not found.")
            return -1

        # Mark task status as active
        redesign.status = "generating"
        db.commit()

        # Simulate heavy diffusion GPU delay
        time.sleep(3.0)

        # Trigger model interface
        generator = ImageGenerationInterface()
        redesigned_url, suggestions = generator.generate_redesigned_room(
            image_url=redesign.original_image_url,
            prompt=redesign.prompt,
            style=redesign.selected_style
        )

        # Update database entity
        redesign.redesigned_image_url = redesigned_url
        redesign.suggestions = suggestions
        redesign.status = "completed"
        
        db.commit()
        logger.info(f"Generative redesign completed successfully for ID: {redesign_id}")
        return redesign.id

    except Exception as exc:
        db.rollback()
        logger.error(f"Error in redesign task: {exc}. Retrying...")
        if redesign:
            redesign.status = "failed"
            db.commit()
        raise self.retry(exc=exc)
    finally:
        db.close()
