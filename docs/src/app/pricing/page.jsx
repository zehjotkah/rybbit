"use client";

import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { Check } from "lucide-react";
import { useState } from "react";

// Available event tiers for the slider
const EVENT_TIERS = [
  100_000, 250_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000,
];

// Define plan features
const PRO_FEATURES = [
  "Unlimited websites",
  "Unlimited team members",
  "Real-time analytics",
  "Custom events",
  "Funnels & user flows",
  "All features"
];

// Format price with dollar sign
function getFormattedPrice(eventLimit, isAnnual) {
  // Monthly prices from stripe.ts
  let monthlyPrice;
  if (eventLimit <= 100_000) monthlyPrice = 19;
  else if (eventLimit <= 250_000) monthlyPrice = 29;
  else if (eventLimit <= 500_000) monthlyPrice = 49;
  else if (eventLimit <= 1_000_000) monthlyPrice = 69;
  else if (eventLimit <= 2_000_000) monthlyPrice = 99;
  else if (eventLimit <= 5_000_000) monthlyPrice = 129;
  else monthlyPrice = 169; // 10M events
  
  // Annual prices are 10x monthly (2 months free)
  const annualPrice = monthlyPrice * 10;
  return {
    monthly: monthlyPrice,
    annual: annualPrice
  };
}

export default function Pricing() {
  const [eventLimitIndex, setEventLimitIndex] = useState(0); // Default to 100k (index 0)
  const [isAnnual, setIsAnnual] = useState(true);
  
  const eventLimit = EVENT_TIERS[eventLimitIndex];
  const prices = getFormattedPrice(eventLimit, isAnnual);
  
  // Handle slider changes
  function handleSliderChange(value) {
    setEventLimitIndex(value[0]);
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight pb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-400">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-neutral-300 mb-6">
            Privacy-friendly analytics with all the features you need to grow
          </p>
        </div>
        
        {/* Pricing card */}
        <div className="max-w-lg mx-auto">
          <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden">
            <div className="p-6">
              {/* Slider section */}
              <div className="mb-6">
                <div className="flex justify-between mb-3 items-center">
                  <div>
                    <h3 className="font-semibold mb-2">Events per month</h3>
                    <div className="text-3xl font-bold text-emerald-400">
                      {eventLimit.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {/* Billing toggle */}
                    <div className="flex gap-3 mb-2 text-sm">
                      <button 
                        onClick={() => setIsAnnual(false)}
                        className={`px-3 py-1 rounded-full transition-colors ${!isAnnual 
                          ? "bg-emerald-500/20 text-emerald-400 font-medium" 
                          : "text-neutral-400 hover:text-neutral-200"}`}
                      >
                        Monthly
                      </button>
                      <button 
                        onClick={() => setIsAnnual(true)}
                        className={`px-3 py-1 rounded-full transition-colors ${isAnnual 
                          ? "bg-emerald-500/20 text-emerald-400 font-medium" 
                          : "text-neutral-400 hover:text-neutral-200"}`}
                      >
                        Annual 
                        <span className="ml-1 text-xs text-emerald-500">-17%</span>
                      </button>
                    </div>
                    <div className="text-right">
                      {isAnnual ? (
                        <>
                          <span className="text-3xl font-bold">${prices.annual}</span>
                          <span className="ml-1 text-neutral-400">
                            /year
                          </span>
                          <div className="text-sm text-neutral-400">
                            ${Math.round(prices.annual / 12)}/mo
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl font-bold">${prices.monthly}</span>
                          <span className="ml-1 text-neutral-400">
                            /month
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Slider
                  defaultValue={[0]}
                  max={EVENT_TIERS.length - 1}
                  min={0}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="mb-3"
                />
                
                <div className="flex justify-between text-xs text-neutral-400">
                  {EVENT_TIERS.map((tier, index) => (
                    <span
                      key={index}
                      className={eventLimitIndex === index ? "font-bold text-emerald-400" : ""}
                    >
                      {tier >= 1_000_000 ? `${tier / 1_000_000}M` : `${tier / 1_000}K`}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {PRO_FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-400 mr-3 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link href="https://demo.rybbit.io/signup" className="w-full block">
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-3 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                  Start your 14 day free trial
                </button>
              </Link>
              
              <p className="text-center text-sm text-neutral-400 mt-4">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
          
          {/* FAQ section */}
          <div className="mt-10 space-y-6">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            
            <div className="bg-neutral-800/20 p-5 rounded-lg border border-neutral-700">
              <h4 className="font-medium mb-2">What counts as an event?</h4>
              <p className="text-neutral-300">
                An event is either a pageview or a custom event that you create on your website. Pageviews are tracked automatically, while custom events can be defined to track specific user interactions.
              </p>
            </div>
            
            <div className="bg-neutral-800/20 p-5 rounded-lg border border-neutral-700">
              <h4 className="font-medium mb-2">Can I change my plan later?</h4>
              <p className="text-neutral-300">
                Absolutely. You can upgrade, downgrade, or cancel your plan at any time through your account settings.
              </p>
            </div>
            
            <div className="bg-neutral-800/20 p-5 rounded-lg border border-neutral-700">
              <h4 className="font-medium mb-2">What happens if I go over my event limit?</h4>
              <p className="text-neutral-300">
                We'll notify you when you're approaching your limit. You can either upgrade to a higher plan or continue with your current plan (events beyond the limit won't be tracked). Remember, an event is either a pageview or a custom event you've defined.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}