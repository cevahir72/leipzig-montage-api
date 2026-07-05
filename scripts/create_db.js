require('dotenv').config();
const { Client } = require('pg');

const c = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'postgres',
});

(async () => {
  await c.connect();
  await c.query('DROP DATABASE IF EXISTS "montage"');
  await c.query('CREATE DATABASE "montage"');
  console.log('OK');
  await c.end();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
