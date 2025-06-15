const securityMiddleware = (req, res, next) => {
    // Set CSP header with more permissive settings
    const cspHeader = [
        "default-src 'self' https: http:",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes' https: http:",
        "script-src-attr 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https: http:",
        "img-src 'self' data: https: http: blob: *",
        "connect-src 'self' https: http:",
        "font-src 'self' https: http: data:",
        "object-src 'none'",
        "media-src 'self' https: http:",
        "frame-src 'self' https: http:",
        "worker-src 'self' blob:",
        "child-src 'self' blob:",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; ');

    res.setHeader('Content-Security-Policy', cspHeader);

    // Set other security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    next();
};

module.exports = securityMiddleware; 