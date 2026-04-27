import {
  createAuthContextQueries,
  createClientAuthQueries,
} from "@ams/application/auth/db-queries";

export const authContextQueries = createAuthContextQueries();
export const clientAuthQueries = createClientAuthQueries();
