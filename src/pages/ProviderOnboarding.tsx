import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  User,
  Briefcase,
  Shield,
  CreditCard,
  Award,
  Upload,
  Sparkles,
} from "lucide-react";

const steps = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Services", icon: Briefcase },
  { id: 3, label: "Verification", icon: Shield },
  { id: 4, label: "Bank Details", icon: CreditCard },
  { id: 5, label: "Review", icon: Award },
];

const servicesList = [
  "House Cleaning",
  "Deep Cleaning",
  "Office Cleaning",
  "Fumigation",
  "Laundry",
  "Car Detailing",
  "Post-Construction",
  "Event Cleanup",
];

export default function ProviderOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [accountType, setAccountType] = useState("individual");

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand rounded-lg flex items-center justify-center mx-auto mb-4 shadow-hard ">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Become a WeClean Provider
          </h1>
          <p className="text-slate-500 mt-2">
            Join Nigeria's top cleaning professionals. Earn on your schedule.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  s.id <= step
                    ? "bg-brand text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {s.id < step ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <s.icon className="w-4 h-4" />
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    s.id < step ? "bg-brand" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="border-ink/12 shadow-hard">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Personal Information
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Tell us about yourself
                  </p>
                </div>

                <div>
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={accountType}
                    onValueChange={setAccountType}
                    className="flex gap-4 mt-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="individual"
                        id="individual"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="individual"
                        className="flex items-center gap-2 px-4 py-3 rounded-md border-2 border-slate-200 cursor-pointer peer-data-[state=checked]:border-brand peer-data-[state=checked]:bg-brand-50"
                      >
                        <User className="w-4 h-4" />
                        Individual
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="company"
                        id="company"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="company"
                        className="flex items-center gap-2 px-4 py-3 rounded-md border-2 border-slate-200 cursor-pointer peer-data-[state=checked]:border-brand peer-data-[state=checked]:bg-brand-50"
                      >
                        <Briefcase className="w-4 h-4" />
                        Company
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input placeholder="John Doe" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input placeholder="+234 800 000 0000" className="mt-1.5" />
                  </div>
                </div>

                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="john@email.com"
                    className="mt-1.5"
                  />
                </div>

                {accountType === "company" && (
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      placeholder="Sparkle Clean Ltd"
                      className="mt-1.5"
                    />
                  </div>
                )}

                <div>
                  <Label>Bio / Experience</Label>
                  <Textarea
                    placeholder="Tell us about your cleaning experience..."
                    className="mt-1.5 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input placeholder="Lagos" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input placeholder="Lagos" className="mt-1.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Services */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Services You Offer
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Select all cleaning services you can provide
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {servicesList.map((service) => (
                    <button
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`p-4 rounded-md border-2 text-left transition-all ${
                        selectedServices.includes(service)
                          ? "border-brand bg-brand-50 text-brand-700"
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedServices.includes(service) && (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">{service}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    placeholder="2"
                    className="mt-1.5 max-w-[200px]"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Identity Verification
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    We need to verify your identity for trust and safety
                  </p>
                </div>

                <div>
                  <Label>ID Type</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {["NIN", "Driver's License", "Passport", "Voter's Card"].map(
                      (type) => (
                        <button
                          key={type}
                          className="p-3 rounded-md border-2 border-slate-200 hover:border-brand text-sm font-medium text-slate-600 transition-colors"
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <Label>ID Number</Label>
                  <Input placeholder="Enter your ID number" className="mt-1.5" />
                </div>

                <div>
                  <Label>Upload ID Document</Label>
                  <div className="mt-2 border-2 border-dashed border-slate-300 rounded-md p-8 text-center hover:border-brand transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      JPG, PNG, PDF up to 5MB
                    </p>
                  </div>
                </div>

                <div>
                  <Label>BVN (Bank Verification Number)</Label>
                  <Input placeholder="11-digit BVN" className="mt-1.5" maxLength={11} />
                  <p className="text-xs text-slate-500 mt-1">
                    Required for payment processing
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Bank Details */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Bank Details
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Where you'll receive your earnings
                  </p>
                </div>

                <div>
                  <Label>Bank Name</Label>
                  <Input placeholder="e.g., GTBank, Access Bank" className="mt-1.5" />
                </div>

                <div>
                  <Label>Account Number</Label>
                  <Input placeholder="10-digit account number" className="mt-1.5" />
                </div>

                <div>
                  <Label>Account Name</Label>
                  <Input placeholder="As it appears on your bank account" className="mt-1.5" />
                </div>

                <div className="bg-brand-50 rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-brand mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-brand-900">
                        Secure Payouts
                      </p>
                      <p className="text-xs text-brand-700 mt-1">
                        Your bank details are encrypted and secure. Payouts are
                        processed every Monday.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-brand" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Application Submitted!
                  </h2>
                  <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Your application is under review. We'll notify you within 24-48
                    hours. Start preparing your cleaning equipment!
                  </p>
                </div>

                <div className="bg-cream rounded-md p-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    What's Next?
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      Our team will review your application
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      Background check will be conducted
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      You'll receive onboarding training
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      Start accepting cleaning jobs!
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Navigation */}
            <div className="flex justify-between">
              {step > 1 && step < 5 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button
                  className="bg-brand hover:bg-brand-700"
                  onClick={() => setStep(step + 1)}
                >
                  {step === 4 ? "Submit Application" : "Continue"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-brand hover:bg-brand-700"
                  onClick={() => navigate("/")}
                >
                  Go to Home
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
