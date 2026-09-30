import React, { useState, useEffect } from 'react';
import { api } from './lib/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      // No headers needed here! api.js handles the JWT injection natively.
      const response = await api.get('/admin/dashboard');
      setMetrics(response.data.data);
    } catch (err) {
      setError('Failed to fetch secure data. Token may be expired.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>CMYK Production Dashboard</h2>
      
      <button 
        onClick={fetchDashboardData}
        style={{ padding: '10px 20px', background: '#000', color: '#fff' }}
      >
        Fetch Secure Data
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      
      {metrics && (
        <div style={{ marginTop: '2rem', background: '#f5f5f5', padding: '1rem' }}>
          <p><strong>Admin:</strong> {metrics.user}</p>
          <p><strong>Active Orders:</strong> {metrics.activeOrders}</p>
          <p><strong>Pending Prints:</strong> {metrics.pendingPrints}</p>
          <p><strong>Today's Revenue:</strong> ₦{metrics.revenueToday.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
