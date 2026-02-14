const { PrismaClient } = require('@prisma/client');

console.log("Attempting to init PrismaClient...");

try {
  // Try with datasources
  const p1 = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL }
    }
  });
  console.log("Success with datasources!");
} catch (e) {
  console.error("Failed with datasources:", e.message);
}

try {
  // Try with datasourceUrl
  const p2 = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  });
  console.log("Success with datasourceUrl!");
} catch (e) {
  console.error("Failed with datasourceUrl:", e.message);
}

try {
  // Try with adapter (dummy object just to check prop validity)
  const p4 = new PrismaClient({
    adapter: {} 
  });
  console.log("Success with adapter!");
} catch (e) {
  console.error("Failed with adapter:", e.message);
}
