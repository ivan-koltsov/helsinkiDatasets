from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Zone(db.Model):
    __tablename__ = 'zones'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    municipality = db.Column(db.String(100), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    
    coverages = db.relationship('Coverage', back_populates='zone', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'municipality': self.municipality,
            'lat': self.lat,
            'lon': self.lon
        }

class Dataset(db.Model):
    __tablename__ = 'datasets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    provider = db.Column(db.String(100))

    coverages = db.relationship('Coverage', back_populates='dataset', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'provider': self.provider
        }

class Coverage(db.Model):
    __tablename__ = 'coverage'
    zone_id = db.Column(db.Integer, db.ForeignKey('zones.id'), primary_key=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'), primary_key=True)
    last_updated = db.Column(db.Date, nullable=False)

    zone = db.relationship('Zone', back_populates='coverages')
    dataset = db.relationship('Dataset', back_populates='coverages')

    def to_dict(self):
        return {
            'zone_id': self.zone_id,
            'dataset_id': self.dataset_id,
            'last_updated': self.last_updated.isoformat(),
            'dataset_name': self.dataset.name if self.dataset else None,
            'zone_name': self.zone.name if self.zone else None
        }
