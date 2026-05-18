import { pool } from '../config/db.js';

function validateContactBody(body) {
  const fullName = String(body.fullName || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim();

  if (fullName.length < 2) {
    return 'Ingresa tu nombre completo';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Ingresa un correo electronico valido';
  }

  if (!/^[\d+\s()-]{8,20}$/.test(phone)) {
    return 'Ingresa un telefono valido';
  }

  if (message.length < 10) {
    return 'El mensaje debe tener al menos 10 caracteres';
  }

  return null;
}

export async function createContactMessage(req, res, next) {
  try {
    const validationError = validateContactBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const fullName = req.body.fullName.trim();
    const email = req.body.email.trim().toLowerCase();
    const phone = req.body.phone.trim();
    const message = req.body.message.trim();

    const [result] = await pool.execute(
      `INSERT INTO contact_messages (full_name, email, phone, message)
       VALUES (?, ?, ?, ?)`,
      [fullName, email, phone, message],
    );

    return res.status(201).json({
      contactMessage: {
        id: result.insertId,
        fullName,
        email,
        phone,
        message,
        status: 'new',
      },
    });
  } catch (error) {
    return next(error);
  }
}
