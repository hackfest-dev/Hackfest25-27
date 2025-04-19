import { useState } from 'react';
import Map from './Map';

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

const RouteOptimizer = ({ onRouteOptimized }) => {
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([
    { name: "", lat: "", lng: "" } // Initial empty source location
  ]);

  // Add new destination field
  const addDestination = () => {
    setLocations([...locations, { name: "", lat: "", lng: "" }]);
  };

  // Remove a destination
  const removeDestination = (index) => {
    if (locations.length > 1) {
      const newLocations = locations.filter((_, i) => i !== index);
      setLocations(newLocations);
    }
  };

  // Fetch coordinates for a location name
  const fetchCoordinates = async (locationName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      throw new Error(`Location not found: ${locationName}`);
    } catch (error) {
      throw new Error(`Failed to get coordinates for ${locationName}`);
    }
  };

  // Handle location name input and fetch coordinates
  const handleLocationInput = async (index, value) => {
    const newLocations = [...locations];
    newLocations[index].name = value;
    setLocations(newLocations);

    if (value.trim()) {
      try {
        const coords = await fetchCoordinates(value);
        newLocations[index].lat = coords.lat;
        newLocations[index].lng = coords.lng;
        setLocations([...newLocations]);
      } catch (err) {
        // Don't set error here to allow user to continue typing
        console.log(err);
      }
    }
  };

  // Calculate distance between two points using Haversine formula
  const getDistance = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(point2.lat - point1.lat);
    const dLon = toRad(point2.lng - point1.lng);
    const lat1 = toRad(point1.lat);
    const lat2 = toRad(point2.lat);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toRad = (value) => {
    return value * Math.PI / 180;
  };

  // Validate locations
  const validateLocations = () => {
    for (const location of locations) {
      if (!location.name || !location.lat || !location.lng) {
        setError('Please enter valid location names');
        return false;
      }
    }
    return true;
  };

  // Nearest neighbor algorithm for route optimization
  const optimizeRoute = async () => {
    setError(null);
    if (!validateLocations()) return;

    setLoading(true);
    try {
      // Start from the first location (source)
      const start = locations[0];
      const destinations = [...locations.slice(1)];
      const optimizedRoute = [start];
      let currentPoint = start;

      // Find nearest unvisited point
      while (destinations.length > 0) {
        let nearestIndex = 0;
        let shortestDistance = Infinity;

        destinations.forEach((point, index) => {
          const distance = getDistance(currentPoint, point);
          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestIndex = index;
          }
        });

        currentPoint = destinations[nearestIndex];
        optimizedRoute.push(currentPoint);
        destinations.splice(nearestIndex, 1);
      }

      setRoute(optimizedRoute);
      
      // Call the onRouteOptimized callback with the optimized route
      if (onRouteOptimized) {
        onRouteOptimized(optimizedRoute);
      }
    } catch (err) {
      setError('Failed to optimize route');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total distance of the route
  const calculateTotalDistance = () => {
    if (route.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += getDistance(route[i], route[i + 1]);
    }
    return totalDistance.toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Route Optimization</h1>
        <p className="text-gray-600 mb-6">
          Enter your locations and we'll find the optimized delivery route.
        </p>

        {/* Location Input Form */}
        <div className="mb-6 space-y-4">
          {locations.map((location, index) => (
            <div key={index} className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {index === 0 ? 'Source Location' : `Destination ${index}`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location.name}
                    onChange={(e) => handleLocationInput(index, e.target.value)}
                    placeholder="Enter location name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {location.lat && location.lng && (
                    <span className="absolute right-2 top-2 text-xs text-green-600">
                      ✓ Found
                    </span>
                  )}
                </div>
                {location.lat && location.lng && (
                  <p className="mt-1 text-xs text-gray-500">
                    Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                )}
              </div>
              {index > 0 && (
                <button
                  onClick={() => removeDestination(index)}
                  className="self-start px-3 py-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addDestination}
            className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Destination
          </button>
        </div>
        
        <button
          onClick={optimizeRoute}
          disabled={loading || locations.length < 2}
          className={`px-6 py-3 rounded-lg font-semibold text-white ${
            loading || locations.length < 2
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors duration-200`}
        >
          {loading ? 'Optimizing...' : 'Optimize Route'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {route.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Optimized Route</h2>
            
            {/* Add Map Component */}
            <div className="mb-6 h-[400px] rounded-lg overflow-hidden">
              <Map route={route} />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stop</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Distance to Next</th>
                  </tr>
                </thead>
                <tbody>
                  {route.map((point, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-800">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{point.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {index < route.length - 1 
                          ? `${getDistance(point, route[index + 1]).toFixed(2)} km`
                          : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
                {route.length > 1 && (
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan="2" className="px-4 py-3 text-sm font-semibold text-gray-800 text-right">
                        Total Distance:
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                        {calculateTotalDistance()} km
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Route Summary</h3>
              <p className="text-blue-600">
                Total stops: {route.length} <br />
                {route.length > 1 && `Total distance: ${calculateTotalDistance()} km`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteOptimizer; 