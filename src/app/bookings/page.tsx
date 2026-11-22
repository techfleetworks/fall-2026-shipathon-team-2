import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { UpcomingList } from "./upcoming-list";
import { PastList } from "./past-list";
import { ReminderBanner } from "@/components/booking/reminder-banner";

// H2 · My bookings — the person's own bookings (on this device). A new account
// starts empty; bookings appear when they book, and move to Past once done,
// cancelled or missed.
export default function MyBookingsPage() {
  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">My bookings</h1>
        <div className="-mx-5">
          <ReminderBanner />
        </div>

        <h2 className="mt-5 mb-2 text-label-md text-text-secondary">Upcoming</h2>
        <UpcomingList />

        <h2 className="mt-5 mb-2 text-label-md text-text-secondary">Past</h2>
        <PastList />
      </ScreenBody>
      <NavBar active="bookings" />
    </Screen>
  );
}
