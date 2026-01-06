"use client";

import { useState } from "react";

import {
  Button,
  Chip,
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
import useSWR from "swr";

import { MechanicForm } from "./MechanicForm";
import { MechanicsImportModal } from "./MechanicsImportModal";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function MechanicsTable() {
  const { data, mutate } = useSWR("/api/mechanics", fetcher);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  function openCreate() {
    setEditing(null);
    setIsOpen(true);
  }

  function openEdit(mechanic: any) {
    setEditing(mechanic);
    setIsOpen(true);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/mechanics/${id}`, { method: "DELETE" });
    mutate();
  }

  if (!data) return <div>Loading mechanics…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Mechanics</h2>

        <div className="flex gap-2">
          <Button color="primary" onPress={openCreate}>
            Add Mechanic
          </Button>

          <Button variant="flat" onPress={() => setImportOpen(true)}>
            Import CSV
          </Button>
        </div>
      </div>

      <Table aria-label="Mechanics table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Tags</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody>
          {data.map((m: any) => (
            <TableRow key={m.id}>
              <TableCell>{m.name}</TableCell>

              <TableCell>
                <Chip size="sm" variant="flat">
                  {m.type}
                </Chip>
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {m.tags?.map((tag: string) => (
                    <Chip key={tag} size="sm" variant="bordered">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </TableCell>

              <TableCell align="right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="flat" onPress={() => openEdit(m)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() => handleDelete(m.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editing ? "Edit Mechanic" : "Create Mechanic"}
              </ModalHeader>

              <ModalBody>
                <MechanicForm
                  initialValues={editing}
                  onSuccess={() => {
                    mutate();
                    onClose();
                  }}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <MechanicsImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={() => mutate()}
      />
    </div>
  );
}
