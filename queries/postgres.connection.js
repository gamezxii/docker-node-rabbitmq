const { Pool } = require("pg");
const client = new Pool({
  user: "postgres",
  host: "postgresqlqm",
  database: "item",
  password: "password",
  port: 5432,
});

const executePostgres = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS "users" (
	    "id" SERIAL,
	    "name" VARCHAR(100) NOT NULL,
	    PRIMARY KEY ("id")
    );`;
  try {
    await client.connect();
    await client.query(query);
    return true;
  } catch (error) {
    console.log('error postgres');
    console.log(error.stack);
  }
};

const getUsersPostgres = async () => {
  return await new Promise((resolve, reject) => {
    client.query("SELECT * FROM users ORDER BY id DESC Limit 3", (err, results) => {
      if (err) {
        throw err;
      }
      console.log('selected ss')
      resolve(results.rows);
    });
  })  
};

const createUserPostgres = (name) => {
  client.query(
    "INSERT INTO users (name) VALUES ($1)",
    [name],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log('postgres create user :' + name)
      return true;
    }
  );
};

module.exports = {
  executePostgres,
  createUserPostgres,
  getUsersPostgres,
};
