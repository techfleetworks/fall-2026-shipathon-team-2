import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { ListGroup, ListRow } from "@/components/ui/list-row";
import { bookingLimit, user } from "@/lib/mock-data";
import { LogOutButton, ProfileCard } from "./account-client";

// H3 · Account. Customer support has no screen yet, so it's marked "Soon".
export default function AccountPage() {
  const limit = bookingLimit(user);
  const limitCopy = limit === "unlimited" ? "No limit" : `${limit} at a time for now`;

  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">Account</h1>

        <ProfileCard />

        <ListGroup className="mt-3">
          <ListRow icon="ticket" title="Booking limit" sub={`${limitCopy} · how it works`} href="/account/how-bookings-work" />
          <ListRow icon="sliders" title="Settings" href="/account/settings" />
        </ListGroup>

        <ListGroup className="mt-3">
          <ListRow icon="phone" title="Customer support" soon />
          <ListRow icon="lock" title="Privacy and your data" href="/account/privacy" />
        </ListGroup>

        <div className="mt-6 flex justify-center">
          <LogOutButton />
        </div>
      </ScreenBody>
      <NavBar active="account" />
    </Screen>
  );
}
