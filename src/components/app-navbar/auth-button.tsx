"use client";

import {
  Avatar,
  Button,
  CircularProgress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { IconBrandGoogle, IconBrandMinecraft } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton({ minimal = true }: { minimal?: boolean }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <CircularProgress />;
  }

  if (status === "authenticated") {
    const signOutClick = () =>
      signOut({
        callbackUrl: "/",
      });
    if (minimal) {
      return (
        <Button onPress={signOutClick} color="danger" variant="ghost">
          <IconBrandGoogle />
          Sign Out
        </Button>
      );
    }

    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            showFallback={!session?.user?.image}
            src={session?.user?.image || ""}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{session?.user?.email}</p>
          </DropdownItem>
          <DropdownItem key="sign-out" color="danger" onPress={signOutClick}>
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <>
      <Button
        onPress={() => signIn("google", { callbackUrl: "/profile" })}
        color="danger"
        variant="ghost"
      >
        <IconBrandGoogle />
        Sign In
      </Button>
      <Button
        onPress={() =>
          signIn("microsoft-entra-id", { callbackUrl: "/profile" })
        }
        color="danger"
        variant="ghost"
      >
        <IconBrandMinecraft />
        Sign In
      </Button>
    </>
  );
}
