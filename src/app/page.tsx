// This file MUST be a SERVER COMPONENT in Next.js App Router

import HeroPanel from "./components/HeroPanel";
import RegistrationForm from "./components/RegistrationForm";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white lg:overflow-hidden">
      <HeroPanel />
      <RegistrationForm />
    </div>
  );
}
