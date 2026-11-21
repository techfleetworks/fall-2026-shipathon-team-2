import { redirect } from "next/navigation";

// Entry point → the Sparetime splash, which advances into the sign-up flow.
export const instant = false;

export default function Home() {
  redirect("/splash");
}
