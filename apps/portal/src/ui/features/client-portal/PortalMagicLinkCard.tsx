"use client";

import { FormEvent, useState } from "react";

import { Button, Card, CardBody, Input } from "@heroui/react";
import { signIn } from "next-auth/react";

export function PortalMagicLinkCard({
  email: initialEmail = "",
  callbackUrl = "/",
  readOnly = false,
  title = "Client Portal",
  description = "Enter your email and we'll send a secure magic link.",
}: {
  email?: string;
  callbackUrl?: string;
  readOnly?: boolean;
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    await signIn("resend", {
      email,
      redirect: false,
      callbackUrl,
    });

    setSubmitting(false);
    setMessage("Check your email for a secure sign-in link.");
  }

  return (
    <Card className="border border-white/50 bg-white/85 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-default-100/70">
      <CardBody className="space-y-4 p-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-default-500">{description}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onValueChange={setEmail}
            isRequired
            isReadOnly={readOnly}
          />
          <Button
            type="submit"
            color="primary"
            className="w-full"
            isLoading={submitting}
            isDisabled={!email}
          >
            Send magic link
          </Button>
        </form>

        {message ? <p className="text-sm text-default-500">{message}</p> : null}
      </CardBody>
    </Card>
  );
}
