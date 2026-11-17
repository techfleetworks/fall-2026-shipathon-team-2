"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

type Screen =
  | "welcome"
  | "phone"
  | "code"
  | "about"
  | "benefits"
  | "photo"
  | "review"
  | "checking"
  | "verified";

const DIET = ["Vegetarian", "Halal", "Dairy-free", "Gluten-free", "Other"];
const BENEFITS = ["CalFresh (SNAP / EBT)", "WIC", "Medi-Cal", "None of these"];

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted">Step {step} of 5</span>
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
    </button>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface"}`}>
      {on && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>}
    </span>
  );
}

const cta = "min-h-[52px] rounded-full bg-primary px-5 font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50";

export default function Onboarding() {
  const router = useRouter();
  const { setVerified } = useAppStore();
  const [screen, setScreen] = useState<Screen>("welcome");

  // form state
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("Chloe");
  const [area, setArea] = useState("Palms");
  const [alertsConsent, setAlertsConsent] = useState(false);
  const [diet, setDiet] = useState<string[]>([]);
  const [benefit, setBenefit] = useState(BENEFITS[0]);
  const [shareConsent, setShareConsent] = useState(true);

  function toggleDiet(d: string) {
    setDiet((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  }

  // O6l → O7 after a brief check
  useEffect(() => {
    if (screen !== "checking") return;
    const t = setTimeout(() => setScreen("verified"), 1400);
    return () => clearTimeout(t);
  }, [screen]);

  const shell = "mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 pb-10 pt-8";

  // O0 · Welcome
  if (screen === "welcome") {
    return (
      <main className={shell}>
        <h1 className="text-2xl font-bold tracking-tight">Neighborhood Deals</h1>
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-primary-soft text-sm text-primary-hover">
          Plenty
        </div>
        <p className="text-muted">Grocery deals near you. Browse anytime, and sign up to reserve.</p>
        <Link href="/deals" className="w-fit font-semibold text-primary underline">Browse deals</Link>
        <div className="mt-auto flex flex-col gap-2">
          <button onClick={() => setScreen("phone")} className={cta}>Sign up</button>
          <button onClick={() => setScreen("phone")} className="min-h-[52px] rounded-full border border-border px-5 font-semibold transition hover:border-primary">Sign in</button>
        </div>
      </main>
    );
  }

  // O1 · Phone
  if (screen === "phone") {
    return (
      <main className={shell}>
        <BackButton onClick={() => setScreen("welcome")} />
        <StepBar step={1} />
        <h1 className="text-2xl font-bold tracking-tight">Create your free account</h1>
        <p className="text-muted">Browse anytime. To reserve, sign up with your phone.</p>
        <label className="text-sm text-muted" htmlFor="phone">Phone number</label>
        <input id="phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(310) 555-0142" className="rounded-xl border border-border bg-surface px-4 py-3 text-base outline-none" />
        <p className="text-sm text-muted">We only text pickups and alerts you turn on.</p>
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <Check on={smsConsent} />
          <input type="checkbox" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} className="sr-only" />
          I agree to receive pickup texts at this number
        </label>
        <p className="text-xs text-muted">Message frequency varies. Message and data rates may apply. Reply STOP to opt out. See our Terms and Privacy Policy.</p>
        <button onClick={() => setScreen("code")} disabled={!smsConsent} className={`mt-auto ${cta}`}>Send code</button>
      </main>
    );
  }

  // O2 · Code
  if (screen === "code") {
    return (
      <main className={shell}>
        <BackButton onClick={() => setScreen("phone")} />
        <StepBar step={2} />
        <h1 className="text-2xl font-bold tracking-tight">Enter the code</h1>
        <p className="text-muted">Sent to {phone || "(310) ***-**42"}</p>
        <label className="text-sm text-muted" htmlFor="code">Code</label>
        <input id="code" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} placeholder="482 — — —" className="rounded-xl border border-border bg-surface px-4 py-3 text-center text-xl tracking-[0.3em] outline-none" />
        <div className="flex gap-3">
          <button className="rounded-full border border-border px-4 py-2 text-sm text-muted">Resend code (0:30)</button>
          <button className="rounded-full border border-border px-4 py-2 text-sm font-medium">Call me instead</button>
        </div>
        <button onClick={() => setScreen("about")} className={`mt-auto ${cta}`}>Continue</button>
      </main>
    );
  }

  // O3 · About you
  if (screen === "about") {
    return (
      <main className={shell}>
        <BackButton onClick={() => setScreen("code")} />
        <StepBar step={3} />
        <h1 className="text-2xl font-bold tracking-tight">About you</h1>
        <label className="text-sm text-muted" htmlFor="name">First name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-border bg-surface px-4 py-3 text-base outline-none" />
        <p className="text-sm font-semibold">Where should we look?</p>
        <select value={area} onChange={(e) => setArea(e.target.value)} className="rounded-xl border border-border bg-surface px-4 py-3 text-base" aria-label="Area">
          <option>Palms</option>
          <option>Mar Vista</option>
          <option>Culver City</option>
        </select>
        <button className="flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
          Use my current location
        </button>
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <Check on={alertsConsent} />
          <input type="checkbox" checked={alertsConsent} onChange={(e) => setAlertsConsent(e.target.checked)} className="sr-only" />
          I agree to receive grocery deal alerts near me
        </label>
        <p className="text-xs text-muted">Up to 1 a day. You can change this anytime in Settings.</p>
        <p className="text-sm font-semibold">Dietary preferences (optional)</p>
        <div className="flex flex-wrap gap-2">
          {DIET.map((d) => (
            <button key={d} onClick={() => toggleDiet(d)} className={`rounded-full border px-3 py-1.5 text-sm transition ${diet.includes(d) ? "border-primary bg-primary-soft text-primary-hover" : "border-border"}`}>{d}</button>
          ))}
        </div>
        <button onClick={() => setScreen("benefits")} className={`mt-auto ${cta}`}>Next</button>
      </main>
    );
  }

  // O4 · Benefits
  if (screen === "benefits") {
    return (
      <main className={shell}>
        <BackButton onClick={() => setScreen("about")} />
        <StepBar step={4} />
        <h1 className="text-2xl font-bold tracking-tight">Do you get any of these?</h1>
        <p className="text-sm text-muted">Select all that apply. You&apos;ll show proof for one of them.</p>
        <div className="flex flex-col gap-3">
          {BENEFITS.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
              <Check on={benefit === b} />
              <input type="radio" name="benefit" checked={benefit === b} onChange={() => setBenefit(b)} className="sr-only" />
              {b}
            </label>
          ))}
        </div>
        <p className="text-sm text-muted">Verifying once lets you reserve deals. No SSN or bank login, ever.</p>
        <button onClick={() => setScreen("photo")} className={`mt-auto ${cta}`}>Next</button>
      </main>
    );
  }

  // O5 · Photo
  if (screen === "photo") {
    return (
      <main className={shell}>
        <BackButton onClick={() => setScreen("benefits")} />
        <StepBar step={5} />
        <h1 className="text-2xl font-bold tracking-tight">Photo of your EBT card</h1>
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-price-soft text-sm text-muted">[ camera frame ]</div>
        <p className="text-sm">Your name must show.</p>
        <p className="text-sm text-muted">The photo is deleted after we check it.</p>
        <button onClick={() => setScreen("review")} className={`mt-auto ${cta}`}>Take photo</button>
      </main>
    );
  }

  // O6 · Review and agree
  if (screen === "review") {
    return (
      <main className={shell}>
        <BackButton onClick={() => setScreen("photo")} />
        <StepBar step={5} />
        <h1 className="text-2xl font-bold tracking-tight">Check what you&apos;re sharing</h1>
        <div className="text-sm">
          <p>Photo: EBT card ✓</p>
          <p>Name: {name}</p>
          <p>Program: {benefit.replace(/ \(.*\)/, "")}</p>
        </div>
        <p className="text-sm text-muted">Used only to confirm you qualify.</p>
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <Check on={shareConsent} />
          <input type="checkbox" checked={shareConsent} onChange={(e) => setShareConsent(e.target.checked)} className="sr-only" />
          I agree to share this to confirm I qualify
        </label>
        <button onClick={() => setScreen("checking")} disabled={!shareConsent} className={`mt-auto ${cta}`}>Agree and submit</button>
      </main>
    );
  }

  // O6l · Checking photo
  if (screen === "checking") {
    return (
      <main className={`${shell} items-center justify-center text-center`}>
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden />
        <h1 className="text-xl font-bold tracking-tight">Checking your photo…</h1>
        <p className="text-muted">This only takes a moment.</p>
      </main>
    );
  }

  // O7 · Verified
  return (
    <main className={shell}>
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        You&apos;re verified
        <span className="text-primary"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg></span>
      </h1>
      <p className="text-muted">You can now reserve deals near you.</p>
      <p className="text-muted">Your verification is valid for 12 months. We&apos;ve deleted your photo.</p>
      <button
        onClick={() => {
          setVerified(true);
          router.push("/deals");
        }}
        className={`mt-auto ${cta}`}
      >
        Browse deals
      </button>
    </main>
  );
}
