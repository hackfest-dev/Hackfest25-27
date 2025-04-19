import { useState } from 'react';

const staticReports = [
  {
    id: 'R001',
    name: 'Production Efficiency Report',
    date: '2024-03-19',
    type: 'Efficiency',
    content: {
      summary: 'Overall efficiency increased by 15% this month',
      metrics: [
        { label: 'Production Rate', value: '95%', change: '+5%' },
        { label: 'Quality Score', value: '98%', change: '+2%' },
        { label: 'Waste Reduction', value: '12%', change: '-3%' },
        { label: 'Machine Uptime', value: '97%', change: '+4%' }
      ],
      recommendations: [
        'Implement predictive maintenance for Machine #3',
        'Schedule additional operator training for new equipment',
        'Review quality control procedures for Product Line B'
      ]
    }
  },
  {
    id: 'R002',
    name: 'Quality Control Summary',
    date: '2024-03-19',
    type: 'Quality',
    content: {
      summary: 'Quality standards met across all product lines',
      metrics: [
        { label: 'Defect Rate', value: '0.5%', change: '-0.2%' },
        { label: 'Customer Returns', value: '0.3%', change: '-0.1%' },
        { label: 'First Pass Yield', value: '98%', change: '+1%' },
        { label: 'Inspection Coverage', value: '100%', change: '0%' }
      ],
      issues: [
        'Minor color variation in Batch #1234',
        'Packaging improvements needed for Product A',
        'Updated quality checks implemented for new materials'
      ]
    }
  },
  {
    id: 'R003',
    name: 'Inventory Status Report',
    date: '2024-03-19',
    type: 'Inventory',
    content: {
      summary: 'Current inventory levels optimal for Q2 projections',
      metrics: [
        { label: 'Raw Materials', value: '85%', change: '-5%' },
        { label: 'Work in Progress', value: '60%', change: '+10%' },
        { label: 'Finished Goods', value: '75%', change: '-2%' },
        { label: 'Storage Utilization', value: '82%', change: '+7%' }
      ],
      alerts: [
        'Reorder point reached for Material X',
        'Excess inventory of Component Y',
        'Storage area B nearing capacity'
      ]
    }
  }
];

const ReportViewer = ({ onClose }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  const renderMetrics = (metrics) => (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-600">{metric.label}</p>
          <div className="flex items-center mt-1">
            <span className="text-lg font-semibold">{metric.value}</span>
            <span className={`ml-2 text-sm ${
              metric.change.startsWith('+') ? 'text-green-600' : 
              metric.change.startsWith('-') ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {metric.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReportContent = (report) => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
          <p className="text-sm text-gray-500">Generated on {report.date}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">{report.content.summary}</p>
        </div>

        {renderMetrics(report.content.metrics)}

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">
            {report.type === 'Efficiency' ? 'Recommendations' :
             report.type === 'Quality' ? 'Quality Issues' :
             'Inventory Alerts'}
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {(report.content.recommendations || 
              report.content.issues || 
              report.content.alerts).map((item, index) => (
              <li key={index} className="text-sm text-gray-600">{item}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  };

  const renderReportsList = () => (
    <div className="space-y-4">
      {staticReports.map((report) => (
        <div
          key={report.id}
          className="p-4 bg-white rounded-lg border hover:shadow-md cursor-pointer transition-shadow"
          onClick={() => setSelectedReport(report)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
              <p className="text-xs text-gray-500">Generated on {report.date}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReport(report);
              }}
              className="px-3 py-1 text-xs text-yellow-600 border border-yellow-200 rounded hover:bg-yellow-50"
            >
              View Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {selectedReport ? renderReportContent(selectedReport) : renderReportsList()}
    </div>
  );
};

export default ReportViewer; 