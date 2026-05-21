import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  Home,
  Plus,
  Minus,
  Check,
  MapPin,
  CreditCard,
  Shield,
} from "lucide-react";

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM",
];

const propertySizes = [
  { value: "studio", label: "Studio Apartment", price: 5000 },
  { value: "1_bedroom", label: "1 Bedroom", price: 8000 },
  { value: "2_bedroom", label: "2 Bedroom", price: 12000 },
  { value: "3_bedroom", label: "3 Bedroom", price: 18000 },
  { value: "4_bedroom", label: "4+ Bedroom", price: 25000 },
  { value: "duplex", label: "Duplex", price: 35000 },
  { value: "mansion", label: "Mansion", price: 50000 },
];

const addons = [
  { id: "eco", label: "Eco-Friendly Products", price: 1500 },
  { id: "window", label: "Window Cleaning", price: 3000 },
  { id: "fridge", label: "Fridge Deep Clean", price: 2000 },
  { id: "oven", label: "Oven Cleaning", price: 2500 },
  { id: "laundry", label: "Laundry Service", price: 5000 },
  { id: "disinfect", label: "UV Disinfection", price: 4000 },
];

export default function BookingFlow() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [roomCount, setRoomCount] = useState(2);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [address, setAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "Lagos",
    accessInfo: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("paystack");

  const basePrice = propertySizes.find((p) => p.value === propertySize)?.price || 0;
  const addonsPrice = selectedAddons.reduce((sum, id) => {
    const addon = addons.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);
  const platformFee = Math.round(basePrice * 0.05);
  const total = basePrice + addonsPrice + platformFee;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (step < 4) setStep(step + 1);
    else {
      // Submit booking
      navigate("/booking/confirmation/123");
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return selectedDate && selectedTime;
      case 2:
        return propertySize;
      case 3:
        return address.street && address.city;
      case 4:
        return paymentMethod;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate("/services")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          {step > 1 ? "Back" : "Back to Services"}
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Book Your Cleaning</h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete the steps below to schedule your cleaning service.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  s <= step
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  s <= step ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {s === 1 && "Schedule"}
                {s === 2 && "Details"}
                {s === 3 && "Address"}
                {s === 4 && "Payment"}
              </span>
              {i < 3 && (
                <div
                  className={`flex-1 h-0.5 ${
                    s < step ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEP 1: Schedule */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    Select Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Pick a Date
                    </Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Select Time
                    </Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            selectedTime === time
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 2: Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Property Size
                    </Label>
                    <RadioGroup
                      value={propertySize}
                      onValueChange={setPropertySize}
                      className="grid sm:grid-cols-2 gap-3"
                    >
                      {propertySizes.map((size) => (
                        <div key={size.value}>
                          <RadioGroupItem
                            value={size.value}
                            id={size.value}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={size.value}
                            className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 cursor-pointer peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 hover:border-slate-300 transition-all"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {size.label}
                            </span>
                            <span className="text-sm font-semibold text-blue-600">
                              N{size.price.toLocaleString()}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Bedrooms
                      </Label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setRoomCount(Math.max(1, roomCount - 1))}
                          className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">
                          {roomCount}
                        </span>
                        <button
                          onClick={() => setRoomCount(Math.min(10, roomCount + 1))}
                          className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Bathrooms
                      </Label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setBathroomCount(Math.max(1, bathroomCount - 1))
                          }
                          className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">
                          {bathroomCount}
                        </span>
                        <button
                          onClick={() =>
                            setBathroomCount(Math.min(10, bathroomCount + 1))
                          }
                          className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Add-ons
                    </Label>
                    <div className="space-y-2">
                      {addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedAddons.includes(addon.id)}
                              onCheckedChange={() => toggleAddon(addon.id)}
                            />
                            <span className="text-sm text-slate-700">
                              {addon.label}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-blue-600">
                            +N{addon.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Special Instructions
                    </Label>
                    <Textarea
                      placeholder="Any specific requirements or notes for the cleaner..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 3: Address */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Service Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Address Label</Label>
                      <div className="flex gap-2 mt-1.5">
                        {["Home", "Office", "Other"].map((label) => (
                          <button
                            key={label}
                            onClick={() =>
                              setAddress((a) => ({ ...a, label }))
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              address.label === label
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label>Street Address</Label>
                      <Input
                        placeholder="123 Admiralty Way"
                        value={address.street}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, street: e.target.value }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input
                        placeholder="Lekki"
                        value={address.city}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, city: e.target.value }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input
                        value={address.state}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, state: e.target.value }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Access Information</Label>
                      <Textarea
                        placeholder="Gate code, floor number, landmarks, etc."
                        value={address.accessInfo}
                        onChange={(e) =>
                          setAddress((a) => ({
                            ...a,
                            accessInfo: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 4: Payment */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div>
                      <RadioGroupItem
                        value="paystack"
                        id="paystack"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="paystack"
                        className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 cursor-pointer peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 hover:border-slate-300 transition-all"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Pay with Paystack
                          </p>
                          <p className="text-xs text-slate-500">
                            Card, Bank Transfer, USSD
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="flutterwave"
                        id="flutterwave"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="flutterwave"
                        className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 cursor-pointer peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 hover:border-slate-300 transition-all"
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Pay with Flutterwave
                          </p>
                          <p className="text-xs text-slate-500">
                            Card, Mobile Money, Bank Transfer
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="wallet"
                        id="wallet"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="wallet"
                        className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 cursor-pointer peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 hover:border-slate-300 transition-all"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Pay with Wallet
                          </p>
                          <p className="text-xs text-slate-500">
                            Use your CleanPro wallet balance
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-medium text-slate-900">
                      {selectedDate.toLocaleDateString("en-NG", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-medium text-slate-900">
                      {selectedTime}
                    </span>
                  </div>
                )}
                {propertySize && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Property</span>
                    <span className="font-medium text-slate-900">
                      {propertySizes.find((p) => p.value === propertySize)?.label}
                    </span>
                  </div>
                )}

                <Separator />

                {basePrice > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Base Price</span>
                      <span className="font-medium">
                        N{basePrice.toLocaleString()}
                      </span>
                    </div>
                    {addonsPrice > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Add-ons</span>
                        <span className="font-medium">
                          N{addonsPrice.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Platform Fee</span>
                      <span className="font-medium">
                        N{platformFee.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        N{total.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                  disabled={!canContinue()}
                  onClick={handleContinue}
                >
                  {step === 4 ? "Confirm & Pay" : "Continue"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Shield className="w-3 h-3" />
                  Secure payment with SSL encryption
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
