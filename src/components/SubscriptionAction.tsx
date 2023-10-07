"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Props = {};

const SubscriptionAction = (props: Props) => {
  const { data } = useSession();

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
    <div className="flex flex-col items-center w-1/2 mx-auto p-4 mt-4 rounded-md bg-secondary ">
      <div>{data?.user.credits} / 10 Free Generations</div>
      <Progress
        value={data?.user.credits ? (data.user.credits / 10) * 100 : 0}
        className="border border-primary mt-2"
      />
      <Button
        onClick={() => handleSubscription()}
        disabled={isLoading}
        className="mt-4 text-white transition ease-in-out delay-150  hover:scale-110  hover:-translate-y-1 bg-gradient-to-tr from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
      >
        Upgrade
        <Zap className="w-4 fill-white h-4 ml-2" />
      </Button>
    </div>
  );
};

export default SubscriptionAction;
