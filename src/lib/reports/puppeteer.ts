import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

import { env } from "@/env/server";

function isRemotePdfRuntime() {
  return (
    process.env.VERCEL === "1" ||
    process.env.AWS_EXECUTION_ENV !== undefined ||
    process.env.NODE_ENV === "production"
  );
}

export async function launchPdfBrowser() {
  const isRemote = isRemotePdfRuntime();

  let executablePath: string;
  let args = puppeteer.defaultArgs();
  let headless: boolean | "shell" = true;

  if (isRemote) {
    if (!env.CHROMIUM_PACK_URL) {
      throw new Error("CHROMIUM_PACK_URL is required for remote PDF generation.");
    }

    executablePath = await chromium.executablePath(env.CHROMIUM_PACK_URL);
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
