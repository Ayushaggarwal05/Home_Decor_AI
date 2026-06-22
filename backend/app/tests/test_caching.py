import pytest
import asyncio
from app.utils.cache import cache_response
from app.core.config import settings

@pytest.mark.asyncio
async def test_cache_response_bypasses_in_testing():
    # Enforce testing profile to guarantee bypass behavior
    settings.ENV = "testing"
    
    called_count = 0
    
    @cache_response(expire_seconds=10)
    async def get_test_metrics():
        nonlocal called_count
        called_count += 1
        return {"count": called_count}
        
    res1 = await get_test_metrics()
    res2 = await get_test_metrics()
    
    # Since settings.ENV is "testing", it should bypass Redis caching entirely
    assert res1["count"] == 1
    assert res2["count"] == 2
