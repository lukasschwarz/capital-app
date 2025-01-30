// @ts-nocheck
import express from 'express';
import { Pool } from 'pg';
import fetch from 'node-fetch';
import cors from 'cors';

const dbUser = require("os").userInfo().username;

const app = express();
app.use(cors());

const pool = new Pool({
  connectionString: `postgres://${dbUser}@localhost:5432/capitaldb`
});

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Etwas ist schiefgelaufen!' });
});

app.get('/capital', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM capitals ORDER BY id DESC;');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/capital/:name', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM capitals WHERE LOWER(name) = LOWER($1)', [req.params.name]);
    res.json(rows[0] || {});
  } catch (error) {
    next(error);
  }
});

app.post('/capital', async (req, res, next) => {
  try {
    const { name, latitude, longitude, country } = req.body;
    const { rows } = await pool.query('INSERT INTO capitals (name, latitude, longitude, country) VALUES ($1, $2, $3, $4) RETURNING *', [name, latitude, longitude, country]);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put('/capital/:id', async (req, res, next) => {
  try {
    const { name, latitude, longitude, country, color } = req.body;
    const { rows } = await pool.query('UPDATE capitals SET name=$1, latitude=$2, longitude=$3, country=$4, color=$5 WHERE id=$6 RETURNING *', [name, latitude, longitude, country, color, req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

app.patch('/capital/:id', async (req, res, next) => {
  try {
    const { color } = req.body;
    const { rows } = await pool.query('UPDATE capitals SET color=$1 WHERE id=$2 RETURNING *', [color, req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete('/capital/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM capitals WHERE id=$1', [req.params.id]);
    res.json(req.params.id);
  } catch (error) {
    next(error);
  }
});

app.listen(3000, async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM capitals');

    if (rows.length == 0) {
      const countries = await fetch('https://restcountries.com/v3.1/all')
          .then(res => res.json())

      await pool.query('DELETE FROM capitals');

      const capitals = countries.map(c =>
          c.capital && c.capital[0]
              ? [c.capital[0], c.capitalInfo?.latlng?.[0], c.capitalInfo?.latlng?.[1], c.name.common]
              : null
      ).filter(Boolean);

      await pool.query(
          'INSERT INTO capitals (name, latitude, longitude, country) VALUES ' +
          capitals.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(', ') +
          ' ON CONFLICT(name) DO NOTHING',
          capitals.flat()
      );
    } else console.log('setup already done');

    console.info('Server runs on port 3000');
  } catch (error) {
    console.error('Fehler beim Starten des Servers:', error);
  }
});
