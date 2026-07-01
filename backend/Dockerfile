FROM python:3.12-slim

WORKDIR /workspace

# Install system compilation packages for postgres, general build helpers, and OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libgl1 \
    libglib2.0-0 \
    libxcb1 \
    libx11-6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# Cache requirements installation
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Mount application source files
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
