import { redirect } from "next/navigation";

// Entry point → the Sparetime splash, which advances into the sign-up flow.
export default function Home() {
  redirect("/splash");
}
