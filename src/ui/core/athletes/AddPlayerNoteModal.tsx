"use client";

import { usePlayerNotes } from "@/hooks";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
} from "@heroui/react";
import { cloneElement, ReactElement, useState } from "react";
import { toast } from "sonner";

interface AddPlayerNoteModalProps {
    playerId: string;
    trigger: ReactElement<{ onPress?: () => void }>;
}

export function AddPlayerNoteModal({
    playerId,
    trigger,
}: AddPlayerNoteModalProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { refresh } = usePlayerNotes(playerId);

    const submit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/player-notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerId, content }),
            });

            if (!res.ok) {
                throw new Error("Failed to create note");
            }

            setContent("");
            refresh();
            onOpenChange();
            toast.success("Note added successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add note");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Trigger */}
            {cloneElement(trigger, {
                onPress: onOpen,
            })}

            {/* Modal */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Add Player Note</ModalHeader>

                            <ModalBody>
                                <Textarea
                                    label="Note"
                                    placeholder="Parent conversation, follow-ups, context…"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    minRows={5}
                                />
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    variant="flat"
                                    onPress={onClose}
                                    isDisabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={submit}
                                    isLoading={isSubmitting}
                                >
                                    Save Note
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
