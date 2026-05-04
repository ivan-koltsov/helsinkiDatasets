import json
import os
from datetime import datetime
from app import app
from models import db, Zone, Dataset, Coverage

def seed_data():
    sample_data_path = os.path.join(os.path.dirname(__file__), 'sample_data.json')
        
    with open(sample_data_path, 'r') as f:
        data = json.load(f)

    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Seed Zones
        for zone_data in data['zones']:
            zone = Zone(
                id=zone_data['id'],
                name=zone_data['name'],
                municipality=zone_data['municipality'],
                lat=zone_data['lat'],
                lon=zone_data['lon']
            )
            db.session.add(zone)

        # Seed Datasets
        for ds_data in data['datasets']:
            dataset = Dataset(
                id=ds_data['id'],
                name=ds_data['name'],
                description=ds_data.get('description'),
                provider=ds_data.get('provider')
            )
            db.session.add(dataset)

        db.session.commit()

        # Seed Coverage
        for cov_data in data['coverage']:
            coverage = Coverage(
                zone_id=cov_data['zone_id'],
                dataset_id=cov_data['dataset_id'],
                last_updated=datetime.strptime(cov_data['last_updated'], '%Y-%m-%d').date()
            )
            db.session.add(coverage)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()
