"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader>Lesson Saved</ModalHeader>

        <ModalBody>
          <p>Your lesson has been saved successfully.</p>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
