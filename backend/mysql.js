import mysql from "mysql2/promise"

async function connectToDB() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  });
}

async function getUsers() {
  let connection = null;
  try {
    connection = await connectToDB()

    const [results, _] = await connection.query('SELECT * from users')

    console.log(`${results.length} rows returned`)
    return results
  }
  catch (error) {
    console.log(error)
  }
  finally {
    if (connection !== null) {
      connection.end()
      console.log('Connection closed successfuly')
    }
  }
}
