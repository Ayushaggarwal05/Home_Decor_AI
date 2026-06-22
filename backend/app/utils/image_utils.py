import io
from PIL import Image
from fastapi import UploadFile

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]

def validate_image_extension(file: UploadFile) -> bool:
    """Verifies file headers map to allowed graphic MIME types."""
    return file.content_type in ALLOWED_MIME_TYPES

def compress_uploaded_image(image_bytes: bytes, max_size_kb: int = 1024, max_dimension: int = 1920) -> bytes:
    """
    Loads image from raw bytes, resizes if width/height exceed max_dimension,
    and compresses it as a progressive JPEG to save storage space and bandwidth.
    """
    try:
        # Load image from bytes
        img_io = io.BytesIO(image_bytes)
        img = Image.open(img_io)
        
        # Convert to RGB mode if necessary (JPEG doesn't support RGBA/P formats)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        # Resize if dimensions exceed threshold
        width, height = img.size
        if width > max_dimension or height > max_dimension:
            if width > height:
                new_width = max_dimension
                new_height = int((height / width) * max_dimension)
            else:
                new_height = max_dimension
                new_width = int((width / height) * max_dimension)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
        # Compress image with quality adjustments
        out_io = io.BytesIO()
        quality = 80
        img.save(out_io, format="JPEG", optimize=True, quality=quality, progressive=True)
        
        compressed_bytes = out_io.getvalue()
        
        # If still larger than target max_size_kb, reduce quality iteratively
        while len(compressed_bytes) > max_size_kb * 1024 and quality > 30:
            quality -= 10
            out_io = io.BytesIO()
            img.save(out_io, format="JPEG", optimize=True, quality=quality, progressive=True)
            compressed_bytes = out_io.getvalue()
            
        return compressed_bytes
    except Exception:
        # Fall back to raw bytes if PIL fails
        return image_bytes
