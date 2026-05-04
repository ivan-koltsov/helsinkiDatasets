import { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { api } from './services/api';
import { Zone, Dataset, Coverage, Freshness } from './types';
import { Info, Database, MapPin, AlertCircle } from 'lucide-react';

function App() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);
  const [zoneCoverage, setZoneCoverage] = useState<Coverage[]>([]);
  const [highlightedZoneIds, setHighlightedZoneIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [z, d] = await Promise.all([api.getZones(), api.getDatasets()]);
        setZones(z);
        setDatasets(d);
      } catch (err) {
        setError('Failed to load initial data. Is the backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedZone) {
      api.getCoverage({ zone_id: selectedZone.id })
        .then(setZoneCoverage)
        .catch(console.error);
    }
  }, [selectedZone]);

  useEffect(() => {
    if (selectedDatasetId) {
      api.getCoverage({ dataset_id: selectedDatasetId })
        .then(cov => setHighlightedZoneIds(cov.map(c => c.zone_id)))
        .catch(console.error);
    } else {
      setHighlightedZoneIds([]);
    }
  }, [selectedDatasetId]);

  const getFreshness = (dateStr: string): Freshness => {
    const lastUpdated = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return 'fresh';
    if (diffDays < 90) return 'ageing';
    return 'stale';
  };

  if (loading) return <div className="loading-screen">Loading Helsinki Data...</div>;
  if (error) return <div className="error-screen"><AlertCircle /> {error}</div>;

  return (
    <div className="app-container">
      <Map 
        zones={zones} 
        selectedZone={selectedZone}
        onZoneSelect={setSelectedZone}
        highlightedZoneIds={highlightedZoneIds}
      />
      
      <div className="sidebar">
        <header>
          <h1>Helsinki Data</h1>
          <p>Sales Enablement Tool</p>
        </header>

        <section className="card">
          <h3><Database size={18} /> Dataset Coverage</h3>
          <p className="text-sm">Highlight districts covered by:</p>
          <select 
            className="select-control"
            value={selectedDatasetId || ''} 
            onChange={(e) => setSelectedDatasetId(Number(e.target.value) || null)}
          >
            <option value="">Select a dataset...</option>
            {datasets.map(ds => (
              <option key={ds.id} value={ds.id}>{ds.name}</option>
            ))}
          </select>
          {selectedDatasetId && (
            <div className="text-sm">
              Districts covered: {highlightedZoneIds.length}
            </div>
          )}
        </section>

        <section className="card">
          <h3><MapPin size={18} /> Zone Details</h3>
          {!selectedZone ? (
            <p className="text-sm italic">Click a district on the map to see available data.</p>
          ) : (
            <div>
              <h4>{selectedZone.name}</h4>
              <p className="text-sm">{selectedZone.municipality}</p>
              
              <div className="dataset-list">
                <h5>Available Datasets:</h5>
                {zoneCoverage.length === 0 ? (
                  <p className="text-sm">No datasets available for this area.</p>
                ) : (
                  zoneCoverage.map(cov => {
                    const fresh = getFreshness(cov.last_updated);
                    return (
                      <div key={cov.dataset_id} className="dataset-item">
                        <span className="text-sm">{cov.dataset_name}</span>
                        <span className={`badge badge-${fresh}`}>{fresh}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </section>

        <footer className="text-xs opacity-50">
          <p>© 2026 Helsinki Data Services</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
