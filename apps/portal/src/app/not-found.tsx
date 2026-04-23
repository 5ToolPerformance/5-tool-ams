import { Card, CardBody } from "@heroui/react";
import { IconFileUnknown } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <Card className="mx-auto mt-4 max-w-md">
      <CardBody className="text-center">
        <p className="flex items-center justify-center gap-2 text-2xl">
          <IconFileUnknown />
          This page could not be found.
        </p>
      </CardBody>
    </Card>
  );
}
