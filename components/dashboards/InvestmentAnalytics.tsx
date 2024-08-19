import React from 'react';

interface Analytics {
  totalValue: number;
  averageSize: number;
  successRate: number;
  roi: number;
}

interface InvestmentAnalyticsProps {
  analytics: Analytics;
}

const InvestmentAnalytics: React.FC<InvestmentAnalyticsProps> = ({ analytics }) => (
  <div className="w-full max-w-3xl mx-auto mb-8">
    <h2 className="text-2xl font-semibold mb-4">Investment Analytics:</h2>
    <div className="p-4 border rounded-lg shadow-md">
      <p><strong>Total Investment Value:</strong> {analytics.totalValue}</p>
      <p><strong>Average Investment Size:</strong> {analytics.averageSize}</p>
      <p><strong>Investment Success Rate:</strong> {analytics.successRate}%</p>
      <p><strong>Return on Investment (ROI):</strong> {analytics.roi}%</p>
    </div>
  </div>
);

export default InvestmentAnalytics;
