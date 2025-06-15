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
  
  allowExitOnIdle: true, // Allow pool to close when idle
  statement_timeout: 30000, // 30 second statement timeout
  query_timeout: 30000, // 30 second query timeout
});

pool.on('connect', (client) => {
  console.log('New client connected to transaction pooler');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

export async function getUsers(filter = {}) {
  const client = await pool.connect();
  try {
    let query = 'SELECT id, username, first_name, last_name, email, role FROM users';
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

export async function getStores(filter = {}) {
  const client = await pool.connect();
  try {
let query = 'SELECT id, nombre, nps, fillfoundrate, damage_rate, out_of_stock, complaint_resolution_time_hrs FROM stores';
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

export async function getFeedback(filter = {}) {
  const client = await pool.connect();
  try {
     let query = 'SELECT id, user_id, store_id, comment, created_at, image_path FROM feedback';
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

export async function getCitas(filter = {}) {
  const client = await pool.connect();
  try {
    // Modified query to include JOIN with users table through citas_to_users
    let query = `
      SELECT c.id, c.store_id, c.date, c.time, c.confirmada, c.cancelada, 
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

export async function postCitas(citaData) {
  const client = await pool.connect();
  try {
    const { store_id, date, time, confirmada, cancelada, user_ids } = citaData;
    // Validate required fields
    if (!store_id || !date || !time) {
      throw new Error('Store ID, date, and time are required');
    }
    // Insert new cita
    const insertQuery = `
      INSERT INTO citas (store_id, date, time, confirmada, cancelada)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`;
    const insertParams = [store_id, date, time, confirmada || false, cancelada || false];
    const result = await client.query(insertQuery, insertParams);
    const citaId = result.rows[0].id;
    console.log('Cita created successfully with ID:', citaId);
    // If user_ids are provided, insert into citas_to_users
    if (user_ids && user_ids.length > 0) {
      const userInsertQuery = `
        INSERT INTO citas_to_users (cita_id, user_id)
        VALUES ${user_ids.map((_, index) => `($1, $${index + 2})`).join(', ')}
        RETURNING *`;
      const userInsertParams = [citaId, ...user_ids];
      const userResult = await client.query(userInsertQuery, userInsertParams);
      console.log(`${userResult.rowCount} users linked to cita ID ${citaId}`);
    }
    return { id: citaId, store_id, date, time, confirmada, cancelada };
  }
  catch (error) {
    console.error('Error in postCitas:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

export async function login(username, password) {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const params = [username, password];

    const result = await client.query(query, params);

    if (result.rows.length === 0) {
      console.log('Login failed: Invalid username or password');
      return null; // No user found
    }

    // Log the successful login including role
    console.log('Login successful for user:', result.rows[0].username, 'with role:', result.rows[0].role);
    return result.rows[0]; // Return the user object (including role)
  }
  catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

export async function register(userData) {
  const client = await pool.connect();
  try {
    const { username, password, email, first_name, last_name, role } = userData;

    // Validate required fields
    if (!username || !password || !email) {
      throw new Error('Username, password, and email are required');
    }

    // Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    const checkParams = [username, email];
    const checkResult = await client.query(checkQuery, checkParams);

    if (checkResult.rows.length > 0) {
      throw new Error('User with this username or email already exists');
    }

    // Insert new user
    const insertQuery = `
      INSERT INTO users (username, password, email, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const insertParams = [username, password, email, first_name || '', last_name || '', role || 'user'];

    const result = await client.query(insertQuery, insertParams);

    console.log('User registered successfully:', result.rows[0]);
    return result.rows[0]; // Return the newly created user object
  }
  catch (error) {
    console.error('Error in register:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

export async function getLeastVisitedStores() {
  // get the data of the least visited stores in the last 30 days and times they were visited
  const client = await pool.connect();
  try {
    const query = `
      SELECT s.id, s.nombre, COUNT(c.id) AS visit_count
      FROM stores s
      LEFT JOIN citas c ON s.id = c.store_id 
        AND c.date >= NOW() - INTERVAL '30 days'
      GROUP BY s.id, s.nombre
      ORDER BY visit_count ASC
      LIMIT 5;`;
    const result = await client.query(query);
    console.log(`${result.rows.length} least visited stores returned`);
    return result.rows;
  }
  catch (error) {
    console.error('Error in getLeastVisitedStores:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

export async function getCitasCount() {
  // Get the total number of appointments in the last 30 day
  const client = await pool.connect();
  try {
    const query = `
      SELECT COUNT(*) AS total_citas
      FROM citas
      WHERE date >= NOW() - INTERVAL '30 days';`;
    const result = await client.query(query);
    console.log('Total number of citas in the last 30 days:', result.rows[0].total_citas);
    return result.rows[0].total_citas;
  }
  catch (error) {
    console.error('Error in getNumberOfCitas:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

export async function getWorstStores() {
  // Get the number of stores with NPS lower than 30
  const client = await pool.connect();
  try {
    const query = `
      SELECT COUNT(*) AS total_worst_stores
      FROM stores
      WHERE nps < 0;`;
    const result = await client.query(query);
    return result.rows[0].total_worst_stores;
  }
  catch (error) {
    console.error('Error in getWorstStores:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

export async function getBestStores() {
  // Get the number of stores with NPS higher than 70
  const client = await pool.connect();
  try {
    const query = `
      SELECT COUNT(*) AS total_best_stores
      FROM stores
      WHERE nps > 50;`;
    const result = await client.query(query);
    return result.rows[0].total_best_stores;
  }
  catch (error) {
    console.error('Error in getBestStores:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

export async function getAverageNPS() {
  // Get the average NPS of all stores
  const client = await pool.connect();
  try {
    const query = `
      SELECT AVG(nps) AS average_nps
      FROM stores;`;
    const result = await client.query(query);
    return result.rows[0].average_nps;
  }
  catch (error) {
    console.error('Error in getAverageNPS:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

export async function getAverageFillFoundRate() {
  // Get the average fill found rate of all stores
  const client = await pool.connect();
  try {
    const query = `
      SELECT AVG(fillfoundrate) AS average_fill_found_rate
      FROM stores;`;
    const result = await client.query(query);
    return result.rows[0].average_fill_found_rate;
  }
  catch (error) {
    console.error('Error in getAverageFillFoundRate:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

export async function getAverageDamageRate() {
  // Get the average damage rate of all stores
  const client = await pool.connect();
  try {
    const query = `
      SELECT AVG(damage_rate) AS average_damage_rate
      FROM stores;`;
    const result = await client.query(query);
    return result.rows[0].average_damage_rate;
  }
  catch (error) {
    console.error('Error in getAverageDamageRate:', error);
    throw error;
  }
  finally {
    client.release();
    console.log('Connection released successfully');
  }
}

// Health check function to test connection
export async function healthCheck() {
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
  pool // Export pool in case you need direct access
};