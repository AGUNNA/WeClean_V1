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
  Calendar,
  MapPin,
  DollarSign,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";

const allBookings = [
  { id: "#1284", customer: "Amara Okafor", provider: "Chioma A.", service: "House Cleaning", amount: "12,000", status: "confirmed", date: "May 15, 2026", location: "Lekki", payment: "paid" },
  { id: "#1283", customer: "Tunde Bakare", provider: "Emmanuel K.", service: "Deep Cleaning", amount: "25,000", status: "in_progress", date: "May 15, 2026", location: "Ikeja", payment: "paid" },
  { id: "#1282", customer: "Ngozi Eze", provider: "CleanPro Team", service: "Office Cleaning", amount: "45,000", status: "completed", date: "May 14, 2026", location: "VI", payment: "paid" },
  { id: "#1281", customer: "Ibrahim K", provider: "Amina S.", service: "Fumigation", amount: "15,000", status: "pending", date: "May 14, 2026", location: "Yaba", payment: "pending" },
  { id: "#1280", customer: "Chioma A", provider: "Sunday O.", service: "Laundry", amount: "5,500", status: "completed", date: "May 13, 2026", location: "Surulere", payment: "paid" },
  { id: "#1279", customer: "David M", provider: "Fatima K.", service: "Car Detailing", amount: "8,000", status: "cancelled", date: "May 13, 2026", location: "Ikoyi", payment: "refunded" },
  { id: "#1278", customer: "Blessing O", provider: "John P.", service: "Post-Construction", amount: "75,000", status: "confirmed", date: "May 12, 2026", location: "Ajah", payment: "paid" },
  { id: "#1277", customer: "Michael A", provider: "Grace T.", service: "Event Cleanup", amount: "30,000", status: "completed", date: "May 12, 2026", location: "Eko Hotel", payment: "paid" },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = allBookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and monitor all platform bookings.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 font-medium">
                    <span className="flex items-center gap-1">
                      ID <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="py-4 px-6 font-medium">Customer</th>
                  <th className="py-4 px-6 font-medium">Provider</th>
                  <th className="py-4 px-6 font-medium">Service</th>
                  <th className="py-4 px-6 font-medium">Amount</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium">Date</th>
                  <th className="py-4 px-6 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-semibold text-blue-600">
                      {booking.id}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-900">
                      {booking.customer}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {booking.provider}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {booking.service}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-900">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {booking.amount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant="secondary"
                        className={statusColors[booking.status]}
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {booking.date}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
