"use client";

import { Button } from "@heroui/react";

export function DevelopmentReportPrintActions() {
  return (
    <div className="flex items-center justify-between gap-3 print:hidden">
      <Button variant="flat" onPress={() => window.history.back()}>
        Back
      </Button>
      <Button color="primary" onPress={() => window.print()}>
        Print / Save as PDF
      </Button>
    </div>
  );
}
