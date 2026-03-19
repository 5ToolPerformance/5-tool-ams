"use client";

import { Button } from "@heroui/react";

export function DevelopmentReportPrintActions() {
  return (
    <div className="flex items-center justify-end gap-3 print:hidden">
      <Button color="primary" onPress={() => window.print()}>
        Print / Save as PDF
      </Button>
    </div>
  );
}
