"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactMethod: "",
    contactInfo: "",
    game: "",
    paymentMethod: "",
    requirements: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <section className="ts-book-form bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-white">BOOK YOUR </span>
            <span className="text-accent text-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
              BOOST
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Fill in the form below and we'll get back to you within 24 hours
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border-2 border-accent/50 rounded-lg p-8 backdrop-blur-sm bg-card/30 shadow-[0_0_20px_rgba(236,72,153,0.8)]"
        >
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                Name <span className="text-accent">*</span>
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-3">
                Email <span className="text-accent">*</span>
              </label>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
              />
            </div>
          </div>

          {/* Contact Method & Contact Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                Contact Method <span className="text-accent">*</span>
              </label>
              <Select
                value={formData.contactMethod}
                onValueChange={(value) =>
                  handleSelectChange("contactMethod", value)
                }
              >
                <SelectTrigger className="bg-card border-border/50 text-muted-foreground w-full cursor-pointer">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discord">Discord</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-white font-semibold mb-3">
                Contact Info <span className="text-accent">*</span>
              </label>
              <Input
                type="text"
                name="contactInfo"
                placeholder="Your Discord ID, Telegram username"
                value={formData.contactInfo}
                onChange={handleInputChange}
                required
                className="bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
              />
            </div>
          </div>

          {/* Game & Payment Method Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                Game <span className="text-accent">*</span>
              </label>
              <Select
                value={formData.game}
                onValueChange={(value) => handleSelectChange("game", value)}
              >
                <SelectTrigger className="bg-card border-border/50 text-muted-foreground w-full cursor-pointer">
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valorant">Valorant</SelectItem>
                  <SelectItem value="arena-breakout">
                    Arena Breakout: Infinite
                  </SelectItem>
                  <SelectItem value="tft">Teamfight Tactics</SelectItem>
                  <SelectItem value="lol">League of Legends</SelectItem>
                  <SelectItem value="cs2">Counter-Strike 2</SelectItem>
                  <SelectItem value="delta-force">Delta Force</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-white font-semibold mb-3">
                Payment Method <span className="text-accent">*</span>
              </label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  handleSelectChange("paymentMethod", value)
                }
              >
                <SelectTrigger className="bg-card border-border/50 text-muted-foreground w-full cursor-pointer">
                  <SelectValue placeholder="Select payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="crypto">Crypto (USDT/BTC/ETH)</SelectItem>
                  <SelectItem value="wise">Wise</SelectItem>
                  <SelectItem value="payoneer">Payoneer</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Boosting Requirements */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">
              Boosting Requirements <span className="text-accent">*</span>
            </label>
            <textarea
              name="requirements"
              placeholder="Describe what you need (e.g., 'Boost from Silver 2 to Diamond 1', 'Win 10 ranked games', etc.)"
              value={formData.requirements}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full bg-card border border-border/50 rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-accent text-white font-bold py-8 text-lg rounded-lg cursor-pointer transition-all duration-300 hover:bg-pink-500 hover:shadow-[0_0_30px_8px_rgba(236,72,153,0.7)]"
          >
            SUBMIT ORDER
          </Button>

          {/* Disclaimer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            By submitting, you agree to our terms of service. We'll contact you
            to discuss pricing and details.
          </p>
        </form>
      </div>
    </section>
  );
}
