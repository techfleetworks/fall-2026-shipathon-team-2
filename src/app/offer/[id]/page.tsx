import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { CategoryBadge } from "@/components/ui/badge";
import { InfoBox } from "@/components/ui/info-box";
import { ButtonLink } from "@/components/ui/button";
import { getService, getBusiness, CATEGORY_LABEL } from "@/lib/mock-data";

// R5 · Offer detail. Blocking render (reads route params; mock data, not cached).
export const instant = false;

export default async function OfferPage({ params }: PageProps<"/offer/[id]">) {
  const { id } = await params;
  const service = getService(id);
  const business = service ? getBusiness(service.businessId) : undefined;
  if (!service || !business) notFound();

  const save = service.regularPrice - service.offPeakPrice;
  const moreOffers = [
    { name: "Beard trim", price: 8, regular: 15 },
    { name: "Kids' haircut", price: 10, regular: 20 },
  ];

  return (
    <div className="min-h-dvh w-full bg-bg-canvas">
      <div className="relative mx-auto flex min-h-dvh max-w-[430px] flex-col bg-surface-default pb-28">
        {/* Hero */}
        <div className="relative h-52 w-full overflow-hidden bg-surface-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={business.photo} alt={business.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <Link href="/deals" aria-label="Go back" className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-default/90 text-text-primary">
              <Icon name="chevron-left" />
            </Link>
            <div className="flex gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-default/90 text-text-primary"><Icon name="search" size={20} /></span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-default/90 text-text-primary"><Icon name="heart" size={20} /></span>
            </div>
          </div>
          <div className="absolute -bottom-7 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-surface-default bg-surface-default">
            {business.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.logo} alt={`${business.name} logo`} className="h-full w-full object-cover" />
            ) : (
              <Icon name="scissors" className="text-action-primary" />
            )}
          </div>
        </div>

        <div className="px-5 pt-10">
          <CategoryBadge category={business.category}>{CATEGORY_LABEL[business.category]}</CategoryBadge>
          <h1 className="mt-2 text-headline-sm text-text-heading">{service.name}</h1>
          <p className="mt-1 text-body-md text-text-secondary">
            {business.name} · ★ {business.rating} · {business.distanceMi} mi
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-headline-sm text-text-primary">${service.offPeakPrice}</span>
            <span className="text-body-lg text-text-secondary line-through">reg ${service.regularPrice}</span>
            <span className="rounded-full bg-status-positive-surface px-2.5 py-1 text-label-md text-on-tint-positive">Save ${save}</span>
          </div>
          <p className="mt-2 text-body-md text-status-positive">2 slots left today</p>

          <InfoBox className="mt-4">
            Takes: about 30 minutes<br />
            Off-peak hours: weekdays 1–5 pm<br />
            Includes: wash, cut and a hot-towel finish
          </InfoBox>

          <div className="mt-3 flex items-center gap-2 rounded-lg border border-border-default px-4 py-3 text-body-md text-text-primary">
            <Icon name="map-pin" size={20} className="text-action-primary" /> 4 min walk from 7th St/Metro
          </div>

          <h2 className="mt-6 text-title-md text-text-heading">About {business.name}</h2>
          <p className="mt-1 text-body-lg text-text-secondary">
            A barbershop near the 7th St/Metro station, open since 2019. Walk-ins welcome. Sparetime slots are held for
            you, so you won&rsquo;t wait.
          </p>

          <h2 className="mt-6 text-title-md text-text-heading">Hours</h2>
          <table className="mt-2 w-full text-body-md">
            <tbody>
              <tr><td className="py-1 text-text-primary">Mon–Fri</td><td className="py-1 text-right text-text-secondary">10 am – 7 pm</td></tr>
              <tr><td className="py-1 text-text-primary">Saturday</td><td className="py-1 text-right text-text-secondary">9 am – 5 pm</td></tr>
              <tr><td className="py-1 text-text-primary">Sunday</td><td className="py-1 text-right text-text-secondary">Closed</td></tr>
            </tbody>
          </table>
          <p className="mt-1 text-body-sm text-status-positive">Off-peak slots: weekdays 1–5 pm</p>

          <h2 className="mt-6 text-title-md text-text-heading">More offers here</h2>
          <div className="mt-2 flex flex-col gap-2">
            {moreOffers.map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-lg border border-border-default px-4 py-3">
                <div>
                  <p className="text-title-sm text-text-primary">{m.name}</p>
                  <p className="text-body-sm text-text-secondary">
                    <span className="text-text-primary">${m.price}</span> <span className="line-through">reg ${m.regular}</span>{" "}
                    <span className="text-status-positive">Save ${m.regular - m.price}</span>
                  </p>
                </div>
                <Icon name="chevron-right" size={20} className="text-text-secondary" />
              </div>
            ))}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[430px] border-t border-border-default bg-surface-default px-5 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]">
          <p className="mb-2 text-center text-body-sm text-text-secondary">
            Pay ${service.offPeakPrice} cash at the shop · booking is free
          </p>
          <ButtonLink href={`/offer/${id}/time`} fullWidth>Pick a time</ButtonLink>
        </div>
      </div>
    </div>
  );
}
