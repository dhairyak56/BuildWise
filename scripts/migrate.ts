import { Client } from 'pg'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase', 'migrations')

async function migrate() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not defined in .env.local')
        console.error('Please add your Supabase connection string to .env.local')
        console.error('Example: DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"')
        process.exit(1)
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })

    try {
        await client.connect()
        console.log('✅ Connected to database')

        // Create migrations table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS _migrations (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `)

        // Get applied migrations
        const { rows: appliedMigrations } = await client.query('SELECT name FROM _migrations')
        const appliedMigrationNames = new Set(appliedMigrations.map(row => row.name))

        // Get all migration files
        const files = fs.readdirSync(MIGRATIONS_DIR)
            .filter(file => file.endsWith('.sql'))
            .sort() // Ensure chronological order

        // Run pending migrations
        for (const file of files) {
            if (!appliedMigrationNames.has(file)) {
                console.log(`🚀 Applying migration: ${file}`)
                const filePath = path.join(MIGRATIONS_DIR, file)
                const sql = fs.readFileSync(filePath, 'utf8')

                try {
                    await client.query('BEGIN')
                    await client.query(sql)
                    await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file])
                    await client.query('COMMIT')
                    console.log(`✅ Applied: ${file}`)
                } catch (err) {
                    await client.query('ROLLBACK')
                    console.error(`❌ Failed to apply ${file}:`, err)
                    process.exit(1)
                }
            }
        }

        console.log('✨ All migrations applied successfully!')
    } catch (err) {
        console.error('❌ Migration failed:', err)
        process.exit(1)
    } finally {
        await client.end()
    }
}

migrate()
