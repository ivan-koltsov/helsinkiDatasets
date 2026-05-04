import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Zone, Dataset, Coverage
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db.init_app(app)

@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if hasattr(e, 'code'):
        code = e.code
    return jsonify({
        "error": str(e),
        "status": code
    }), code

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/zones', methods=['GET'])
def get_zones():
    zones = Zone.query.all()
    return jsonify([z.to_dict() for z in zones])

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    datasets = Dataset.query.all()
    return jsonify([d.to_dict() for d in datasets])

@app.route('/api/coverage', methods=['GET'])
def get_coverage():
    zone_id = request.args.get('zone_id', type=int)
    dataset_id = request.args.get('dataset_id', type=int)
    
    query = Coverage.query
    if zone_id:
        query = query.filter_by(zone_id=zone_id)
    if dataset_id:
        query = query.filter_by(dataset_id=dataset_id)
        
    results = query.all()
    return jsonify([r.to_dict() for r in results])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
