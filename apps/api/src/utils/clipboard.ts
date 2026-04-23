"use client";

export async function copyTextToClipboard(text: string) {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const isFocusError =
      error instanceof DOMException && error.name === "NotAllowedError";

    if (!isFocusError && !message.includes("Document is not focused")) {
      throw error;
    }
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard is unavailable.");
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const didCopy = document.execCommand("copy");

  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error("Clipboard is unavailable.");
  }
}
