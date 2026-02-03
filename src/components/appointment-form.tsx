"use client";

import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function AppointmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step === currentStep
                  ? "bg-white text-fuchsia-950"
                  : step < currentStep
                    ? "bg-fuchsia-300 text-fuchsia-950"
                    : "bg-fuchsia-950/50 text-white/50"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-fuchsia-950/50 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Personal Information
            </h2>
            <div>
              <label
                htmlFor="firstName"
                className="block text-white mb-2 font-medium"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-white mb-2 font-medium"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter your last name"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Contact Information
            </h2>
            <div>
              <label
                htmlFor="email"
                className="block text-white mb-2 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-white mb-2 font-medium"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Confirm Your Information
            </h2>
            <div className="space-y-4 bg-white/5 rounded-lg p-6">
              <div className="border-b border-white/20 pb-3">
                <p className="text-white/70 text-sm mb-1">First Name</p>
                <p className="text-white text-lg font-medium">
                  {formData.firstName || "Not provided"}
                </p>
              </div>
              <div className="border-b border-white/20 pb-3">
                <p className="text-white/70 text-sm mb-1">Last Name</p>
                <p className="text-white text-lg font-medium">
                  {formData.lastName || "Not provided"}
                </p>
              </div>
              <div className="border-b border-white/20 pb-3">
                <p className="text-white/70 text-sm mb-1">Email</p>
                <p className="text-white text-lg font-medium">
                  {formData.email || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Phone</p>
                <p className="text-white text-lg font-medium">
                  {formData.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            currentStep === 1
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
          }`}
        >
          Back
        </button>
        {currentStep < totalSteps ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-lg font-semibold bg-white text-fuchsia-950 hover:bg-white/90 transition-all"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg font-semibold bg-white text-fuchsia-950 hover:bg-white/90 transition-all"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
