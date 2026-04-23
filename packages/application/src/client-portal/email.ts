import { env } from "@ams/config/env/server";

export async function sendClientInviteEmail(input: {
  email: string;
  inviteToken: string;
  recipientName?: string | null;
  playerNames: string[];
}) {
  const inviteUrl = `${env.PORTAL_APP_URL}/portal/invite/${input.inviteToken}`;
  const greeting = input.recipientName ? `Hi ${input.recipientName},` : "Hi,";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PORTAL_EMAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.PORTAL_EMAIL_FROM,
      to: [input.email],
      subject: "You have been invited to the 5 Tool client portal",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <p>${greeting}</p>
          <p>You have been invited to the 5 Tool client portal.</p>
          <p>Linked players: ${input.playerNames.join(", ") || "Portal access"}</p>
          <p style="margin:24px 0">
            <a href="${inviteUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#111827;color:#ffffff;text-decoration:none;font-weight:600">
              Open invite
            </a>
          </p>
          <p style="color:#4b5563;font-size:14px">This secure invite will guide you through magic-link sign in.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send client invite email");
  }
}
