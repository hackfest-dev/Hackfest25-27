import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { format, addMinutes } from 'date-fns';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Chip,
  Stack,
  Button
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Location names for the path
const locationNames = [
  "Mysore",
  "Hebbal",
  "Koramangala",
  "Whitefield"
];

// Component to update map view when current position changes
const MapUpdater = ({ currentPosition }) => {
  const map = useMap();
  
  useEffect(() => {
    if (currentPosition) {
      map.setView(currentPosition, 12);
    }
  }, [currentPosition, map]);
  
  return null;
};

const ShipmentTracker = ({ path }) => {
  const [currentPosition, setCurrentPosition] = useState(path[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [eta, setEta] = useState(null);
  const [startTime] = useState(new Date());
  const animationRef = useRef(null);

  // Calculate the total distance of the route
  const calculateTotalDistance = () => {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const point1 = L.latLng(path[i]);
      const point2 = L.latLng(path[i + 1]);
      total += point1.distanceTo(point2);
    }
    return total;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (currentIndex === 0) return 0;
    return (currentIndex / (path.length - 1)) * 100;
  };

  // Interpolate position between two points
  const interpolatePosition = (start, end, fraction) => {
    return [
      start[0] + (end[0] - start[0]) * fraction,
      start[1] + (end[1] - start[1]) * fraction
    ];
  };

  // Start tracking simulation
  const startTracking = () => {
    setIsTracking(true);
    setCurrentIndex(0);
    setCurrentPosition(path[0]);
    setEta(addMinutes(new Date(), (path.length - 1) * 2)); // 2 minutes per leg
  };

  // Stop tracking simulation
  const stopTracking = () => {
    setIsTracking(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Update position and animate movement
  useEffect(() => {
    if (!isTracking) return;

    let lastTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime > 2000) { // Move every 2 seconds
        lastTime = currentTime;
        
        if (currentIndex < path.length - 1) {
          setCurrentIndex(prev => {
            const next = prev + 1;
            setCurrentPosition(path[next]);
            return next;
          });
        } else {
          stopTracking();
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTracking, currentIndex, path]);

  // Get status text based on progress
  const getStatusText = () => {
    if (!isTracking) return 'Ready for Dispatch';
    if (currentIndex === path.length - 1) return 'Delivered';
    return 'In Transit';
  };

  // Get status color based on progress
  const getStatusColor = () => {
    if (!isTracking) return 'bg-gray-500';
    if (currentIndex === path.length - 1) return 'bg-green-500';
    return 'bg-blue-500';
  };

  // Calculate remaining time
  const getRemainingTime = () => {
    if (!isTracking) return 0;
    const remainingLegs = path.length - 1 - currentIndex;
    return remainingLegs * 2; // 2 minutes per leg
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Info Card */}
      <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-2">Shipment Status</h2>
        
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
          <span className="font-medium">{getStatusText()}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">ETA Remaining:</span>
            <span className="ml-2 font-medium">{getRemainingTime()} min</span>
          </div>
          <div>
            <span className="text-gray-500">Current Location:</span>
            <span className="ml-2 font-medium">
              {currentPosition ? `${currentPosition[0].toFixed(4)}, ${currentPosition[1].toFixed(4)}` : 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={isTracking ? stopTracking : startTracking}
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-300 ${
              isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isTracking ? 'Stop Shipment' : 'Start Shipment'}
          </button>
        </div>
      </div>
      
      {/* Map */}
      <div className="h-[500px] rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={currentPosition}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Route line */}
          <Polyline
            positions={path}
            color="#2196f3"
            weight={3}
            opacity={0.7}
          />
          
          {/* Current position marker */}
          <Marker
            position={currentPosition}
            icon={truckIcon}
          >
            <Popup>
              <div className="text-center">
                <b>{locationNames[currentIndex] || 'Unknown Location'}</b>
                <br />
                {currentPosition ? `${currentPosition[0].toFixed(4)}, ${currentPosition[1].toFixed(4)}` : 'N/A'}
              </div>
            </Popup>
          </Marker>
          
          <MapUpdater currentPosition={currentPosition} />
        </MapContainer>
      </div>
    </div>
  );
};

export default ShipmentTracker; 