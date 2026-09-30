import { jwt } from 'hono/jwt';

export const adminGuard = async (c, next) => {
    // Environment-aware secret mapping
    const secret = (c.env && c.env.JWT_SECRET) ? c.env.JWT_SECRET : 'cmyk_termux_dev_secret_secure_key';
    
    const jwtMiddleware = jwt({
        secret: secret,
        alg: 'HS256' // <-- Explicit cryptographic algorithm mandated by Hono
    });
    
    return jwtMiddleware(c, next);
};
