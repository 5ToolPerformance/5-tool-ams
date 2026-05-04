"use client";

import { Button } from "@heroui/react";
import { signOut } from "next-auth/react";

export function PortalSignOutButton() {
  return (
    <Button
      color="danger"
      variant="flat"
      onPress={() =>
        signOut({
          callbackUrl: "/",
        })
      }
    >
      Sign out
    </Button>
  );
}

