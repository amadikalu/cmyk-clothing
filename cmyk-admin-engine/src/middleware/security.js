/**
 * Security Middleware: Restricts incoming body size to prevent memory inflation attacks
 */
export const payloadGuard = (maxSizeBytes = 100 * 1024) => {
    return async (c, next) => {
        const contentLength = c.req.header('content-length');
        if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
            return c.json({
                success: false,
                error: 'Payload Too Large. Maximum allowed size is 100KB.'
            }, 413);
        }
        await next();
    };
};
