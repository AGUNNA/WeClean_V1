import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I book a cleaning?",
    a: "Browse our services, pick the one you need, choose a date and time, enter your address, and confirm. You'll be matched with a verified cleaner — same-day service is available in most areas.",
  },
  {
    q: "Are the cleaners verified?",
    a: "Yes. Every provider on WeClean is ID-verified and background-checked before they can accept jobs. You can also see ratings and reviews from real customers before booking.",
  },
  {
    q: "How much does it cost?",
    a: "Pricing depends on the service and the size of your space. You'll always see a clear price breakdown before you pay — no hidden fees. Standard house cleaning starts from ₦12,000.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cards, bank transfers, and your WeClean wallet, securely processed through Paystack and Flutterwave.",
  },
  {
    q: "What if I'm not satisfied with the cleaning?",
    a: "Your satisfaction is guaranteed. If something isn't right, raise a dispute from your booking within 24 hours and our support team will make it right — including a re-clean or refund where appropriate.",
  },
  {
    q: "Can I reschedule or cancel a booking?",
    a: "Yes. You can reschedule or cancel from your dashboard. Cancellations made well ahead of the scheduled time are free; late cancellations may incur a small fee.",
  },
  {
    q: "How do I become a cleaning provider?",
    a: "Head to “Become a Provider”, complete the onboarding (profile, ID verification, and bank details), and once approved you can start accepting jobs and earning.",
  },
  {
    q: "Do you offer services for businesses?",
    a: "Absolutely. Businesses can register a company account to manage staff, accept bookings, track earnings, and request payouts — all from the Business Hub.",
  },
];

export default function FAQ() {
  const navigate = useNavigate();
  return (
    <div className="bg-background">
      <section className="border-b-2 border-ink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Help Center</span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-ink mt-3 leading-[0.95]">
            Frequently asked
            <br />
            <span className="text-brand">questions.</span>
          </h1>
          <p className="text-lg text-ink/70 mt-5 max-w-2xl">
            Everything you need to know about booking, payments, and working with WeClean.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-2 border-ink rounded-lg bg-paper px-5"
              >
                <AccordionTrigger className="text-left font-bold text-ink hover:no-underline py-4">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-ink/70 leading-relaxed pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 border-2 border-ink rounded-lg bg-ink text-cream p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-white">Still have questions?</h2>
            <p className="text-cream/70 mt-1.5 mb-5">Our team is happy to help — reach out any time.</p>
            <Button onClick={() => navigate("/contact")} className="bg-brand hover:bg-brand-700 text-white h-11 px-6">
              Contact support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
