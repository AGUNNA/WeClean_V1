import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Shield,
  Clock,
  Star,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Home as HomeIcon,
  Building2,
  Bug,
  Shirt,
  Sofa,
  HardHat,
  Car,
} from "lucide-react";

const popularServices = [
  { icon: HomeIcon, title: "House Cleaning", description: "Regular home cleaning, your schedule.", price: "₦12,000" },
  { icon: Sofa, title: "Deep Cleaning", description: "Thorough, top-to-bottom refresh.", price: "₦25,000" },
  { icon: Building2, title: "Office Cleaning", description: "Professional workspace care.", price: "₦45,000" },
  { icon: Bug, title: "Fumigation", description: "Pest control & fumigation.", price: "₦15,000" },
  { icon: Shirt, title: "Laundry & Ironing", description: "Wash, dry, fold & press.", price: "₦5,500" },
  { icon: HardHat, title: "Post-Construction", description: "Cleanup after the build.", price: "₦60,000" },
  { icon: Car, title: "Car Detailing", description: "Interior & exterior shine.", price: "₦8,000" },
  { icon: Sparkles, title: "Move-in / Move-out", description: "Fresh start, spotless space.", price: "₦35,000" },
];

const stats = [
  { value: "50K+", label: "Happy customers" },
  { value: "2,500+", label: "Verified cleaners" },
  { value: "8", label: "Cities covered" },
  { value: "4.9★", label: "Average rating" },
];

const howItWorks = [
  { step: "01", title: "Choose a service", description: "Browse our cleaning services and pick what you need." },
  { step: "02", title: "Book instantly", description: "Pick a date and time. Same-day service available." },
  { step: "03", title: "We clean", description: "A verified professional arrives and transforms your space." },
  { step: "04", title: "Relax & rate", description: "Enjoy a spotless space and rate your experience." },
];

const testimonials = [
  { name: "Amara Okafor", role: "Homeowner · Lekki", text: "WeClean has been a game-changer for my family. The cleaners are professional, punctual, and thorough. I book every week." },
  { name: "Tunde Bakare", role: "Office Manager · Ikeja", text: "We use WeClean for our office. The team is reliable and our workspace has never looked better. Highly recommended." },
  { name: "Ngozi Eze", role: "Airbnb Host · V.I.", text: "As a host I need same-day turnover cleaning. WeClean delivers every time — guests always compliment the cleanliness." },
];

const trustBadges = [
  { icon: Shield, label: "Verified cleaners", description: "Background checked" },
  { icon: Clock, label: "On-time guarantee", description: "Or it's free" },
  { icon: Star, label: "4.9 / 5 rating", description: "10,000+ reviews" },
  { icon: CheckCircle2, label: "Insured service", description: "Full coverage" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-background">
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#15110d 1px,transparent 1px),linear-gradient(90deg,#15110d 1px,transparent 1px)",
            backgroundSize: "40px 40px, 40px 40px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            <div className="lg:col-span-6 space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-ink rounded-full bg-cream">
                <span className="flex h-2 w-2 rounded-full bg-brand" />
                <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Nigeria's #1 cleaning marketplace
                </span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[0.95]">
                A spotless space,
                <br />
                <span className="text-brand">on demand.</span>
              </h1>
              <p className="text-lg text-ink/70 leading-relaxed max-w-md">
                Book trusted, verified cleaning professionals for your home,
                office, or event — across Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("/services")}
                  className="bg-ink hover:bg-brand text-white text-base px-7 h-12 shadow-hard hover:shadow-hard-brand transition-all"
                >
                  Book a cleaning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="text-base px-7 h-12 border-2 border-ink hover:bg-ink hover:text-white"
                >
                  Explore the demo
                </Button>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2.5">
                  {["bg-brand", "bg-ink", "bg-amber-500", "bg-brand-700"].map((c, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full border-2 border-cream ${c} flex items-center justify-center text-xs font-bold text-white`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-ink/60">
                  <span className="font-bold text-ink">4.9★</span> · 10,000+ reviews
                </p>
              </div>
            </div>

            {/* Hero image — hard frame */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-lg overflow-hidden aspect-[4/3] border-2 border-ink shadow-hard">
                <img
                  src="/hero-cleaning.jpg"
                  alt="Professional cleaners at work in a Nigerian home"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-cream border-2 border-ink rounded-md px-3.5 py-2.5 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-brand" />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-ink">2,500+ cleaners</p>
                  <p className="text-xs text-ink/55">available near you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ─────────────────────────────────────────────── */}
      <section className="bg-ink text-cream border-b-2 border-ink">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/15">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-8 text-center">
              <p className="font-display text-4xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-cream/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand">
                Our services
              </span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-ink">
                Cleaning for every need
              </h2>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/services")}
              className="border-2 border-ink hover:bg-ink hover:text-white"
            >
              All services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink border-2 border-ink rounded-lg overflow-hidden">
            {popularServices.map((service) => (
              <button
                key={service.title}
                onClick={() => navigate("/services")}
                className="group text-left bg-cream p-6 transition-colors hover:bg-brand"
              >
                <div className="w-11 h-11 rounded-sm border-2 border-ink bg-paper flex items-center justify-center mb-4 group-hover:bg-cream">
                  <service.icon className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink">{service.title}</h3>
                <p className="text-sm text-ink/60 mt-1 mb-4 group-hover:text-ink/80">{service.description}</p>
                <div className="flex items-center justify-between pt-3 border-t-2 border-ink/10 group-hover:border-ink/20">
                  <span className="text-sm text-ink/70">
                    from <span className="font-bold text-ink">{service.price}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-ink/40 group-hover:text-ink transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="py-20 border-y-2 border-ink bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">
              How it works
            </span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-ink">
              Book in minutes, clean in hours
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <div key={step.step} className="bg-cream border-2 border-ink rounded-lg p-6 shadow-hard-sm">
                <div className="font-display text-3xl font-bold text-brand mb-3">{step.step}</div>
                <h3 className="text-base font-bold text-ink mb-1.5">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ───────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                <div className="w-11 h-11 border-2 border-ink rounded-sm bg-paper flex items-center justify-center shrink-0">
                  <badge.icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{badge.label}</p>
                  <p className="text-xs text-ink/55">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="py-20 bg-ink text-cream border-y-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">
              Testimonials
            </span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-white">
              Loved by thousands
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="border-2 border-white/15 rounded-lg p-6">
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand text-brand" />
                  ))}
                </div>
                <p className="text-cream/80 text-[15px] leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 bg-brand rounded-sm flex items-center justify-center text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-cream/50">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-ink rounded-lg bg-brand px-8 py-14 text-center shadow-hard">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
              Ready for a cleaner space?
            </h2>
            <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ Nigerians who trust WeClean. First-time customers get
              20% off their first booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/services")}
                className="bg-ink hover:bg-white hover:text-ink text-white text-base px-7 h-12 border-2 border-ink"
              >
                Book now & save 20%
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-2 border-ink text-ink hover:bg-ink hover:text-white bg-transparent text-base px-7 h-12"
              >
                Try the demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
