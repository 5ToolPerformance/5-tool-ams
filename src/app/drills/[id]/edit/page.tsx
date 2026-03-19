import { redirect } from "next/navigation";

export default async function EditDrillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/resources/drills/${id}/edit`);
}
