import Header from "@/components/Header";
import Section from "@/components/Section";
import MerchViewer from "@/components/MerchViewer";
import { MERCH_ITEMS } from "@/lib/merch";

export default function StorePage() {
  return (
    <main className="relative min-h-screen text-slate-100">
      <Header />
      <Section className="pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-300 bg-[length:200%_200%] animate-gradient drop-shadow-[0_0_25px_rgba(34,211,238,0.5)] mb-4">
            Store
          </h1>
          
        </div>

        <MerchViewer items={MERCH_ITEMS} />

       
      </Section>
    </main>
  );
}
