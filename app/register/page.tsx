"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Step = "form" | "otp";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agentType: "",
  });

  const [otp, setOtp] = useState("");
  const [pendingId, setPendingId] = useState("");

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setPendingId(data.pendingId);
    setStep("otp");
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendingId, otp }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Invalid OTP");
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Agent Registration</h1>
        <p className="text-gray-500 mb-6 text-sm">
          {step === "form" && "Fill in your details to get started."}
          {step === "otp" && `Enter the OTP sent to ${formData.email}`}
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {step === "form" && (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label>Agent Type</Label>
              <Select
                required
                onValueChange={(val) =>
                  setFormData({ ...formData, agentType: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Continue →"}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <Label>6-Digit OTP</Label>
              <Input
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Pay →"}
            </Button>
            <button
              type="button"
              className="text-sm text-gray-400 w-full text-center hover:text-gray-600"
              onClick={() => setStep("form")}
            >
              ← Go back
            </button>
          </form>
        )}
      </div>
    </main>
  );
}