import { neon } from "@neondatabase/serverless"

// Ensure NEON_DATABASE_URL is present. This log will appear in your Vercel function logs.
if (!process.env.DATABASE_URL) {
  console.error("CRITICAL ERROR: DATABASE_URL environment variable is not set. Database connection will fail.")
}

const sql = neon(process.env.DATABASE_URL!)

export { sql }
