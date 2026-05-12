import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { pool } from '../config/db.js';

const BASE_COST = 35;
const COST_PER_KG = 12;
const USER_ROLES = ['customer', 'admin'];
const SHIPMENT_STATUSES = [
  'created',
  'received',
  'in_transit',
  'ready_for_pickup',
  'delivered',
  'cancelled',
];

function normalizeUser(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeShipment(row) {
  return {
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    trackingCode: row.tracking_code,
    destination: row.destination,
    destinationRegion: row.destination_region,
    status: row.status,
    weight: row.weight === null ? null : Number(row.weight),
    estimatedCost: row.estimated_cost === null ? null : Number(row.estimated_cost),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function calculateEstimatedCost(weight) {
  const normalizedWeight = Number(weight || 0);
  const billableWeight = normalizedWeight > 0 ? normalizedWeight : 1;

  return Number((BASE_COST + billableWeight * COST_PER_KG).toFixed(2));
}

function generateTrackingCode() {
  const year = new Date().getFullYear();
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();

  return `AQP-${year}-${suffix}`;
}

function validateUserInput(body, { partial = false } = {}) {
  const requiredFields = ['fullName', 'email', 'phone', 'address'];

  if (!partial) {
    const missingFields = requiredFields.filter((field) => !String(body[field] || '').trim());

    if (missingFields.length > 0) {
      return `Campos requeridos: ${missingFields.join(', ')}`;
    }
  }

  if (body.email !== undefined && !String(body.email).includes('@')) {
    return 'El correo electronico no es valido';
  }

  if (body.role !== undefined && !USER_ROLES.includes(body.role)) {
    return 'El rol no es valido';
  }

  if (body.password !== undefined && body.password.length < 8) {
    return 'La contrasena debe tener al menos 8 caracteres';
  }

  return null;
}

function validateShipmentInput(body, { partial = false } = {}) {
  if (!partial && !body.userId) {
    return 'El usuario del envio es requerido';
  }

  if (!partial && !String(body.destination || '').trim()) {
    return 'El destino es requerido';
  }

  if (body.status !== undefined && !SHIPMENT_STATUSES.includes(body.status)) {
    return 'El estado no es valido';
  }

  if (body.weight !== undefined && body.weight !== null) {
    const weight = Number(body.weight);

    if (!Number.isFinite(weight) || weight <= 0) {
      return 'El peso debe ser mayor a 0';
    }
  }

  if (body.estimatedCost !== undefined && body.estimatedCost !== null) {
    const estimatedCost = Number(body.estimatedCost);

    if (!Number.isFinite(estimatedCost) || estimatedCost < 0) {
      return 'El costo estimado no es valido';
    }
  }

  return null;
}

export async function listUsers(_req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, address, role, created_at, updated_at
       FROM users
       ORDER BY created_at DESC`,
    );

    return res.json({ users: rows.map(normalizeUser) });
  } catch (error) {
    return next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const validationError = validateUserInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const fullName = req.body.fullName.trim();
    const email = req.body.email.trim().toLowerCase();
    const phone = req.body.phone.trim();
    const address = req.body.address.trim();
    const role = req.body.role || 'customer';
    const passwordHash = await bcrypt.hash(req.body.password || 'Aeropaq123!', 10);

    const [result] = await pool.execute(
      `INSERT INTO users (full_name, email, phone, address, password_hash, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fullName, email, phone, address, passwordHash, role],
    );

    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, address, role, created_at, updated_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [result.insertId],
    );

    return res.status(201).json({ user: normalizeUser(rows[0]) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un usuario con este correo' });
    }

    return next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, address, role, created_at, updated_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.params.id],
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({ user: normalizeUser(rows[0]) });
  } catch (error) {
    return next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const validationError = validateUserInput(req.body, { partial: true });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updates = [];
    const values = [];

    if (req.body.fullName !== undefined) {
      updates.push('full_name = ?');
      values.push(req.body.fullName.trim());
    }

    if (req.body.email !== undefined) {
      updates.push('email = ?');
      values.push(req.body.email.trim().toLowerCase());
    }

    if (req.body.phone !== undefined) {
      updates.push('phone = ?');
      values.push(req.body.phone.trim());
    }

    if (req.body.address !== undefined) {
      updates.push('address = ?');
      values.push(req.body.address.trim());
    }

    if (req.body.role !== undefined) {
      updates.push('role = ?');
      values.push(req.body.role);
    }

    if (req.body.password !== undefined) {
      updates.push('password_hash = ?');
      values.push(await bcrypt.hash(req.body.password, 10));
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    values.push(req.params.id);

    const [result] = await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return getUser(req, res, next);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un usuario con este correo' });
    }

    return next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    if (Number(req.params.id) === Number(req.user.id)) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });
    }

    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function listShipments(_req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT s.id, s.user_id, u.full_name AS customer_name, u.email AS customer_email,
              s.tracking_code, s.destination, s.destination_region, s.status,
              s.weight, s.estimated_cost, s.created_at, s.updated_at
       FROM shipments s
       INNER JOIN users u ON u.id = s.user_id
       ORDER BY s.created_at DESC`,
    );

    return res.json({ shipments: rows.map(normalizeShipment) });
  } catch (error) {
    return next(error);
  }
}

export async function createShipment(req, res, next) {
  try {
    const validationError = validateShipmentInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const [userRows] = await pool.execute(
      'SELECT id FROM users WHERE id = ? LIMIT 1',
      [req.body.userId],
    );

    if (!userRows[0]) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const destination = req.body.destination.trim();
    const destinationRegion = String(req.body.destinationRegion || '').trim() || null;
    const weight = req.body.weight === undefined || req.body.weight === null
      ? null
      : Number(req.body.weight);
    const estimatedCost = req.body.estimatedCost === undefined || req.body.estimatedCost === null
      ? calculateEstimatedCost(weight)
      : Number(req.body.estimatedCost);
    const status = req.body.status || 'created';
    const trackingCode = generateTrackingCode();

    const [result] = await pool.execute(
      `INSERT INTO shipments
        (user_id, tracking_code, destination, destination_region, status, weight, price, estimated_cost)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.userId,
        trackingCode,
        destination,
        destinationRegion,
        status,
        weight,
        estimatedCost,
        estimatedCost,
      ],
    );

    await pool.execute(
      `INSERT INTO shipment_events (shipment_id, status, description, location)
       VALUES (?, ?, ?, ?)`,
      [
        result.insertId,
        status,
        req.body.eventDescription || 'Envio creado por administrador',
        req.body.eventLocation || destinationRegion || destination,
      ],
    );

    req.params.id = result.insertId;

    return getShipment(req, res, next);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return createShipment(req, res, next);
    }

    return next(error);
  }
}

