import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Zone, Coverage } from '../types';
import L from 'leaflet';

// Fix for Leaflet default icon issues in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onZoneSelect: (zone: Zone) => void;
  highlightedZoneIds: number[];
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export const Map = ({ zones, selectedZone, onZoneSelect, highlightedZoneIds }: MapProps) => {
  const helsinkiCenter: [number, number] = [60.192059, 24.945831];

  return (
    <div className="map-container">
      <MapContainer 
        center={helsinkiCenter} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {zones.map((zone) => {
          const isHighlighted = highlightedZoneIds.includes(zone.id);
          const isSelected = selectedZone?.id === zone.id;
          
          return (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lon]}
              radius={isHighlighted ? 1000 : (isSelected ? 800 : 500)}
              pathOptions={{
                fillColor: isHighlighted ? '#3b82f6' : (isSelected ? '#10b981' : '#6b7280'),
                color: isHighlighted ? '#2563eb' : (isSelected ? '#059669' : '#4b5563'),
                fillOpacity: isHighlighted ? 0.6 : 0.4,
                weight: isSelected || isHighlighted ? 3 : 1
              }}
              eventHandlers={{
                click: () => onZoneSelect(zone)
              }}
            >
              <Popup>
                <strong>{zone.name}</strong><br />
                {zone.municipality}
              </Popup>
            </Circle>
          );
        })}
        
        {selectedZone && <MapUpdater center={[selectedZone.lat, selectedZone.lon]} />}
      </MapContainer>
    </div>
  );
};
