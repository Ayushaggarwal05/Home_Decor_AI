import os
import shutil
from fastapi import UploadFile
from datetime import datetime

class LocalStorageClient:
    """Manages saving uploaded image files onto the local filesystem directory."""
    
    def __init__(self, upload_dir: str = "static/uploads"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_file(self, file: UploadFile) -> str:
        """Saves file payload and returns local relative filepath endpoint."""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        filepath = os.path.join(self.upload_dir, filename)
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return f"/{self.upload_dir}/{filename}"
