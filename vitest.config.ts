import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    // La API exige DATABASE_URL al importar. Los tests unitarios no se conectan,
    // así que alcanza con un valor ficticio. Los de integración usan RUN_DB_TESTS=true.
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ?? "postgres://test:test@localhost:5432/test",
    },
    coverage: { reporter: ["text", "html"] },
  },
})
