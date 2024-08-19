import React from 'react';

interface Alert {
  id: number;
  opportunity: string;
  deadline: string;
}

interface Opportunity {
  id: number;
  title: string;
  description: string;
}

interface NotificationsAndAlertsProps {
  alerts?: {
    upcomingDeadlines: Alert[];
    newOpportunities: Opportunity[];
  };
}

const NotificationsAndAlerts: React.FC<NotificationsAndAlertsProps> = ({ alerts = { upcomingDeadlines: [], newOpportunities: [] } }) => (
  <div className="w-full max-w-3xl mx-auto mb-8">
    <h2 className="text-2xl font-semibold mb-4">Notifications & Alerts:</h2>
    <div className="space-y-4">
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Upcoming Deadlines:</h3>
        <ul className="list-disc pl-5">
          {alerts.upcomingDeadlines.length > 0 ? (
            alerts.upcomingDeadlines.map(alert => (
              <li key={alert.id}>
                <p><strong>Opportunity:</strong> {alert.opportunity}</p>
                <p><strong>Deadline:</strong> {new Date(alert.deadline).toLocaleDateString()}</p>
              </li>
            ))
          ) : (
            <li>No upcoming deadlines.</li>
          )}
        </ul>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">New Opportunities:</h3>
        <ul className="list-disc pl-5">
          {alerts.newOpportunities.length > 0 ? (
            alerts.newOpportunities.map(opportunity => (
              <li key={opportunity.id}>
                <p><strong>Title:</strong> {opportunity.title}</p>
                <p><strong>Description:</strong> {opportunity.description}</p>
              </li>
            ))
          ) : (
            <li>No new opportunities.</li>
          )}
        </ul>
      </div>
    </div>
  </div>
);

export default NotificationsAndAlerts;
