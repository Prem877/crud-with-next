'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Map plan IDs to Stripe Price IDs (replace with your actual Price IDs from Stripe Dashboard)
const priceIds = {
  starter: {
    monthly: "price_1RFXfvDEQbIv23Pq9pvhrzqn",
    yearly: "price_1RFZzGDEQbIv23PqnLj3nIVv",
  },
  pro: {
    monthly: "price_1RFXqrDEQbIv23PqrQ6axAyH",
    yearly: "price_1RFa0lDEQbIv23PqQ1quFMOp",
  },
};

export default function BillingPage() {
  const [billingInterval, setBillingInterval] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: billingInterval === "monthly" ? "$9.99" : "$99.99",
      description: "For small teams just getting started",
      features: ["Up to 500k tokens", "Chat support"],
    },
    {
      id: "pro",
      name: "Pro",
      price: billingInterval === "monthly" ? "$19.99" : "$199.99",
      description: "For growing teams",
      features: ["Up to 1M tokens", "Priority support", "Analytics"],
    },
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const priceId = priceIds[selectedPlan][billingInterval as "monthly" | "yearly"];

      // Call API route to create a checkout session
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js failed to load");
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe redirect error:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("Payment error:", error.message);
      // Optionally show an error message to the user
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Manage your Team Plan</h1>
      <p className="text-muted-foreground mb-6">
        Choose a plan that fits your team’s needs. You can upgrade or downgrade
        your plan at any time.
      </p>

      {/* Billing Interval */}
      <div className="mb-6">
        <Label>Choose your billing interval</Label>
        <RadioGroup
          value={billingInterval}
          onValueChange={setBillingInterval}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly">Billed monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="yearly" />
            <Label htmlFor="yearly">Billed yearly</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Plan Selection */}
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer ${selectedPlan === plan.id ? "border-primary" : ""
              }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{plan.price}/month</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <input
                type="radio"
                name="plan"
                value={plan.id}
                checked={selectedPlan === plan.id}
                onChange={() => setSelectedPlan(plan.id)}
                className="hidden"
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Proceed to Payment */}
      <div className="mt-6 text-center">
        <Button
          onClick={handlePayment}
          className="w-full md:w-auto"
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Payment →"}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Please note that subscribing won’t refill your tokens, this is for
          demonstration purposes only.
        </p>
      </div>
    </div>
  );
}