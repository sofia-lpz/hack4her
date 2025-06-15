import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool optimized for Supabase Transaction Pooler
const pool = new Pool({
  // Use port 6543 for transaction pooler instead of 5432 for direct connection
  connectionString: process.env.DATABASE_URL,
  // Optimized pool configuration for transaction pooler
  max: 10, // Reduced from 20 - transaction pooler handles connection multiplexing
  min: 1,  // Keep minimum connections
  idleTimeoutMillis: 60000, // Increased to 60 seconds for better connection reuse
  connectionTimeoutMillis: 5000, // Increased timeout for pooler latency
  acquireTimeoutMillis: 10000, // Timeout for acquiring connection from pool
  
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  },
  
  // Additional options for better performance with transaction pooler
  allowExitOnIdle: true, // Allow pool to close when idle
  statement_timeout: 30000, // 30 second statement timeout
  query_timeout: 30000, // 30 second query timeout
});

// Pool event listeners for monitoring
pool.on('connect', (client) => {
  console.log('New client connected to transaction pooler');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

async function getUsers(filter = {}) {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM users';
    let params = [];
    let paramIndex = 1;
    
    // Add WHERE clauses if filters are provided
    const whereConditions = [];
    
    if (filter.id) {
      whereConditions.push(`id = $${paramIndex++}`);
      params.push(filter.id);
    }
    
    if (filter.username) {
      whereConditions.push(`username ILIKE $${paramIndex++}`);
      params.push(`%${filter.username}%`);
    }
    
    if (filter.email) {
      whereConditions.push(`email = $${paramIndex++}`);
      params.push(filter.email);
    }
    
    if (filter.role) {
      whereConditions.push(`role = $${paramIndex++}`);
      params.push(filter.role);
    }
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    const result = await client.query(query, params);

    console.log(`${result.rows.length} users returned`);
    return result.rows;
  }
  catch (error) {
    console.error('Error in getUsers:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

async function getStores(filter = {}) {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM stores';
    let params = [];
    let paramIndex = 1;
    
    // Add WHERE clauses if filters are provided
    const whereConditions = [];
    
    if (filter.id) {
      whereConditions.push(`id = $${paramIndex++}`);
      params.push(filter.id);
    }
    
    if (filter.nombre) {
      whereConditions.push(`nombre ILIKE $${paramIndex++}`);
      params.push(`%${filter.nombre}%`);
    }
    
    // For numeric comparisons
    if (filter.nps_min) {
      whereConditions.push(`nps >= $${paramIndex++}`);
      params.push(filter.nps_min);
    }
    
    if (filter.nps_max) {
      whereConditions.push(`nps <= $${paramIndex++}`);
      params.push(filter.nps_max);
    }
    
    // Location-based filtering using PostgreSQL's built-in functions
    if (filter.latitude && filter.longitude && filter.radius) {
      // Using Haversine formula calculation optimized for transaction pooler
      whereConditions.push(`
        (6371 * acos(
          cos(radians($${paramIndex++})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians($${paramIndex++})) + 
          sin(radians($${paramIndex++})) * 
          sin(radians(latitude))
        )) <= $${paramIndex++}`);
      params.push(filter.latitude, filter.longitude, filter.latitude, filter.radius);
    }
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    const result = await client.query(query, params);

    console.log(`${result.rows.length} stores returned`);
    return result.rows;
  }
  catch (error) {
    console.error('Error in getStores:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

async function getFeedback(filter = {}) {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM feedback';
    let params = [];
    let paramIndex = 1;
    
    // Add WHERE clauses if filters are provided
    const whereConditions = [];
    
    if (filter.id) {
      whereConditions.push(`id = $${paramIndex++}`);
      params.push(filter.id);
    }
    
    if (filter.user_id) {
      whereConditions.push(`user_id = $${paramIndex++}`);
      params.push(filter.user_id);
    }
    
    if (filter.store_id) {
      whereConditions.push(`store_id = $${paramIndex++}`);
      params.push(filter.store_id);
    }
    
    if (filter.created_after) {
      whereConditions.push(`created_at >= $${paramIndex++}`);
      params.push(filter.created_after);
    }
    
    if (filter.created_before) {
      whereConditions.push(`created_at <= $${paramIndex++}`);
      params.push(filter.created_before);
    }
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Add ORDER BY if needed - validate sort parameters for security
    if (filter.sort_by) {
      const allowedSortFields = ['id', 'created_at', 'updated_at', 'user_id', 'store_id'];
      const allowedDirections = ['ASC', 'DESC'];
      
      if (allowedSortFields.includes(filter.sort_by) && 
          allowedDirections.includes((filter.sort_direction || 'ASC').toUpperCase())) {
        query += ` ORDER BY ${filter.sort_by} ${filter.sort_direction || 'ASC'}`;
      } else {
        query += ' ORDER BY created_at DESC';
      }
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const result = await client.query(query, params);

    console.log(`${result.rows.length} feedback entries returned`);
    return result.rows;
  }
  catch (error) {
    console.error('Error in getFeedback:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

async function getCitas(filter = {}) {
  const client = await pool.connect();
  try {
    // Modified query to include JOIN with users table through citas_to_users
    let query = `
      SELECT c.*, 
             u.id AS user_id, 
             u.username, 
             u.first_name, 
             u.last_name, 
             u.email, 
             u.role
      FROM citas c
      LEFT JOIN citas_to_users cu ON c.id = cu.cita_id
      LEFT JOIN users u ON cu.user_id = u.id`;
    
    let params = [];
    let paramIndex = 1;
    
    // Add WHERE clauses if filters are provided
    const whereConditions = [];
    
    if (filter.id) {
      whereConditions.push(`c.id = $${paramIndex++}`);
      params.push(filter.id);
    }
    
    if (filter.store_id) {
      whereConditions.push(`c.store_id = $${paramIndex++}`);
      params.push(filter.store_id);
    }
    
    if (filter.date) {
      whereConditions.push(`c.date = $${paramIndex++}`);
      params.push(filter.date);
    }
    
    if (filter.confirmed !== undefined) {
      whereConditions.push(`c.confirmada = $${paramIndex++}`);
      params.push(filter.confirmed);
    }
    
    if (filter.cancelled !== undefined) {
      whereConditions.push(`c.cancelada = $${paramIndex++}`);
      params.push(filter.cancelled);
    }
    
    if (filter.date_from) {
      whereConditions.push(`c.date >= $${paramIndex++}`);
      params.push(filter.date_from);
    }
    
    if (filter.date_to) {
      whereConditions.push(`c.date <= $${paramIndex++}`);
      params.push(filter.date_to);
    }
    
    if (filter.user_id) {
      whereConditions.push(`u.id = $${paramIndex++}`);
      params.push(filter.user_id);
    }
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Add ORDER BY
    query += ' ORDER BY c.date, c.time';

    const result = await client.query(query, params);
    
    // Group the results by cita to handle multiple users per appointment
    const citasMap = new Map();
    
    for (const row of result.rows) {
      const citaId = row.id;
      
      if (!citasMap.has(citaId)) {
        // Initialize cita object with appointment data
        citasMap.set(citaId, {
          id: row.id,
          store_id: row.store_id,
          date: row.date,
          time: row.time,
          confirmada: row.confirmada,
          cancelada: row.cancelada,
          users: []
        });
      }
      
      // Add user to the cita if user data exists
      if (row.user_id) {
        citasMap.get(citaId).users.push({
          id: row.user_id,
          username: row.username,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          role: row.role
        });
      }
    }
    
    // Convert map to array
    const citas = Array.from(citasMap.values());

    console.log(`${citas.length} citas returned with user data`);
    return citas;
  }
  catch (error) {
    console.error('Error in getCitas:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

// Health check function to test connection
async function healthCheck() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW() as current_time');
    console.log('Database connection healthy:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  } finally {
    client.release();
  }
}

// Graceful shutdown with improved error handling
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database pool...');
  try {
    await pool.end();
    console.log('Database pool closed successfully');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database pool...');
  try {
    await pool.end();
    console.log('Database pool closed successfully');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
  process.exit(0);
});

export {
  getUsers,
  getStores,
  getFeedback,
  getCitas,
  healthCheck,
  pool // Export pool in case you need direct access
};