import { env } from "@/env/server";

interface ExternalSystemConfig {
  armcare: {
    username: string;
    password: string;
    authUrl: string;
    apiUrl: string;
  };
}

export class ExternalConfig {
  static getArmCareConfig(): ExternalSystemConfig["armcare"] {
    const username = env.ARMCARE_USERNAME;
    const password = env.ARMCARE_PASSWORD;
    let authUrl = env.ARMCARE_AUTH_URL_STAGING;
    let apiUrl = env.ARMCARE_API_URL_STAGING;

    if (env.ARMCARE_STATUS === "prod") {
      authUrl = env.ARMCARE_AUTH_URL_PROD;
      apiUrl = env.ARMCARE_API_URL_PROD;
    }

    if (!username || !password || !authUrl || !apiUrl) {
      throw new Error(
        "ArmCare configuration missing. Check environment variables: " +
          "ARMCARE_USERNAME, ARMCARE_PASSWORD, ARMCARE_AUTH_URL, ARMCARE_API_URL"
      );
    }

    return {
      username,
      password,
      authUrl,
      apiUrl,
    };
  }
}

export type ArmCareConfig = ExternalSystemConfig["armcare"];
