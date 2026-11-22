import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { FavoritesList } from "./favorites-list";

// H4 · Favorites. Saved places and whether they have an offer now.
export default function FavoritesPage() {
  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">Favorites</h1>
        <p className="mt-3 text-body-lg text-text-secondary">Places you&apos;ve saved, and whether they have an offer now.</p>
        <FavoritesList />
      </ScreenBody>
      <NavBar active="favorites" />
    </Screen>
  );
}
