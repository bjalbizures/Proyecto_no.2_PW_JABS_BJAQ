import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aeropaq-dev-secret';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token de autenticacion requerido' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Token invalido o expirado' });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'No tienes permisos para esta accion' });
    }

    return next();
  };
}
