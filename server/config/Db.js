
import 'dotenv/config';        
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error("Connection string missing");
}

const sql = neon(process.env.DATABASE_URL);  

export default sql;
