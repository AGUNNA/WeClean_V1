import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, ShieldCheck, HeartHandshake, Leaf } from "lucide-react";

const stats = [
  { value: "50K+", label: "Customers served" },
  { value: "2,500+", label: "Vetted cleaners" },
  { value: "8", label: "Cities" },
  { value: "2024", label: "Founded" },
];

const values = [
  { icon: ShieldCheck, title: "Trust first", text: "Every cleaner is background-checked, ID-verified, and rated by real customers." },
  { icon: HeartHandshake, title: "Fair for all", text: "Transparent pricing for customers and fair, on-time payouts for providers." },
  { icon: Leaf, title: "Cleaner & greener", text: "Eco-friendly product options on every booking, because clean shouldn't cost the planet." },
  { icon: Target, title: "Reliability", text: "On-time guarantee — if we're late, the booking is on us." },
];

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="border-b-2 border-ink">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">About WeClean</span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-ink mt-3 leading-[0.95]">
            Cleaning, made
            <br />
            <span className="text-brand">trustworthy.</span>
          </h1>
          <p className="text-lg text-ink/70 mt-6 max-w-2xl leading-relaxed">
            WeClean is Nigeria's on-demand cleaning marketplace. We connect
            households and businesses with verified cleaning professionals — and
            give those professionals a reliable way to earn. One platform,
            spotless results.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink text-cream border-b-2 border-ink">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/15">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-8 text-center">
              <p className="font-display text-4xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-cream/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">Our story</h2>
          </div>
          <div className="space-y-4 text-ink/70 leading-relaxed">
            <p>
              WeClean started with a simple frustration: booking a trustworthy
              cleaner was harder than it should be. Customers didn't know who
              they were letting into their homes, and great cleaners struggled
              to find steady, fairly-paid work.
            </p>
            <p>
              So we built a marketplace that puts trust at the centre —
              verification, ratings, secure payments, and an on-time guarantee.
              Today, thousands of cleanings happen on WeClean every month across
              Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-paper border-y-2 border-ink">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-ink mb-10">What we stand for</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-cream border-2 border-ink rounded-lg p-6 shadow-hard-sm">
                <div className="w-11 h-11 rounded-sm border-2 border-ink bg-paper flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-lg font-bold text-ink">{v.title}</h3>
                <p className="text-sm text-ink/60 mt-1.5 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-ink rounded-lg bg-brand px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-hard">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Ready to experience it?</h2>
              <p className="text-white/85 mt-1">Book a cleaning or join as a provider today.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button onClick={() => navigate("/services")} className="bg-ink hover:bg-white hover:text-ink text-white border-2 border-ink h-11 px-6">
                Book now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={() => navigate("/provider/onboarding")} variant="outline" className="border-2 border-ink text-ink hover:bg-ink hover:text-white bg-transparent h-11 px-6">
                Become a provider
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
