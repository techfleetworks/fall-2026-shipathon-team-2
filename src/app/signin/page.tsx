import { PhoneStep } from "@/components/onboarding/phone-step";

// Sign in (phone). Same phone + code flow as sign-up, with "Welcome back"
// wording; an account already on this phone goes straight to Deals.
export default function SignInPage() {
  return <PhoneStep mode="signin" />;
}
