import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-rotatedmarker';

// Mock cities data for testing
const mockCities = [
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 }
];

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom truck icon SVG
const truckIconUrl = `data:image/svg+xml;base64,${btoa(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#FFB800"/>
</svg>
`)}`;

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Truck animation component with rotation
const MovingTruck = ({ route, progress }) => {
  const map = useMap();
  const [truckPosition, setTruckPosition] = useState(null);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    if (!route.optimizedPath || route.optimizedPath.length < 2) return;

    const coordinates = route.optimizedPath.map(cityName => {
      const city = mockCities.find(city => city.name === cityName);
      return city ? [city.lat, city.lng] : null;
    }).filter(coord => coord !== null);

    if (coordinates.length < 2) return;

    const polyline = L.polyline(coordinates);
    const length = polyline.getLatLngs().length;
    
    // Calculate current position based on progress
    const currentIndex = Math.floor((progress / 100) * (length - 1));
    const nextIndex = Math.min(currentIndex + 1, length - 1);
    const segmentProgress = (progress / 100) * (length - 1) - currentIndex;
    
    const currentPos = polyline.getLatLngs()[currentIndex];
    const nextPos = polyline.getLatLngs()[nextIndex];
    
    // Interpolate position
    const newLat = currentPos.lat + (nextPos.lat - currentPos.lat) * segmentProgress;
    const newLng = currentPos.lng + (nextPos.lng - currentPos.lng) * segmentProgress;
    
    setTruckPosition([newLat, newLng]);
    
    // Calculate rotation angle for the truck
    if (currentPos && nextPos) {
      const angle = Math.atan2(nextPos.lng - currentPos.lng, nextPos.lat - currentPos.lat) * 180 / Math.PI;
      setRotation(angle);
    }
  }, [route, progress, map]);

  return truckPosition ? (
    <Marker 
      position={truckPosition} 
      icon={truckIcon}
      rotationAngle={rotation}
      rotationOrigin="center"
    >
      <Popup>
        <div className="text-center">
          <p className="font-semibold">Delivery Truck</p>
          <p className="text-sm">Progress: {Math.round(progress)}%</p>
          <p className="text-xs text-gray-600">
            {route.currentLocation} → {route.destination}
          </p>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

const RoutePlanner = () => {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    origin: '',
    destination: '',
    waypoints: '',
    vehicleId: '',
    departureTime: '',
  });
  const [activeRoutes, setActiveRoutes] = useState([]);

  // Mock route optimization
  const optimizeRoute = (origin, destination, waypoints) => {
    const points = [origin, ...(waypoints ? waypoints.split(',') : []), destination]
      .filter(cityName => mockCities.find(city => city.name === cityName));
    return points;
  };

  // Mock ETA calculation
  const calculateETA = (origin, destination) => {
    const originCity = mockCities.find(city => city.name === origin);
    const destCity = mockCities.find(city => city.name === destination);
    if (!originCity || !destCity) return new Date();
    
    const hours = Math.floor(Math.random() * 8) + 1;
    const now = new Date();
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const optimizedRoute = optimizeRoute(
      newRoute.origin,
      newRoute.destination,
      newRoute.waypoints
    );

    const route = {
      id: `R${Date.now()}`,
      ...newRoute,
      optimizedPath: optimizedRoute,
      status: 'Pending',
      progress: 0,
      eta: calculateETA(newRoute.origin, newRoute.destination),
      currentLocation: newRoute.origin,
      started: false
    };

    setRoutes([...routes, route]);
    setActiveRoutes([...activeRoutes, route]);
    setNewRoute({
      origin: '',
      destination: '',
      waypoints: '',
      vehicleId: '',
      departureTime: '',
    });
  };

  // Add function to start consignment
  const startConsignment = (routeId) => {
    setActiveRoutes(prevRoutes =>
      prevRoutes.map(route => 
        route.id === routeId 
          ? { ...route, status: 'In Transit', started: true }
          : route
      )
    );
  };

  // Simulate route progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoutes(prevRoutes =>
        prevRoutes.map(route => ({
          ...route,
          progress: route.started ? Math.min(route.progress + Math.random() * 5, 100) : route.progress,
          status: route.started && route.progress >= 100 ? 'Delivered' : route.status
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update getRouteCoordinates to be memoized
  const getRouteCoordinates = useMemo(() => (route) => {
    if (!route.optimizedPath) return [];
    return route.optimizedPath.map(cityName => {
      const city = mockCities.find(city => city.name === cityName);
      return city ? [city.lat, city.lng] : null;
    }).filter(coord => coord !== null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Route Creation Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Create New Route</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Origin</label>
              <select
                value={newRoute.origin}
                onChange={(e) => setNewRoute({ ...newRoute, origin: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              >
                <option value="">Select Origin</option>
                {mockCities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination</label>
              <select
                value={newRoute.destination}
                onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              >
                <option value="">Select Destination</option>
                {mockCities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Waypoints (Optional)</label>
              <select
                value={newRoute.waypoints}
                onChange={(e) => setNewRoute({ ...newRoute, waypoints: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="">Select Waypoint</option>
                {mockCities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle ID</label>
              <input
                type="text"
                value={newRoute.vehicleId}
                onChange={(e) => setNewRoute({ ...newRoute, vehicleId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Enter Vehicle ID"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Departure Time</label>
              <input
                type="datetime-local"
                value={newRoute.departureTime}
                onChange={(e) => setNewRoute({ ...newRoute, departureTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Optimize Route & Schedule
            </button>
          </div>
        </form>
      </div>

      {/* Active Routes */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Routes</h2>
        {activeRoutes.map(route => (
          <div key={route.id} className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Shipment #{route.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    route.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    route.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {route.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {route.origin} → {route.destination}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Departure: {new Date(route.departureTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      ETA: {route.eta.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Vehicle: {route.vehicleId}
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-yellow-600">
                        {Math.round(route.progress)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                    <div
                      style={{ width: `${route.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  {!route.started && route.status !== 'Delivered' && (
                    <button
                      onClick={() => startConsignment(route.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Start Consignment
                    </button>
                  )}
                  <button
                    onClick={() => window.location.href = '/blockchain'}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Verify Blockchain
                  </button>
                </div>
              </div>
              
              {/* Map View */}
              <div className="relative h-64 rounded-lg overflow-hidden">
                <MapContainer
                  center={[19.0760, 72.8777]}
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {route.optimizedPath && route.optimizedPath.map((cityName, index) => {
                    const city = mockCities.find(city => city.name === cityName);
                    return city ? (
                      <Marker
                        key={`${cityName}-${index}`}
                        position={[city.lat, city.lng]}
                      >
                        <Popup>{cityName}</Popup>
                      </Marker>
                    ) : null;
                  })}
                  <Polyline
                    positions={getRouteCoordinates(route)}
                    color="yellow"
                    weight={3}
                    opacity={0.7}
                  />
                  {route.started && <MovingTruck route={route} progress={route.progress} />}
                </MapContainer>
                {/* Map Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="text-sm">Current Location: {route.currentLocation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutePlanner; 