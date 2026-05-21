import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  MoreHorizontal,
  Briefcase,
} from "lucide-react";

const providers = [
  { id: 1, name: "Chioma Adeleke", type: "Individual", city: "Lekki", rating: 4.9, jobs: 156, status: "verified", badge: "Gold", joinDate: "Jan 2025" },
  { id: 2, name: "Sparkle Clean Ltd", type: "Company", city: "Ikeja", rating: 4.7, jobs: 342, status: "verified", badge: "Platinum", joinDate: "Mar 2024" },
  { id: 3, name: "Emmanuel Okonkwo", type: "Individual", city: "Yaba", rating: 4.8, jobs: 89, status: "pending", badge: "None", joinDate: "May 2026" },
  { id: 4, name: "Amina Suleiman", type: "Individual", city: "Surulere", rating: 4.5, jobs: 67, status: "pending", badge: "None", joinDate: "May 2026" },
  { id: 5, name: "CleanMax Services", type: "Company", city: "VI", rating: 4.6, jobs: 278, status: "verified", badge: "Silver", joinDate: "Jun 2024" },
  { id: 6, name: "Sunday Ojo", type: "Individual", city: "Ikoyi", rating: 4.9, jobs: 134, status: "verified", badge: "Gold", joinDate: "Sep 2024" },
];

export default function AdminProviders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = providers.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Providers</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage cleaning professionals and companies.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filtered.map((provider) => (
          <Card key={provider.id} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {provider.name}
                      </h3>
                      <Badge
                        className={
                          provider.status === "verified"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {provider.status}
                      </Badge>
                      {provider.badge !== "None" && (
                        <Badge className="bg-blue-100 text-blue-700">
                          {provider.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {provider.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {provider.rating}
                      </span>
                      <span>{provider.jobs} jobs</span>
                      <span>{provider.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {provider.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" className="h-8">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" className="h-8 bg-blue-600">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Verify
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
