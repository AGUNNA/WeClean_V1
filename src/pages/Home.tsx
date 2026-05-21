import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Shield,
  Clock,
  Star,
  ChevronRight,
  Home as HomeIcon,
  Building2,
  Car,
  Bug,
  Shirt,
  Sofa,
  PartyPopper,
  HardHat,
  ArrowRight,
  CheckCircle2,
  Quote,
  Play,
} from "lucide-react";

const popularServices = [
  {
    icon: HomeIcon,
    title: "House Cleaning",
    description: "Regular home cleaning tailored to your schedule",
    price: "From N5,000",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Sofa,
    title: "Deep Cleaning",
    description: "Thorough cleaning for every corner of your space",
    price: "From N15,000",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Building2,
    title: "Office Cleaning",
    description: "Professional cleaning for workspaces",
    price: "From N20,000",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Bug,
    title: "Fumigation",
    description: "Pest control and fumigation services",
    price: "From N12,000",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Shirt,
    title: "Laundry",
    description: "Wash, dry, and fold laundry service",
    price: "From N3,000",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Car,
    title: "Car Detailing",
    description: "Interior and exterior car cleaning",
    price: "From N8,000",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: HardHat,
    title: "Post-Construction",
    description: "Cleanup after renovation or construction",
    price: "From N50,000",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: PartyPopper,
    title: "Event Cleanup",
    description: "Before and after event cleaning",
    price: "From N25,000",
    color: "bg-pink-50 text-pink-600",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Choose a Service",
    description: "Browse our wide range of cleaning services and select what you need.",
  },
  {
    step: "02",
    title: "Book Instantly",
    description: "Pick a date and time that works for you. Same-day service available.",
  },
  {
    step: "03",
    title: "We Clean",
    description: "A verified professional arrives and transforms your space.",
  },
  {
    step: "04",
    title: "Enjoy",
    description: "Relax in your freshly cleaned space. Rate your experience.",
  },
];

const testimonials = [
  {
    name: "Amara Okafor",
    role: "Homeowner, Lekki",
    text: "CleanPro has been a game-changer for my family. The cleaners are professional, punctual, and thorough. I book every week!",
    rating: 5,
  },
  {
    name: "Tunde Bakare",
    role: "Office Manager, Ikeja",
    text: "We use CleanPro for our office cleaning. The team is reliable and our workspace has never looked better. Highly recommended.",
    rating: 5,
  },
  {
    name: "Ngozi Eze",
    role: "Airbnb Host, Victoria Island",
    text: "As an Airbnb host, I need same-day turnover cleaning. CleanPro delivers every time. My guests always compliment the cleanliness!",
    rating: 5,
  },
];

const trustBadges = [
  { icon: Shield, label: "Verified Cleaners", description: "Background checked" },
  { icon: Clock, label: "On-Time Guarantee", description: "Or it's free" },
  { icon: Star, label: "4.9/5 Rating", description: "From 10,000+ reviews" },
  { icon: CheckCircle2, label: "Insured Service", description: "Full coverage" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#dbeafe_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#ede9fe_0%,_transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  #1 Cleaning Marketplace in Nigeria
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Professional Cleaning{" "}
                <span className="text-blue-600">at Your Doorstep</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Book trusted, verified cleaning professionals for your home,
                office, or event. From regular housekeeping to deep cleaning —
                we've got you covered across Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/services")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 h-14 shadow-xl shadow-blue-600/20"
                >
                  Book a Cleaning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/provider/onboarding")}
                  className="text-lg px-8 h-14 border-slate-300 hover:bg-slate-50"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Become a Provider
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">4.9/5</span>{" "}
                    from 10,000+ happy customers
                  </p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 aspect-[4/3] bg-slate-100">
                <img
                  src="/hero-cleaning.jpg"
                  alt="Professional cleaning service in Nigeria"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/10" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">2,500+</p>
                  <p className="text-xs text-slate-500">Cleaners Available</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">
                    Live Tracking
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ──────────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <badge.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {badge.label}
                  </p>
                  <p className="text-xs text-slate-500">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SERVICES ──────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
              Cleaning Services for Every Need
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              From homes to offices, vehicles to events — find the perfect
              cleaning service for your needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <Card
                key={service.title}
                className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigate("/services")}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${service.color}`}
                  >
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600">
                      {service.price}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/services")}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
              Book in Minutes, Clean in Hours
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="text-6xl font-extrabold text-blue-100 leading-none mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
              Loved by Thousands
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
              >
                <Quote className="w-8 h-8 text-blue-500 mb-4" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────────── */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready for a Cleaner Space?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join over 50,000 Nigerians who trust CleanPro for their cleaning needs.
            First-time customers get 20% off!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/services")}
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 h-14 shadow-xl"
            >
              Book Now & Save 20%
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/provider/onboarding")}
              className="border-white text-white hover:bg-blue-700 text-lg px-8 h-14"
            >
              Become a Provider
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
