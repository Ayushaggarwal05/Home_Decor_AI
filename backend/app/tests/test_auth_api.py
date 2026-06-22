import pytest

def test_auth_flow(client):
    # 1. Register a test user
    signup_data = {
        "email": "testuser@auraspatial.com",
        "password": "testpassword123",
        "full_name": "Aura Test User",
        "tier": "Pro"
    }
    response = client.post("/api/auth/signup", json=signup_data)
    assert response.status_code == 201
    user_res = response.json()
    assert user_res["email"] == signup_data["email"]
    assert user_res["full_name"] == signup_data["full_name"]
    assert user_res["tier"] == "Pro"
    assert "id" in user_res

    # 2. Login with credentials
    login_data = {
        "username": "testuser@auraspatial.com",
        "password": "testpassword123"
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    token_res = response.json()
    assert "access_token" in token_res
    assert "refresh_token" in token_res
    assert token_res["token_type"] == "bearer"
    
    access_token = token_res["access_token"]
    refresh_token = token_res["refresh_token"]

    # 3. Get /me user profiles
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    me_res = response.json()
    assert me_res["email"] == signup_data["email"]

    # 4. Refresh token rotation
    refresh_payload = {"refresh_token": refresh_token}
    response = client.post("/api/auth/refresh", json=refresh_payload)
    assert response.status_code == 200
    rotated_res = response.json()
    assert "access_token" in rotated_res
    assert "refresh_token" in rotated_res
    
    # 5. Access profile details with new access token
    new_access_token = rotated_res["access_token"]
    new_headers = {"Authorization": f"Bearer {new_access_token}"}
    response = client.get("/api/auth/me", headers=new_headers)
    assert response.status_code == 200
    assert response.json()["email"] == signup_data["email"]

def test_refresh_token_invalid(client):
    # Submit invalid refresh token
    refresh_payload = {"refresh_token": "invalid_refresh_token_signature"}
    response = client.post("/api/auth/refresh", json=refresh_payload)
    assert response.status_code == 401
    assert "detail" in response.json()
