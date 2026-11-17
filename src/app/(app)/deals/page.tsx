import type { Metadata } from "next";
import DealsList from "./deals-list";

export const metadata: Metadata = {
  title: "Deals near you",
};

export default function DealsPage() {
  return <DealsList />;
}
