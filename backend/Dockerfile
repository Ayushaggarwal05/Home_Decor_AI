FROM python:3.12-slim

WORKDIR /workspace

# Install system compilation packages for postgres and general build helpers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Cache requirements installation
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Mount application source files
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
