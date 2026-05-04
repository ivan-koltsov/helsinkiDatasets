import pytest
from app import app as flask_app
from models import db

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
    })
    
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json == {"status": "healthy"}

def test_get_zones_with_data(client):
    # Seed data
    with client.application.app_context():
        from models import Zone
        z = Zone(id=1, name="Kallio", municipality="Helsinki", lat=60.1, lon=24.9)
        db.session.add(z)
        db.session.commit()
    
    response = client.get("/api/zones")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["name"] == "Kallio"

def test_get_datasets_with_data(client):
    # Seed data
    with client.application.app_context():
        from models import Dataset
        d = Dataset(id=1, name="Building Permits", description="Test", provider="Test Provider")
        db.session.add(d)
        db.session.commit()
    
    response = client.get("/api/datasets")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["name"] == "Building Permits"

def test_get_coverage_filtering(client):
    # Seed data
    with client.application.app_context():
        from models import Zone, Dataset, Coverage
        from datetime import date
        z1 = Zone(id=1, name="Z1", municipality="H", lat=60, lon=24)
        z2 = Zone(id=2, name="Z2", municipality="H", lat=61, lon=25)
        d1 = Dataset(id=1, name="D1")
        db.session.add_all([z1, z2, d1])
        db.session.commit()
        
        c1 = Coverage(zone_id=1, dataset_id=1, last_updated=date(2026, 4, 1))
        db.session.add(c1)
        db.session.commit()
        
    # Filter by zone_id
    response = client.get("/api/coverage?zone_id=1")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["zone_id"] == 1
    
    # Filter by zone_id (no results)
    response = client.get("/api/coverage?zone_id=2")
    assert len(response.json) == 0
    
    # Filter by dataset_id
    response = client.get("/api/coverage?dataset_id=1")
    assert len(response.json) == 1
