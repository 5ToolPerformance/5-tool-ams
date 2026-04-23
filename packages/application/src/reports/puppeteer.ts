import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

import { env } from "@ams/config/env/server";

function isRemotePdfRuntime() {
  const runtimeEnv = globalThis.process?.env;

  return (
    runtimeEnv?.VERCEL === "1" ||
    runtimeEnv?.AWS_EXECUTION_ENV !== undefined ||
    runtimeEnv?.NODE_ENV === "production"
  );
}

export async function launchPdfBrowser() {
  const isRemote = isRemotePdfRuntime();

  let executablePath: string;
  let args = puppeteer.defaultArgs();
  let headless: boolean | "shell" = true;

  if (isRemote) {
    executablePath = await chromium.executablePath();
    args = puppeteer.defaultArgs({
      args: chromium.args,
      headless: "shell",
    });
    headless = "shell";
  } else {
    if (!env.PUPPETEER_EXECUTABLE_PATH) {
      throw new Error(
        "PUPPETEER_EXECUTABLE_PATH is required for local PDF generation."
      );
    }

    executablePath = env.PUPPETEER_EXECUTABLE_PATH;
  }

  return puppeteer.launch({
    args,
    executablePath,
    headless,
    defaultViewport: {
      width: 1200,
      height: 1600,
      deviceScaleFactor: 1,
      isLandscape: false,
      isMobile: false,
      hasTouch: false,
    },
  });
}
