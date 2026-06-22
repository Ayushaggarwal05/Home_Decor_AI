from fastapi import UploadFile, HTTPException
import io
from app.storage.local_storage import LocalStorageClient
from app.storage.cloudinary import CloudinaryStorageClient
from app.utils.image_utils import validate_image_extension, compress_uploaded_image
from app.core.config import settings

class UploadService:
    """Orchestrates routing file uploads to either CDN networks or local volumes."""
    
    def __init__(self):
        self.local_client = LocalStorageClient()
        self.cloud_client = CloudinaryStorageClient()

    async def upload_room_image(self, file: UploadFile) -> str:
        """Validates payload format, compresses image, and pushes stream to storage clients."""
        if not validate_image_extension(file):
            raise HTTPException(
                status_code=400,
                detail="Unsupported graphic format. Please upload JPEG, PNG, or WEBP."
            )

        # 1. Enforce 5MB limit check before processing
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5MB
        if file_size > MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds the maximum allowed limit of 5MB."
            )

        # 2. Compress image using Pillow
        raw_bytes = await file.read()
        compressed_bytes = compress_uploaded_image(raw_bytes, max_size_kb=1024)
        
        # 3. Replace the file object stream with compressed bytes for storage handlers
        file.file = io.BytesIO(compressed_bytes)

        # 4. Route upload depending on active environment
        if settings.ENV == "production":
            return await self.cloud_client.upload_image(file)
        else:
            # Fall back to local uploads during development/testing
            return await self.local_client.save_file(file)
