import mysql from "mysql2/promise";

async function test() {
  const url = process.env.DATABASE_URL || "mysql://root@localhost:3306/postgres";

  console.log(`Testing ${url}...`);
  try {
    const connection = await mysql.createConnection(url);
    const [rows] = await connection.execute("SELECT 1 as result");
    console.log(`SUCCESS: ${url}`, rows);
    await connection.end();
    process.exit(0);
  } catch (err: any) {
    console.log(`FAILED: ${url} - ${err.message}`);
    process.exit(1);
  }
}

test();
