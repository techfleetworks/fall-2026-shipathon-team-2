import { redirect } from "next/navigation";

// The app opens on the Deals tab. (Onboarding/welcome flow routes here later.)
export default function Home() {
  redirect("/deals");
}
