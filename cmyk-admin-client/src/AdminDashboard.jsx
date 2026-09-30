import React, { useState, useEffect, useRef } from 'react';
import { api } from './lib/api'; // Your Axios instance
import { getAuthContext } from './utils/auth';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [userRole, setUserRole] = useState('loading'); 
  const [activeView, setActiveView] = useState('registry');
  const [isUploading, setIsUploading] = useState(false);
  
  // Refs to hide the ugly native file inputs
  const inventoryFileRef = useRef(null);
  const heroFileRef = useRef(null);

  useEffect(() => {
    // Decode JWT on mount to set the actual role
    const auth = getAuthContext();
    if (auth.role === 'guest') {
      window.location.href = '/login'; // Boot unauthorized users
    } else {
      setUserRole(auth.role);
    }
  }, []);

  // Universal handler for multipart/form-data uploads
  const handleFileUpload = async (event, endpoint) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Axios automatically sets the boundary for multipart/form-data when passing FormData
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(`Upload successful! URL: ${response.data.url}`);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Check console.');
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  if (userRole === 'loading') return <div className="crm-container" style={{ padding: '2rem' }}>Authenticating...</div>;

  return (
    <div className="crm-container">
      {/* Decoupled Sidebar */}
      <aside className="crm-sidebar">
        <div className="crm-brand">
          CMYK CORE
          <span className={`role-badge ${userRole === 'master_admin' ? 'master' : ''}`}>
            {userRole === 'master_admin' ? 'Master' : 'Operator'}
          </span>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Operations</div>
          <button className={`nav-btn ${activeView === 'registry' ? 'active' : ''}`} onClick={() => setActiveView('registry')}>
            📈 Real-Time Registry
          </button>
          <button className={`nav-btn ${activeView === 'inventory' ? 'active' : ''}`} onClick={() => setActiveView('inventory')}>
            📦 Inventory Tracking
          </button>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Storefront</div>
          <button className={`nav-btn ${activeView === 'content' ? 'active' : ''}`} onClick={() => setActiveView('content')}>
            🖼️ Hero Content Mgt
          </button>
        </div>

        {/* Granular Provisioning - Only rendered for Master Admin */}
        {userRole === 'master_admin' && (
          <div className="nav-section">
            <div className="nav-section-title">System</div>
            <button className={`nav-btn ${activeView === 'provisioning' ? 'active' : ''}`} onClick={() => setActiveView('provisioning')}>
              🔐 Access Provisioning
            </button>
          </div>
        )}
      </aside>

      {/* Dynamic Main Context */}
      <main className="crm-main">
        <header className="crm-header">
          <h1>
            {activeView === 'registry' && 'Sales Registry & Performance'}
            {activeView === 'inventory' && 'Inventory & Product Updates'}
            {activeView === 'content' && 'Storefront Content'}
            {activeView === 'provisioning' && 'Operator Management'}
          </h1>
        </header>

        {activeView === 'inventory' && (
          <div className="grid-2">
             <div className="panel" style={{ gridColumn: 'span 2' }}>
                <h3>Update Product Database</h3>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '250px' }}>
                    <input type="text" placeholder="Product Name" className="form-input" style={{ marginBottom: '1rem' }} />
                    <input type="number" placeholder="Stock Level" className="form-input" />
                  </div>
                  <div style={{ flex: '1', minWidth: '250px' }}>
                    {/* Hidden native input */}
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp"
                      style={{ display: 'none' }} 
                      ref={inventoryFileRef}
                      onChange={(e) => handleFileUpload(e, '/admin/inventory/upload')} 
                    />
                    {/* Styled proxy button */}
                    <button 
                      className="btn-upload" 
                      onClick={() => inventoryFileRef.current.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? '⏳ Uploading...' : '📸 Click to upload product image'}
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeView === 'content' && (
          <div className="panel">
            <h3>Hero Banner Configuration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Update the public storefront's primary hero imagery and call-to-action text.</p>
            
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/webp"
              style={{ display: 'none' }} 
              ref={heroFileRef}
              onChange={(e) => handleFileUpload(e, '/admin/storefront/hero-upload')} 
            />
            <button 
              className="btn-upload" 
              style={{ marginBottom: '1rem' }}
              onClick={() => heroFileRef.current.click()}
              disabled={isUploading}
            >
               {isUploading ? '⏳ Uploading...' : '📤 Upload High-Res Banner (1920x1080)'}
            </button>
            
            <input type="text" placeholder="Hero Headline" className="form-input" style={{ marginBottom: '1rem' }} />
            <button className="btn-primary">Push to Storefront</button>
          </div>
        )}

        {/* ... (Registry and Provisioning views remain identical to previous phase) ... */}
      </main>
    </div>
  );
}
