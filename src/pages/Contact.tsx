import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const details = [
  { icon: Phone, label: "Phone", value: "+234 800 WECLEAN", sub: "Mon–Sat, 7am – 8pm" },
  { icon: Mail, label: "Email", value: "hello@weclean.ng", sub: "We reply within 24 hours" },
  { icon: MapPin, label: "Office", value: "123 Admiralty Way", sub: "Lekki Phase 1, Lagos" },
  { icon: Clock, label: "Support hours", value: "7am – 8pm", sub: "Every day except Sundays" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error("Please fill in your name, email, and message.");
    }
    toast.success("Message sent — we'll get back to you shortly!");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className="bg-background">
      <section className="border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Contact</span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-ink mt-3 leading-[0.95]">
            Get in <span className="text-brand">touch.</span>
          </h1>
          <p className="text-lg text-ink/70 mt-5 max-w-2xl">
            Questions, feedback, or need a hand with a booking? We're here to help.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-8">
          {/* Details */}
          <div className="lg:col-span-2 space-y-4">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-4 border-2 border-ink/15 rounded-lg p-5 bg-paper">
                <div className="w-11 h-11 rounded-sm border-2 border-ink bg-cream flex items-center justify-center shrink-0">
                  <d.icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/45 font-semibold">{d.label}</p>
                  <p className="font-bold text-ink">{d.value}</p>
                  <p className="text-sm text-ink/55">{d.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-3 border-2 border-ink rounded-lg bg-paper p-6 sm:p-8 space-y-4 shadow-hard">
            <h2 className="font-display text-2xl font-bold text-ink">Send us a message</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="How can we help?" />
            </div>
            <div className="space-y-1.5">
              <Label>Message</Label>
              <Textarea rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us a bit more…" />
            </div>
            <Button type="submit" className="bg-ink hover:bg-brand text-white h-11 px-6">
              Send message
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
