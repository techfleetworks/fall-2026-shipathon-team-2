import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { CategoryBadge } from "@/components/ui/badge";
import { InfoBox } from "@/components/ui/info-box";
import { ButtonLink } from "@/components/ui/button";
import { getService, getBusiness, servicesAt, savings, CATEGORY_LABEL } from "@/lib/mock-data";
import { groupHours, offPeakLabel } from "@/lib/slots";
import { Availability } from "./availability";
import { FavoriteHeart } from "@/components/ui/favorite-heart";
import { BackButton } from "@/components/ui/back-button";

// R5 · Offer detail. Everything comes from the (sample) shop's own data: its
// description, hours, off-peak window, what's included and its other offers.
// Open-slot count is live (client). Blocking render (reads route params).
export const instant = false;

export default async function OfferPage({ params }: PageProps<"/offer/[id]">) {
  const { id } = await params;
  const service = getService(id);
  const business = service ? getBusiness(service.businessId) : undefined;
  if (!service || !business) notFound();

  const save = savings(service);
  const moreOffers = servicesAt(business.id).filter((s) => s.id !== service.id);

  return (
    <div className="min-h-dvh w-full bg-bg-canvas">
      <div className="relative mx-auto flex min-h-dvh max-w-[430px] flex-col bg-surface-default pb-28">
        {/* Hero */}
        <div className="relative h-52 w-full overflow-hidden bg-surface-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={business.photo} alt={business.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <BackButton
              fallback="/deals"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-default/90 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <Icon name="chevron-left" />
            </BackButton>
            <FavoriteHeart businessId={business.id} businessName={business.name} />
          </div>
          <div
            className={`absolute -bottom-7 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-surface-default ${
              business.logo ? "bg-status-positive" : "bg-surface-subtle"
            }`}
          >
            {business.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.logo} alt={`${business.name} logo`} className="w-12" />
            ) : (
              <Icon name={business.category === "haircut" ? "scissors" : "shirt"} className="text-action-primary" />
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
          <Availability serviceId={service.id} className="mt-2 text-body-md text-status-positive" />

          <InfoBox className="mt-4">
            Takes: about {service.minutes} minutes
            <br />
            Off-peak hours: {offPeakLabel(business)}
            <br />
            Includes: {service.includes}
          </InfoBox>

          <div className="mt-3 flex items-center gap-2 rounded-lg border border-border-default px-4 py-3 text-body-md text-text-primary">
            <Icon name="map-pin" size={20} className="text-action-primary" /> {business.transit}
          </div>

          <h2 className="mt-6 text-title-md text-text-heading">About {business.name}</h2>
          <p className="mt-1 text-body-lg text-text-secondary">{business.about}</p>

          <h2 className="mt-6 text-title-md text-text-heading">Hours</h2>
          <table className="mt-2 w-full text-body-md">
            <tbody>
              {groupHours(business.hours).map(([days, time]) => (
                <tr key={days}>
                  <td className="py-1 text-text-primary">{days}</td>
                  <td className="py-1 text-right text-text-secondary">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 text-body-sm text-status-positive">Off-peak slots: {offPeakLabel(business)}</p>

          {moreOffers.length > 0 && (
            <>
              <h2 className="mt-6 text-title-md text-text-heading">More offers here</h2>
              <div className="mt-2 flex flex-col gap-2">
                {moreOffers.map((m) => (
                  <Link
                    key={m.id}
                    href={`/offer/${m.id}`}
                    className="flex min-h-[56px] items-center justify-between rounded-lg border border-border-default px-4 py-3 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <div>
                      <p className="text-title-sm text-text-primary">{m.name}</p>
                      <p className="text-body-sm text-text-secondary">
                        <span className="text-text-primary">${m.offPeakPrice}</span>{" "}
                        <span className="line-through">reg ${m.regularPrice}</span>{" "}
                        <span className="text-status-positive">Save ${savings(m)}</span>
                      </p>
                    </div>
                    <Icon name="chevron-right" size={20} className="text-text-secondary" />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sticky footer */}
        <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[430px] border-t border-border-default bg-surface-default px-5 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]">
          <p className="mb-2 text-center text-body-sm text-text-secondary">
            Pay ${service.offPeakPrice} cash at the shop · booking is free
          </p>
          <ButtonLink href={`/offer/${id}/time`} fullWidth>
            Pick a time
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
