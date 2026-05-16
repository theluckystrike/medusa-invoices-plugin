const { Modules } = require("@medusajs/utils")

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_NAME = process.env.DB_TEMP_NAME || "medusa_test"
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

process.env.POSTGRES_URL = DB_URL

// The integration tests generate JWT tokens with this secret, so both the
// http config and the user module must use the same value.
const JWT_SECRET = "supersecret"

module.exports = {
  projectConfig: {
    databaseUrl: DB_URL,
    http: {
      jwtSecret: JWT_SECRET,
      cookieSecret: JWT_SECRET,
    },
    redisUrl: "redis://localhost:6379",
  },
  admin: {
    disable: true,
  },
  modules: {
    [Modules.AUTH]: true,
    [Modules.USER]: {
      resolve: "@medusajs/user",
      options: {
        jwt_secret: JWT_SECRET,
      },
    },
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-inmemory",
      options: { ttl: 0 },
    },
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
          },
        ],
      },
    },
    [Modules.WORKFLOW_ENGINE]: true,
    [Modules.STORE]: true,
    [Modules.ORDER]: true,
    [Modules.CUSTOMER]: true,
    [Modules.API_KEY]: true,
    invoice: {
      resolve: "./src/modules/invoice",
    },
  },
}
