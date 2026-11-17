import type { Metadata } from "next";
import MyPickups from "./my-pickups";

export const metadata: Metadata = { title: "My pickups" };

export default function MyPickupsPage() {
  return <MyPickups />;
}
