"use client";

import { useState } from "react";

import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

type PreviewRow =
  | {
      valid: true;
      data: {
        name: string;
        description?: string;
        type: string;
        tags?: string;
      };
    }
  | {
      valid: false;
      raw: any;
      errors: Record<string, string[]>;
    };

export function MechanicsImportModal({
  isOpen,
  onClose,
  onImported,
}: {
  isOpen: boolean;
  onClose: () => void;
  onImported: () => void;
}) {
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFileUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    const res = await fetch("/api/mechanics/import/preview", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPreview(data.rows);
    setLoading(false);
  }

  async function handleConfirmImport() {
    const validRows = preview
      .filter((r): r is Extract<PreviewRow, { valid: true }> => r.valid)
      .map((r) => r.data);

    setLoading(true);

    await fetch("/api/mechanics/import/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: validRows }),
    });

    setLoading(false);
    setPreview([]);
    onImported();
    onClose();
  }

  const validCount = preview.filter((r) => r.valid).length;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="4xl">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>Import Mechanics (CSV)</ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                type="file"
                accept=".csv"
                isDisabled={loading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              {preview.length > 0 && (
                <Table aria-label="CSV Preview">
                  <TableHeader>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Status</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {preview.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {row.valid ? row.data.name : (row.raw?.name ?? "—")}
                        </TableCell>

                        <TableCell>
                          {row.valid ? row.data.type : (row.raw?.type ?? "—")}
                        </TableCell>

                        <TableCell>
                          {row.valid ? (
                            <Chip color="success" size="sm">
                              Valid
                            </Chip>
                          ) : (
                            <Chip color="danger" size="sm">
                              Invalid
                            </Chip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={close}>
                Cancel
              </Button>

              <Button
                color="primary"
                isDisabled={validCount === 0 || loading}
                onPress={handleConfirmImport}
              >
                Import {validCount} Mechanics
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
