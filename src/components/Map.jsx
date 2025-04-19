import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map bounds when route changes
const MapUpdater = ({ route }) => {
  const map = useMap();
  
  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route.map(point => [point.lat, point.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  
  return null;
};

const Map = ({ route }) => {
  // Convert route points to Leaflet format
  const routePoints = route.map(point => [point.lat, point.lng]);
  
  return (
    <MapContainer
      center={route.length > 0 ? [route[0].lat, route[0].lng] : [0, 0]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Draw route line */}
      {routePoints.length > 1 && (
        <Polyline
          positions={routePoints}
          color="#2196f3"
          weight={3}
          opacity={0.7}
        />
      )}
      
      {/* Add markers for each point */}
      {route.map((point, index) => (
        <Marker 
          key={index} 
          position={[point.lat, point.lng]}
          icon={markerIcon}
        >
          <Popup>
            <div>
              <strong>{point.name || `Stop ${index + 1}`}</strong>
              <br />
              {index === 0 ? 'Start' : index === route.length - 1 ? 'End' : `Stop ${index + 1}`}
            </div>
          </Popup>
        </Marker>
      ))}
      
      <MapUpdater route={route} />
    </MapContainer>
  );
};

export default Map; 