import mysql from "mysql2/promise"

async function connectToDB() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  });
}

async function getUsers(filter = {}) {
  let connection = null;
  try {
    connection = await connectToDB()
    
    let query = 'SELECT * FROM users';
    let params = [];
    
    // Add WHERE clauses if filters are provided
    const whereConditions = [];
    
    if (filter.id) {
      whereConditions.push('id = ?');
      params.push(filter.id);
    }
    
    if (filter.username) {
      whereConditions.push('username LIKE ?');
      params.push(`%${filter.username}%`);
    }
    
    if (filter.email) {
      whereConditions.push('email = ?');
      params.push(filter.email);
    }
    
    if (filter.role) {
      whereConditions.push('role = ?');
      params.push(filter.role);
    }
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    const [results, _] = await connection.query(query, params);

    console.log(`${results.length} users returned`);
    return results;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
  finally {
    if (connection !== null) {
      connection.end();
      console.log('Connection closed successfully');
    }
  }
}

async function getStores(filter = {}) {
  let connection = null;
  try {
    connection = await connectToDB();
    
    let query = 'SELECT * FROM stores';
    let params = [];
    
    // Add WHERE clauses if filters are provided
    const whereConditions = [];
    
    if (filter.id) {
      whereConditions.push('id = ?');
      params.push(filter.id);
    }
    
    if (filter.nombre) {
      whereConditions.push('nombre LIKE ?');
      params.push(`%${filter.nombre}%`);
    }
    
    // For numeric comparisons
    if (filter.nps_min) {
      whereConditions.push('nps >= ?');
      params.push(filter.nps_min);
    }
    
    if (filter.nps_max) {
      whereConditions.push('nps <= ?');
      params.push(filter.nps_max);
    }
    
    // Location-based filtering
    if (filter.latitude && filter.longitude && filter.radius) {
      // Haversine formula for calculating distance in kilometers
      whereConditions.push(`
        (6371 * acos(
          cos(radians(?)) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(?)) + 
          sin(radians(?)) * 
          sin(radians(latitude))
        )) <= ?`);
      params.push(filter.latitude, filter.longitude, filter.latitude, filter.radius);
    }
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    const [results, _] = await connection.query(query, params);

    console.log(`${results.length} stores returned`);
    return results;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
  finally {
    if (connection !== null) {
      connection.end();
      console.log('Connection closed successfully');
    }
  }
}

async function getFeedback(filter = {}) {
  let connection = null;
  try {
    connection = await connectToDB();
    
    let query = 'SELECT * FROM feedback';
    let params = [];
    
    // Add WHERE clauses if filters are provided
    const whereConditions = [];
    
    if (filter.id) {
      whereConditions.push('id = ?');
      params.push(filter.id);
    }
    
    if (filter.user_id) {
      whereConditions.push('user_id = ?');
      params.push(filter.user_id);
    }
    
    if (filter.store_id) {
      whereConditions.push('store_id = ?');
      params.push(filter.store_id);
    }
    
    if (filter.created_after) {
      whereConditions.push('created_at >= ?');
      params.push(filter.created_after);
    }
    
    if (filter.created_before) {
      whereConditions.push('created_at <= ?');
      params.push(filter.created_before);
    }
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Add ORDER BY if needed
    if (filter.sort_by) {
      query += ` ORDER BY ${filter.sort_by} ${filter.sort_direction || 'ASC'}`;
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const [results, _] = await connection.query(query, params);

    console.log(`${results.length} feedback entries returned`);
    return results;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
  finally {
    if (connection !== null) {
      connection.end();
      console.log('Connection closed successfully');
    }
  }
}

async function getCitas(filter = {}) {
  let connection = null;
  try {
    connection = await connectToDB();
    
    let query = 'SELECT * FROM citas';
    let params = [];
    
    // Add WHERE clauses if filters are provided
    const whereConditions = [];
    
    if (filter.id) {
      whereConditions.push('id = ?');
      params.push(filter.id);
    }
    
    if (filter.store_id) {
      whereConditions.push('store_id = ?');
      params.push(filter.store_id);
    }
    
    if (filter.date) {
      whereConditions.push('date = ?');
      params.push(filter.date);
    }
    
    if (filter.confirmed !== undefined) {
      whereConditions.push('confirmada = ?');
      params.push(filter.confirmed ? 1 : 0);
    }
    
    if (filter.cancelled !== undefined) {
      whereConditions.push('cancelada = ?');
      params.push(filter.cancelled ? 1 : 0);
    }
    
    if (filter.date_from) {
      whereConditions.push('date >= ?');
      params.push(filter.date_from);
    }
    
    if (filter.date_to) {
      whereConditions.push('date <= ?');
      params.push(filter.date_to);
    }
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Add ORDER BY
    query += ' ORDER BY date, time';

    const [results, _] = await connection.query(query, params);

    console.log(`${results.length} citas returned`);
    return results;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
  finally {
    if (connection !== null) {
      connection.end();
      console.log('Connection closed successfully');
    }
  }
}

export {
  getUsers,
  getStores,
  getFeedback,
  getCitas
};