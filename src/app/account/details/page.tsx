import { Screen, ScreenBody } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { NavBar } from "@/components/ui/nav-bar";
import { InfoBox } from "@/components/ui/info-box";
import { DetailsForm } from "./details-form";

// H3d · Your details — everything we know about you, editable.
export default function YourDetailsPage() {
  return (
    <Screen>
      <PageHeader title="Your details" backHref="/account" />
      <ScreenBody className="pt-2">
        <p className="text-body-lg text-text-secondary">This is everything we know about you. Change it any time.</p>
        <DetailsForm />
        <InfoBox className="mt-4">Your area and services are in Settings, under Search.</InfoBox>
      </ScreenBody>
      <NavBar active="account" />
    </Screen>
  );
}
