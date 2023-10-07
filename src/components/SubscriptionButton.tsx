"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

type Props = {
  isPro: Boolean;
};

const SubscriptionButton = ({ isPro }: Props) => {
  const { mutate: handleSubscription, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.get("/api/stripe");
      return response.data;
    },
    onSuccess: (data) => {
      console.log(JSON.stringify(data));

      window.location.href = data.url; //This will redirect to a page outside our app.
      // console.log(window.location.href);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <Button
      className="mt-4"
      disabled={isLoading}
      onClick={() => handleSubscription()}
    >
      {isPro ? "Manage Subscriptions" : "Upgrade to Pro"}
    </Button>
  );
};

export default SubscriptionButton;
