const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET wajib diatur di production.');
    }
    return secret || 'cuanku-development-secret-change-me';
};

const requireAuth = (req, res, next) => {
    const authorization = req.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Autentikasi diperlukan' });
    }

    try {
        req.user = jwt.verify(token, getJwtSecret());
        return next();
    } catch {
        return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
    }
};

module.exports = { getJwtSecret, requireAuth };
