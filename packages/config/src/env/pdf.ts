import { z } from "zod";

const pdfEnvSchema = z.object({
  PUPPETEER_EXECUTABLE_PATH: z.string().optional(),
});

const parsedPdfEnv = pdfEnvSchema.safeParse(process.env);

if (!parsedPdfEnv.success) {
  console.error("Invalid PDF environment variables:", parsedPdfEnv.error);
  process.exit(1);
}

export const env = parsedPdfEnv.data;
