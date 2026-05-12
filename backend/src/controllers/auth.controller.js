import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { pool } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aeropaq-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

function buildToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
  };
}

function validateRegisterBody(body) {
  const requiredFields = ['fullName', 'email', 'phone', 'address', 'password'];
  const missingFields = requiredFields.filter((field) => !String(body[field] || '').trim());

  if (missingFields.length > 0) {
    return `Campos requeridos: ${missingFields.join(', ')}`;
  }

  if (!body.email.includes('@')) {
    return 'El correo electronico no es valido';
  }

  if (body.password.length < 8) {
    return 'La contrasena debe tener al menos 8 caracteres';
  }

  return null;
}

export async function register(req, res, next) {
  try {
    const validationError = validateRegisterBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const fullName = req.body.fullName.trim();
    const email = req.body.email.trim().toLowerCase();
    const phone = req.body.phone.trim();
    const address = req.body.address.trim();
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (full_name, email, phone, address, password_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, phone, address, passwordHash],
    );

    const user = {
      id: result.insertId,
      full_name: fullName,
      email,
      phone,
      address,
      role: 'customer',
    };

    return res.status(201).json({
      user: sanitizeUser(user),
      token: buildToken(user),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Ya existe un usuario registrado con este correo',
      });
    }

    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({
        message: 'Correo electronico y contrasena son requeridos',
      });
    }

    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, address, password_hash, role
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email],
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    return res.json({
      user: sanitizeUser(user),
      token: buildToken(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, address, role
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.user.id],
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({
      user: sanitizeUser(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
}