export async function getShipment(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT s.id, s.user_id, u.full_name AS customer_name, u.email AS customer_email,
              s.tracking_code, s.destination, s.destination_region, s.status,
              s.weight, s.estimated_cost, s.created_at, s.updated_at
       FROM shipments s
       INNER JOIN users u ON u.id = s.user_id
       WHERE s.id = ?
       LIMIT 1`,
      [req.params.id],
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Envio no encontrado' });
    }

    return res.json({ shipment: normalizeShipment(rows[0]) });
  } catch (error) {
    return next(error);
  }
}

export async function updateShipment(req, res, next) {
  try {
    const validationError = validateShipmentInput(req.body, { partial: true });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const [currentRows] = await pool.execute(
      'SELECT id, status FROM shipments WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    if (!currentRows[0]) {
      return res.status(404).json({ message: 'Envio no encontrado' });
    }

    const updates = [];
    const values = [];

    if (req.body.destination !== undefined) {
      updates.push('destination = ?');
      values.push(req.body.destination.trim());
    }

    if (req.body.destinationRegion !== undefined) {
      updates.push('destination_region = ?');
      values.push(String(req.body.destinationRegion || '').trim() || null);
    }

    if (req.body.status !== undefined) {
      updates.push('status = ?');
      values.push(req.body.status);
    }

    if (req.body.weight !== undefined) {
      updates.push('weight = ?');
      values.push(req.body.weight === null ? null : Number(req.body.weight));
    }

    if (req.body.estimatedCost !== undefined) {
      updates.push('estimated_cost = ?, price = ?');
      const estimatedCost = req.body.estimatedCost === null ? null : Number(req.body.estimatedCost);
      values.push(estimatedCost, estimatedCost);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    values.push(req.params.id);

    await pool.execute(`UPDATE shipments SET ${updates.join(', ')} WHERE id = ?`, values);

    if (req.body.status !== undefined && req.body.status !== currentRows[0].status) {
      await pool.execute(
        `INSERT INTO shipment_events (shipment_id, status, description, location)
         VALUES (?, ?, ?, ?)`,
        [
          req.params.id,
          req.body.status,
          req.body.eventDescription || `Estado actualizado a ${req.body.status}`,
          req.body.eventLocation || null,
        ],
      );
    }

    return getShipment(req, res, next);
  } catch (error) {
    return next(error);
  }
}

export async function deleteShipment(req, res, next) {
  try {
    const [result] = await pool.execute('DELETE FROM shipments WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Envio no encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
