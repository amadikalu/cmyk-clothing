import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [status, setStatus] = useState({ loading: false, error: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '' });
        
        const response = await apiClient('/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        // Handle network/CORS error trapped by our new apiClient
        if (response.error) {
            return setStatus({ loading: false, error: response.error });
        }

        // Handle successful auth
        if (response.status === 200 && response.data.success) {
            localStorage.setItem('cmyk_token', response.data.token);
            navigate('/dashboard');
        } else {
            setStatus({ loading: false, error: response.data.error || 'Invalid credentials' });
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', fontFamily: 'system-ui' }}>
            <h2>CMYK Master Control</h2>
            {status.error && (
                <div style={{ padding: '10px', background: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px' }}>
                    {status.error}
                </div>
            )}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    disabled={status.loading}
                    onChange={e => setCredentials({...credentials, username: e.target.value})}
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    disabled={status.loading}
                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                    style={{ padding: '10px' }}
                />
                <button 
                    type="submit" 
                    disabled={status.loading}
                    style={{ 
                        padding: '12px', 
                        background: status.loading ? '#666' : '#000', 
                        color: '#fff',
                        cursor: status.loading ? 'not-allowed' : 'pointer',
                        border: 'none'
                    }}
                >
                    {status.loading ? 'Authenticating...' : 'Access Terminal'}
                </button>
            </form>
        </div>
    );
}
