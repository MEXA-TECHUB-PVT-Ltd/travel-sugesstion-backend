import pkg from 'pg';
import { databaseConfig } from './db.js';
const { Pool } = pkg;
const pool = new Pool(databaseConfig);
pool.on('connect', () => {
    console.log('Connected to the database');
  });
  pool.on('error', (err) => {
    console.error('Database connection error:', err);
  });
export default pool;
