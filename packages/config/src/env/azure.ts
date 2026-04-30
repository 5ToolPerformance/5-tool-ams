import { z } from "zod";

const isTestEnv = process.env.NODE_ENV === "test";

const azureEnvSchema = z.object({
  AZURE_STORAGE_ACCOUNT_NAME: isTestEnv
    ? z.string().default("teststorage")
    : z.string(),
  AZURE_STORAGE_CONNECTION_STRING: isTestEnv
    ? z
        .string()
        .default(
          "DefaultEndpointsProtocol=https;AccountName=teststorage;AccountKey=dGVzdA==;EndpointSuffix=core.windows.net"
        )
    : z.string(),
  AZURE_STORAGE_CONTAINER_NAME: isTestEnv
    ? z.string().default("attachments")
    : z.string(),
});

const parsedAzureEnv = azureEnvSchema.safeParse(process.env);

if (!parsedAzureEnv.success) {
  console.error("Invalid Azure storage environment variables:", parsedAzureEnv.error);
  process.exit(1);
}

export const env = parsedAzureEnv.data;
