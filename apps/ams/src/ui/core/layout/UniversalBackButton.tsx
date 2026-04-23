"use client";

import { useRouter } from "next/navigation";

import { Button } from "@heroui/react";
import { IconArrowLeft } from "@tabler/icons-react";

export function UniversalBackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <Button
      type="button"
      variant="flat"
      color="default"
      startContent={<IconArrowLeft size={16} />}
      onPress={handleBack}
      aria-label="Go back to previous page"
    >
      Back
    </Button>
  );
}
