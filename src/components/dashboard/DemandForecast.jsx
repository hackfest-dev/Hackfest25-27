import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DemandForecast = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fake data for distributor demands
  const distributorDemands = [
    {
      id: 1,
      name: "Distributor A",
      location: "Mumbai",
      currentDemand: 500,
      forecastedDemand: 750,
      trend: "up",
      priority: "high"
    },
    {
      id: 2,
      name: "Distributor B",
      location: "Delhi",
      currentDemand: 300,
      forecastedDemand: 450,
      trend: "up",
      priority: "medium"
    },
    {
      id: 3,
      name: "Distributor C",
      location: "Bangalore",
      currentDemand: 400,
      forecastedDemand: 350,
      trend: "down",
      priority: "medium"
    },
    {
      id: 4,
      name: "Distributor D",
      location: "Chennai",
      currentDemand: 200,
      forecastedDemand: 300,
      trend: "up",
      priority: "low"
    }
  ];

  // Format data for the chart
  const chartData = distributorDemands.map(d => ({
    name: d.name,
    current: d.currentDemand,
    forecasted: d.forecastedDemand
  }));

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Distributor Demand Forecast</h2>
      {loading ? (
        <div className="text-center py-4">Loading forecast data...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">{error}</div>
      ) : (
        <div className="space-y-6">
          {/* Chart Section */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-md font-medium mb-4">Demand Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" name="Current Demand" fill="#EAB308" />
                  <Bar dataKey="forecasted" name="Forecasted Demand" fill="#22C55E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distributor Cards */}
          <div className="space-y-4">
            {distributorDemands.map((distributor) => (
              <div key={distributor.id} className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{distributor.name}</h3>
                    <p className="text-sm text-gray-500">{distributor.location}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(distributor.priority)}`}>
                    {distributor.priority} priority
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Demand</p>
                    <p className="text-lg font-semibold">{distributor.currentDemand} L</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Forecasted Demand</p>
                    <p className={`text-lg font-semibold ${getTrendColor(distributor.trend)}`}>
                      {distributor.forecastedDemand} L
                      <span className="ml-1">
                        {distributor.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-gray-500">
                    Required Production: {Math.max(distributor.currentDemand, distributor.forecastedDemand)} L
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              Total Required Production: {
                distributorDemands.reduce((sum, d) => 
                  sum + Math.max(d.currentDemand, d.forecastedDemand), 0
                )
              } L
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandForecast; 