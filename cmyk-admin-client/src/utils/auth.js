/**
 * Safely decodes a JWT payload without an external library.
 * Useful for extracting the role and email on the client side.
 */
export const getAuthContext = () => {
  const token = localStorage.getItem('cmyk_jwt');
  if (!token) return { role: 'guest', user: null };

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    // Assumes your Hono backend signs the token with { role: 'master_admin', email: '...' }
    return { role: payload.role || 'operator', user: payload.email };
  } catch (error) {
    console.error('Invalid token format');
    return { role: 'guest', user: null };
  }
};
