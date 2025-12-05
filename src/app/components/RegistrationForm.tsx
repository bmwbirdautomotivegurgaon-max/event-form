"use client";

import React, { useState } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import {
  Star,
  ArrowRight,
  RotateCcw,
  UserPlus,
  AlertCircle,
} from "lucide-react";

export const RegistrationForm: React.FC = () => {
  type FormState = {
    name: string;
    pax: string;
    contact: string;
    email: string;
    agreeWhatsApp: boolean;
    currentCar: string;
    considerPurchase: string;
  };

  const initialFormState: FormState = {
    name: "",
    pax: "",
    contact: "",
    email: "",
    agreeWhatsApp: false,
    currentCar: "",
    considerPurchase: "",
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const paxOptions = Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} Guest${i > 0 ? "s" : ""}`,
  }));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.pax) newErrors.pax = "Please select number of guests";
    if (!formData.contact.trim())
      newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, "")))
      newErrors.contact = "Enter a valid 10-digit number";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.agreeWhatsApp)
      newErrors.agreeWhatsApp =
        "You must agree to receive event updates and your entry pass via my mail.";

    if (!formData.currentCar.trim() || formData.currentCar.trim().length < 2)
      newErrors.currentCar = "Please enter the car you are currently driving.";

    if (!formData.considerPurchase)
      newErrors.considerPurchase = "Please select an option.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (validate()) {
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.indexOf("application/json") !== -1) {
          data = await response.json();
        } else {
          // If response is not JSON (e.g. 404 HTML page), handle gracefully
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error(
            `Server returned status ${response.status}: ${response.statusText}`
          );
        }

        if (response.ok) {
          setIsSuccess(true);
        } else {
          console.error("Server API Error:", data);
          setSubmitError(
            data.message || "Failed to send registration. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Submission Error:", error);
        setSubmitError(
          error.message ||
            "Unable to connect to the server. Please check your internet connection."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setSubmitError(null);
  };

  const handleRegisterAnother = () => {
    setIsSuccess(false);
    handleReset();
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value } as any));
    setSubmitError(null);
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full lg:w-1/2 h-auto lg:h-full bg-white flex flex-col justify-center items-center relative p-8 md:p-16">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in py-12 lg:py-0">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-[#C5A059] flex items-center justify-center relative bg-[#C5A059]/5">
              <svg
                className="w-12 h-12 text-[#B08D45]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  className="animate-draw-check"
                  strokeDasharray="100"
                  d="M20 6L9 17l-5-5"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h2
              className="font-serif text-4xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-bmw-bold)" }}
            >
              Access Secured
            </h2>

            <div className="w-12 h-1 bg-[#C5A059] mx-auto rounded-full opacity-80" />

            <p className="text-gray-500 leading-relaxed">
              Thank you,
              <span className="font-semibold text-gray-900">
                {" "}
                {formData.name}
              </span>
              .
              <br />
              Your access has been secured. A confirmation message along with
              your entry code has been sent to your mail address.
              <br />
              Please bring that mail message with you when you arrive at the
              venue.
            </p>
          </div>

          <button
            onClick={handleRegisterAnother}
            className="group inline-flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-black transition-colors duration-300 mt-8 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Another Guest</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 h-auto lg:h-full bg-white flex flex-col relative lg:overflow-y-auto my-auto">
      <div className="flex-1 px-8 md:px-16 lg:px-24 py-12 md:py-20 flex flex-col justify-center max-w-2xl mx-auto w-full animate-fade-in">
        {/* Header Section */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center space-x-2 text-[#C5A059]">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase">
              Exclusive Invitation
            </span>
          </div>

          <h1
            className="font-serif text-5xl md:text-6xl text-gray-900  tracking-tight"
            style={{ fontFamily: "var(--font-bmw-bold)" }}
          >
            DHURANDHAR
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed max-w-md pt-2">
            Experience the most awaited film of the season with an evening
            curated exclusively for EO Gurugram members.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <Input
            label="Full Name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
          />

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <Select
                label="Total Pax"
                options={paxOptions}
                value={formData.pax}
                onChange={(e) => handleChange("pax", e.target.value)}
                error={errors.pax}
              />
            </div>
            <div className="w-full md:w-2/3">
              <Input
                label="Contact Number"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                error={errors.contact}
              />
            </div>
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />

          <Input
            label="Current Car You Are Driving"
            name="currentCar"
            autoComplete="off"
            value={formData.currentCar}
            onChange={(e) => handleChange("currentCar", e.target.value)}
            error={errors.currentCar}
          />

          {/* Are You Considering Purchasing a New Car? */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Are You Considering Purchasing a New Car?
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="considerPurchase"
                  value="yes"
                  checked={formData.considerPurchase === "yes"}
                  onChange={(e) =>
                    handleChange("considerPurchase", e.target.value)
                  }
                  className="w-4 h-4 accent-[#C5A059] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  Yes
                </span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="considerPurchase"
                  value="no"
                  checked={formData.considerPurchase === "no"}
                  onChange={(e) =>
                    handleChange("considerPurchase", e.target.value)
                  }
                  className="w-4 h-4 accent-[#C5A059] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  No
                </span>
              </label>
            </div>
            {errors.considerPurchase && (
              <span className="text-xs text-red-500 font-medium">
                {errors.considerPurchase}
              </span>
            )}
          </div>

          {/* WhatsApp consent checkbox */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center mt-1">
              <input
                id="agreeWhatsApp"
                type="checkbox"
                checked={formData.agreeWhatsApp}
                onChange={(e) =>
                  handleChange("agreeWhatsApp", e.target.checked)
                }
                className={`h-4 w-4 rounded border-[#C5A059] accent-[#C5A059] text-white focus:ring-0 cursor-pointer`}
              />
            </div>

            <div className="flex-1">
              <label htmlFor="agreeWhatsApp" className="text-sm text-gray-700">
                I agree to receive event updates email.
              </label>
              {errors.agreeWhatsApp && (
                <div className="text-xs text-red-500 mt-2 font-medium">
                  {errors.agreeWhatsApp}
                </div>
              )}
            </div>
          </div>

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-md flex items-start space-x-3 text-red-700 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Submission Failed</p>
                <p>{submitError}</p>
              </div>
            </div>
          )}

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                group flex-1 bg-black text-white py-4 px-6 flex items-center justify-center space-x-3
                hover:bg-gray-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                order-1 sm:order-2 cursor-pointer
              `}
            >
              <span className="font-medium tracking-wide">
                {isSubmitting ? "Securing Access..." : "Secure Your Access"}
              </span>
              {!isSubmitting && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-4 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-300 font-medium text-sm flex items-center justify-center space-x-2 order-2 sm:order-1 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          <p className="text-center text-[18px] text-gray-400 mt-2 tracking-widest uppercase">
            BMW Bird Automotive × EO Gurugram
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
