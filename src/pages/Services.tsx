import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  Sofa,
  Building2,
  Bug,
  Shirt,
  Car,
  HardHat,
  PartyPopper,
  Sparkles,
  Bath,
  TreePine,
  Plane,
  Search,
  ArrowRight,
  Filter,
  Star,
} from "lucide-react";

const serviceCategories = [
  { id: "all", label: "All Services", icon: Sparkles },
  { id: "residential", label: "Home", icon: Home },
  { id: "commercial", label: "Commercial", icon: Building2 },
  { id: "specialized", label: "Specialized", icon: Sofa },
];

const allServices = [
  {
    id: 1,
    slug: "house-cleaning",
    title: "House Cleaning",
    category: "residential",
    description: "Regular home cleaning service for a spotless living space. Includes dusting, mopping, bathroom cleaning, and kitchen sanitization.",
    price: "5,000",
    priceUnit: "per session",
    duration: "2-3 hours",
    rating: 4.9,
    reviews: 2341,
    icon: Home,
    color: "bg-brand-50 text-brand",
    features: ["Dusting & Vacuuming", "Mopping Floors", "Bathroom Cleaning", "Kitchen Wipe-down"],
  },
  {
    id: 2,
    slug: "deep-cleaning",
    title: "Deep Cleaning",
    category: "residential",
    description: "Intensive cleaning that reaches every corner. Perfect for seasonal cleaning or preparing for special occasions.",
    price: "15,000",
    priceUnit: "per session",
    duration: "4-6 hours",
    rating: 4.8,
    reviews: 1856,
    icon: Sofa,
    color: "bg-emerald-50 text-emerald-600",
    features: ["Inside Cabinets", "Behind Appliances", "Window Tracks", "Grout Cleaning"],
  },
  {
    id: 3,
    slug: "office-cleaning",
    title: "Office Cleaning",
    category: "commercial",
    description: "Professional cleaning services for offices and workplaces. Keep your work environment healthy and productive.",
    price: "20,000",
    priceUnit: "per session",
    duration: "3-5 hours",
    rating: 4.9,
    reviews: 987,
    icon: Building2,
    color: "bg-violet-50 text-violet-600",
    features: ["Desk Sanitization", "Floor Polishing", "Restroom Cleaning", "Trash Removal"],
  },
  {
    id: 4,
    slug: "fumigation",
    title: "Fumigation & Pest Control",
    category: "specialized",
    description: "Effective pest control and fumigation services. Eliminate cockroaches, mosquitoes, rats, and other pests safely.",
    price: "12,000",
    priceUnit: "per session",
    duration: "1-2 hours",
    rating: 4.7,
    reviews: 1543,
    icon: Bug,
    color: "bg-amber-50 text-amber-600",
    features: ["Cockroach Control", "Mosquito Treatment", "Rodent Removal", "Bed Bug Treatment"],
  },
  {
    id: 5,
    slug: "laundry-service",
    title: "Laundry & Dry Cleaning",
    category: "specialized",
    description: "Full laundry service including wash, dry, fold, and ironing. We handle your clothes with care.",
    price: "3,000",
    priceUnit: "per basket",
    duration: "24-48 hours",
    rating: 4.8,
    reviews: 3210,
    icon: Shirt,
    color: "bg-rose-50 text-rose-600",
    features: ["Wash & Fold", "Ironing", "Dry Cleaning", "Stain Treatment"],
  },
  {
    id: 6,
    slug: "car-detailing",
    title: "Vehicle Detailing",
    category: "specialized",
    description: "Interior and exterior car cleaning and detailing. Make your car look brand new inside and out.",
    price: "8,000",
    priceUnit: "per vehicle",
    duration: "2-3 hours",
    rating: 4.9,
    reviews: 876,
    icon: Car,
    color: "bg-cyan-50 text-cyan-600",
    features: ["Interior Vacuum", "Dashboard Polish", "Exterior Wash", "Tire Shine"],
  },
  {
    id: 7,
    slug: "post-construction",
    title: "Post-Construction Cleanup",
    category: "commercial",
    description: "Thorough cleaning after construction or renovation work. Remove dust, debris, and construction residue.",
    price: "50,000",
    priceUnit: "per project",
    duration: "1-2 days",
    rating: 4.8,
    reviews: 432,
    icon: HardHat,
    color: "bg-orange-50 text-orange-600",
    features: ["Debris Removal", "Dust Elimination", "Floor Cleaning", "Window Cleaning"],
  },
  {
    id: 8,
    slug: "event-cleanup",
    title: "Event Cleanup",
    category: "commercial",
    description: "Before and after event cleaning services. We handle weddings, corporate events, parties, and more.",
    price: "25,000",
    priceUnit: "per event",
    duration: "2-4 hours",
    rating: 4.7,
    reviews: 654,
    icon: PartyPopper,
    color: "bg-pink-50 text-pink-600",
    features: ["Pre-Event Setup", "Post-Event Cleanup", "Trash Removal", "Venue Sanitization"],
  },
  {
    id: 9,
    slug: "bathroom-sanitation",
    title: "Bathroom Sanitation",
    category: "residential",
    description: "Deep bathroom cleaning and sanitization. Eliminate germs, mold, and soap scum for a sparkling clean bathroom.",
    price: "4,500",
    priceUnit: "per bathroom",
    duration: "1-2 hours",
    rating: 4.8,
    reviews: 1123,
    icon: Bath,
    color: "bg-teal-50 text-teal-600",
    features: ["Tile & Grout", "Toilet Deep Clean", "Mold Removal", "Fixture Polish"],
  },
  {
    id: 10,
    slug: "home-organization",
    title: "Home Organization",
    category: "residential",
    description: "Professional organizing service to declutter and arrange your home. Transform chaotic spaces into organized havens.",
    price: "10,000",
    priceUnit: "per room",
    duration: "3-5 hours",
    rating: 4.9,
    reviews: 567,
    icon: TreePine,
    color: "bg-indigo-50 text-indigo-600",
    features: ["Closet Organization", "Kitchen Arrangement", "Garage Cleanup", "Storage Solutions"],
  },
  {
    id: 11,
    slug: "jet-detailing",
    title: "Aircraft Detailing",
    category: "specialized",
    description: "Specialized cleaning for private jets and aircraft. Premium service for aviation clients.",
    price: "150,000",
    priceUnit: "per aircraft",
    duration: "4-8 hours",
    rating: 5.0,
    reviews: 23,
    icon: Plane,
    color: "bg-slate-100 text-slate-600",
    features: ["Cabin Deep Clean", "Exterior Wash", "Leather Treatment", "Aviation-Grade Products"],
  },
  {
    id: 12,
    slug: "mattress-cleaning",
    title: "Mattress & Upholstery",
    category: "specialized",
    description: "Deep cleaning for mattresses, sofas, chairs, and upholstered furniture. Remove dust mites, stains, and odors.",
    price: "6,000",
    priceUnit: "per item",
    duration: "1-2 hours",
    rating: 4.8,
    reviews: 789,
    icon: Sofa,
    color: "bg-lime-50 text-lime-600",
    features: ["Stain Removal", "Dust Mite Treatment", "Odor Elimination", "Fabric Protection"],
  },
];

export default function Services() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = allServices.filter((service) => {
    const matchesCategory =
      activeCategory === "all" || service.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">
            Services
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Find the Perfect Cleaning Service
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Browse our comprehensive range of professional cleaning services.
            All services include verified professionals and satisfaction guarantee.
          </p>

          {/* Search */}
          <div className="mt-8 flex gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button variant="outline" className="h-12 px-4">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-brand text-white shadow-hard-sm "
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="group border-ink/12 shadow-hard-sm hover:shadow-hard transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div
                    className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 ${service.color}`}
                  >
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-slate-600"
                      >
                        <div className="w-1 h-1 bg-brand rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-lg font-bold text-slate-900">
                        N{service.price}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">
                        {service.priceUnit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-slate-700">
                        {service.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <div className="px-6 pb-6">
                  <Button
                    className="w-full bg-brand hover:bg-brand-700 text-white group-hover:shadow-hard-sm transition-all"
                    onClick={() => navigate(`/book/${service.id}`)}
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No services found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
