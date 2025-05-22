"use client";

import { useState } from "react";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useSession } from "next-auth/react";

export default function LessonForm({ playerId }: { playerId: string }) {
  const [lessonDate, setLessonDate] = useState("");
  const [notesText, setNotesText] = useState("");
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (onClose: () => void) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({ userId: playerId, lessonDate, notesText }),
    });

    if (res.ok) {
      setLessonDate("");
      setNotesText("");
      onClose();
    }
  };

  if (!["coach", "admin"].includes(session?.user?.role || "")) return null;

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Create Lesson
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Lesson
              </ModalHeader>
              <ModalBody>
                <Input
                  type="date"
                  label="Lesson Date"
                  value={lessonDate}
                  onChange={(e) => setLessonDate(e.target.value)}
                />
                <Textarea
                  label="Lesson Notes"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => handleSubmit(onClose)}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
