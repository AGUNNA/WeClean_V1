import { Link } from "react-router";
import { Sparkles, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">CleanPro</span>
                <span className="text-[10px] text-slate-500 ml-1 font-medium uppercase tracking-wider">
                  Nigeria
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nigeria's most trusted on-demand cleaning and facility management
              marketplace. Connecting you with verified cleaning professionals.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2.5">
              {[
                "House Cleaning",
                "Deep Cleaning",
                "Office Cleaning",
                "Fumigation",
                "Laundry Service",
                "Post-Construction",
                "Event Cleanup",
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "#" },
                { label: "Become a Provider", href: "/provider/onboarding" },
                { label: "Blog", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Help Center", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">
                  +234 800 CLEANPRO
                  <br />
                  Mon - Sat, 7am - 8pm
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">
                  hello@cleanpro.ng
                  <br />
                  support@cleanpro.ng
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">
                  123 Admiralty Way
                  <br />
                  Lekki Phase 1, Lagos
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CleanPro Nigeria. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600">Secured with</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-800 rounded text-xs font-medium text-slate-400">
                Paystack
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded text-xs font-medium text-slate-400">
                Flutterwave
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded text-xs font-medium text-slate-400">
                SSL
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
