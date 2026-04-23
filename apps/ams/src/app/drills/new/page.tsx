import { redirect } from "next/navigation";

export default async function NewDrillPage() {
  redirect("/resources/drills/new");
}
