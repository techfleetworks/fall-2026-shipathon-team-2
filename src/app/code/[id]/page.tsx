import { CodeView } from "./code-view";

// P4 · Show code. The booking lives on the person's device; the client view
// looks it up by id.
export const instant = false;

export default async function ShowCodePage({ params }: PageProps<"/code/[id]">) {
  const { id } = await params;
  return <CodeView bookingId={id} />;
}
