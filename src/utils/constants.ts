import dotenv from 'dotenv';

dotenv.config();

export const DEFAULT_PORT = process.env.DEFAULT_PORT || 3000;
export const DEFAULT_BASE_PATH = process.env.DEFAULT_BASE_PATH || 'http://localhost';
export const DEFAULT_MONGO_DB_PATH = process.env.DEFAULT_MONGO_DB_PATH || 'mongodb://localhost:27017';
export const DEFAULT_MONGO_DB_NAME = process.env.DEFAULT_MONGO_DB_NAME || 'mestodb';
