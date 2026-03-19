"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";

import { useRoutineFormContext } from "./RoutineFormProvider";

export function RoutineBlocksStep() {
  const {
    values,
    errors,
    availableDrillOptions,
    addBlock,
    updateBlock,
    removeBlock,
    addDrillToBlock,
    updateDrillInBlock,
    removeDrillFromBlock,
  } = useRoutineFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Blocks & Drills</h3>
        <p className="text-sm text-default-500">
          Create blocks however you want, then associate drills inside each
          block.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Routine Blocks</p>
            <p className="text-xs text-default-500">
              Each block needs a title and at least one drill.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addBlock}>
            Add Block
          </Button>
        </div>

        {errors.blocks ? <p className="text-sm text-danger">{errors.blocks}</p> : null}

        {values.blocks.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No blocks added yet.
          </div>
        ) : (
          <div className="space-y-5">
            {values.blocks.map((block, blockIndex) => (
              <Card key={block.id} shadow="none" className="border">
                <CardBody className="gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Block {blockIndex + 1}</p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeBlock(blockIndex)}
                    >
                      Remove Block
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="Block Title"
                      labelPlacement="outside"
                      value={block.title}
                      onValueChange={(value) =>
                        updateBlock(blockIndex, { title: value })
                      }
                      placeholder="e.g. Warm-Up Prep"
                      isInvalid={!!errors[`blocks.${blockIndex}.title`]}
                      errorMessage={errors[`blocks.${blockIndex}.title`]}
                    />

                    <Input
                      type="number"
                      label="Block Sort Order"
                      labelPlacement="outside"
                      value={String(block.sortOrder)}
                      onValueChange={(value) =>
                        updateBlock(blockIndex, {
                          sortOrder: Number.isNaN(Number(value))
                            ? block.sortOrder
                            : Number(value),
                        })
                      }
                      min={0}
                    />
                  </div>

                  <Textarea
                    label="Block Notes"
                    labelPlacement="outside"
                    value={block.notes}
                    onValueChange={(value) =>
                      updateBlock(blockIndex, { notes: value })
                    }
                    placeholder="Optional coaching notes for this block"
                    minRows={3}
                  />

                  <Divider />

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Drills</p>
                      <p className="text-xs text-default-500">
                        Select existing drills for this block.
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => addDrillToBlock(blockIndex)}
                    >
                      Add Drill
                    </Button>
                  </div>

                  {errors[`blocks.${blockIndex}.drills`] ? (
                    <p className="text-sm text-danger">
                      {errors[`blocks.${blockIndex}.drills`]}
                    </p>
                  ) : null}

                  {availableDrillOptions.length === 0 ? (
                    <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
                      No drills are available for the selected plan discipline.
                    </div>
                  ) : null}

                  {block.drills.length === 0 ? (
                    <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
                      No drills added to this block yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {block.drills.map((drill, drillIndex) => (
                        <Card
                          key={drill.id}
                          shadow="none"
                          className="border bg-default-50"
                        >
                          <CardBody className="gap-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium">
                                Drill {drillIndex + 1}
                              </p>
                              <Button
                                color="danger"
                                variant="light"
                                onPress={() =>
                                  removeDrillFromBlock(blockIndex, drillIndex)
                                }
                              >
                                Remove Drill
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Select
                                label="Drill"
                                labelPlacement="outside"
                                placeholder="Select a drill"
                                selectedKeys={drill.drillId ? [drill.drillId] : []}
                                onSelectionChange={(keys) => {
                                  const selected = Array.from(keys)[0];
                                  if (typeof selected === "string") {
                                    const option = availableDrillOptions.find(
                                      (item) => item.id === selected
                                    );
                                    updateDrillInBlock(blockIndex, drillIndex, {
                                      drillId: selected,
                                      title: option?.title ?? "",
                                    });
                                  }
                                }}
                                isInvalid={
                                  !!errors[
                                    `blocks.${blockIndex}.drills.${drillIndex}.drillId`
                                  ]
                                }
                                errorMessage={
                                  errors[
                                    `blocks.${blockIndex}.drills.${drillIndex}.drillId`
                                  ]
                                }
                              >
                                {availableDrillOptions.map((option) => (
                                  <SelectItem key={option.id}>
                                    {option.title}
                                  </SelectItem>
                                ))}
                              </Select>

                              <Input
                                type="number"
                                label="Drill Sort Order"
                                labelPlacement="outside"
                                value={String(drill.sortOrder)}
                                onValueChange={(value) =>
                                  updateDrillInBlock(blockIndex, drillIndex, {
                                    sortOrder: Number.isNaN(Number(value))
                                      ? drill.sortOrder
                                      : Number(value),
                                  })
                                }
                                min={0}
                              />
                            </div>

                            <Textarea
                              label="Drill Notes"
                              labelPlacement="outside"
                              value={drill.notes}
                              onValueChange={(value) =>
                                updateDrillInBlock(blockIndex, drillIndex, {
                                  notes: value,
                                })
                              }
                              placeholder="Optional drill notes"
                              minRows={3}
                            />
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
