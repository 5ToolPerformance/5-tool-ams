"use client";

import type { ReactNode } from "react";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/react";
import { X } from "lucide-react";

interface RightSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function RightSideDrawer({
  isOpen,
  onClose,
  title,
  children,
}: RightSideDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      placement="right"
      size="2xl"
      scrollBehavior="inside"
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between gap-4 border-b pr-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            isIconOnly
            aria-label="Close drawer"
            disableRipple
            variant="light"
            onPress={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </DrawerHeader>
        <DrawerBody className="px-6 py-5">{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
