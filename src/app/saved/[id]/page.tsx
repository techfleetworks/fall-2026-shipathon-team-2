import { SavedView } from "./saved-view";

// P5 · All done. The booking lives on the person's device; the client view looks
// it up by id.
export const instant = false;

export default async function SavedPage({ params }: PageProps<"/saved/[id]">) {
  const { id } = await params;
  return <SavedView bookingId={id} />;
}
