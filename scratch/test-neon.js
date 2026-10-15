const { Client } = require('pg');

const poolerUrl = "postgresql://neondb_owner:npg_so3lJbi0LNTD@ep-small-leaf-b5t4zxzq-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";
const directUrl = "postgresql://neondb_owner:npg_so3lJbi0LNTD@ep-small-leaf-b5t4zxzq.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function test() {
  const client = new Client({ connectionString: directUrl });
  try {
    await client.connect();
    console.log("SUCCESSFULLY CONNECTED TO NEON DIRECT!");
    const res = await client.query("SELECT version()");
    console.log("Postgres Version:", res.rows[0].version);
  } catch (err) {
    console.error("Connection error:", err.message);
  } finally {
    await client.end();
  }
}

test();
