import pytest
import io
from app.models.user import User
from app.core.security import create_access_token

@pytest.fixture
def auth_headers(db):
    # Seed active authenticated test user
    user = User(
        email="test_designer@auraspatial.com",
        hashed_password="hashedpassword123",
        full_name="Aura Designer",
        tier="Pro"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    token = create_access_token(subject=user.id)
    return {"Authorization": f"Bearer {token}"}

def test_upload_image(client, auth_headers):
    # Create simple dummy PNG format file stream
    file_content = b"fake image bytes content mapping"
    file = ("living_room.png", io.BytesIO(file_content), "image/png")
    
    response = client.post("/api/upload", files={"file": file}, headers=auth_headers)
    assert response.status_code == 200
    assert "url" in response.json()
    assert response.json()["url"].startswith("/static/uploads/") or "cloudinary" in response.json()["url"]

def test_room_scan_and_analysis_flow(client, auth_headers):
    # 1. Create a scanned room with parameters
    room_in = {
        "name": "Japandi Living Room",
        "space_type": "living_room",
        "style_preference": "Japandi Harmony",
        "length": 16.0,
        "width": 12.0,
        "unit": "ft"
    }
    
    # image_url passed as query parameter as defined in endpoint
    response = client.post(
        "/api/analyze/room?image_url=/static/uploads/dummy.jpg",
        json=room_in,
        headers=auth_headers
    )
    assert response.status_code == 201
    room_res = response.json()
    assert room_res["name"] == "Japandi Living Room"
    room_id = room_res["id"]

    # 2. Get history lists
    response = client.get("/api/analyze/rooms", headers=auth_headers)
    assert response.status_code == 200
    rooms_list = response.json()
    assert len(rooms_list) > 0
    assert rooms_list[0]["id"] == room_id

    # 3. Get single room details
    response = client.get(f"/api/analyze/room/{room_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Japandi Living Room"

    # 4. Get room analysis result (expected 202 as background celery task is mocked)
    response = client.get(f"/api/analyze/room/{room_id}/result", headers=auth_headers)
    assert response.status_code == 202

def test_inspirations_retrieval(client, auth_headers):
    # Pull inspirations from vector database catalog
    response = client.get(
        "/api/retrieval/inspirations?prompt=cozy wood room&style=Japandi Harmony",
        headers=auth_headers
    )
    assert response.status_code == 200
    urls = response.json()
    assert len(urls) > 0
    assert any("unsplash" in url for url in urls)
