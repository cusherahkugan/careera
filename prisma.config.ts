import { defineConfig } from "@prisma/cli";

export default defineConfig({
  client: {
    adapter: "postgresql",          // your database type
    url: process.env.DATABASE_URL,  // Prisma reads this from .env.local
  },
});
