import { Link } from "react-router";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="font-display text-2xl font-bold text-white tracking-tight">
                We<span className="text-brand">Clean</span>
              </span>
            </Link>
            <p className="text-sm text-cream/50 leading-relaxed">
              Nigeria's most trusted on-demand cleaning and facility management
              marketplace. Connecting you with verified cleaning professionals.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 bg-white/5 rounded-sm hover:bg-brand hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2.5">
              {["House Cleaning", "Deep Cleaning", "Office Cleaning", "Fumigation", "Laundry Service", "Post-Construction", "Event Cleanup"].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-sm text-cream/50 hover:text-white transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Become a Provider", href: "/provider/onboarding" },
                { label: "Contact", href: "/contact" },
                { label: "FAQs", href: "/faq" },
                { label: "Help Center", href: "/faq" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-cream/50 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                <span className="text-sm text-cream/50">
                  +234 800 WECLEAN
                  <br />
                  Mon - Sat, 7am - 8pm
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                <span className="text-sm text-cream/50">
                  hello@weclean.ng
                  <br />
                  support@weclean.ng
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                <span className="text-sm text-cream/50">
                  123 Admiralty Way
                  <br />
                  Lekki Phase 1, Lagos
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream/40">
            &copy; {new Date().getFullYear()} WeClean. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-cream/40">Secured with</span>
            <div className="flex items-center gap-2">
              {["Paystack", "Flutterwave", "SSL"].map((b) => (
                <span key={b} className="px-2 py-1 bg-white/5 rounded-sm text-xs font-medium text-cream/50">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
