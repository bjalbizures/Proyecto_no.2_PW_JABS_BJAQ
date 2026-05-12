import crypto from 'crypto';

import { pool } from '../config/db.js';

const BASE_COST = 35;
const COST_PER_KG = 12;

function normalizeShipment(row) {
  return {
    id: row.id,
    trackingCode: row.tracking_code,
    destination: row.destination,
    destinationRegion: row.destination_region,
    createdAt: row.created_at,
    status: row.status,
    weight: row.weight === null ? null : Number(row.weight),
    estimatedCost: row.estimated_cost === null ? null : Number(row.estimated_cost),
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

function validateShipmentBody(body) {
  if (!String(body.destination || '').trim()) {
    return 'El destino es requerido';
  }

  if (body.weight !== undefined && body.weight !== null) {
    const weight = Number(body.weight);

    if (!Number.isFinite(weight) || weight <= 0) {
      return 'El peso debe ser mayor a 0';
    }
  }

  return null;
}

export async function listMyShipments(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, tracking_code, destination, destination_region, created_at, status, weight, estimated_cost
       FROM shipments
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id],
    );

    return res.json({
      shipments: rows.map(normalizeShipment),
    });
  } catch (error) {
    return next(error);
  }
}

export async function createShipment(req, res, next) {
  try {
    const validationError = validateShipmentBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const destination = req.body.destination.trim();
    const destinationRegion = String(req.body.destinationRegion || '').trim() || null;
    const weight = req.body.weight === undefined || req.body.weight === null
      ? null
      : Number(req.body.weight);
    const estimatedCost = calculateEstimatedCost(weight);
    const trackingCode = generateTrackingCode();

    const [result] = await pool.execute(
      `INSERT INTO shipments
        (user_id, tracking_code, destination, destination_region, status, weight, price, estimated_cost)
       VALUES (?, ?, ?, ?, 'created', ?, ?, ?)`,
      [req.user.id, trackingCode, destination, destinationRegion, weight, estimatedCost, estimatedCost],
    );

    const [rows] = await pool.execute(
      `SELECT id, tracking_code, destination, destination_region, created_at, status, weight, estimated_cost
       FROM shipments
       WHERE id = ?
       LIMIT 1`,
      [result.insertId],
    );

    return res.status(201).json({
      shipment: normalizeShipment(rows[0]),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return createShipment(req, res, next);
    }

    return next(error);
  }
}

export async function getMyShipment(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, tracking_code, destination, destination_region, created_at, status, weight, estimated_cost
       FROM shipments
       WHERE tracking_code = ? AND user_id = ?
       LIMIT 1`,
      [req.params.trackingCode, req.user.id],
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Envio no encontrado' });
    }

    return res.json({
      shipment: normalizeShipment(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
}
