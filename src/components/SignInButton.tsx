"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { Session } from "next-auth";

type Props = {};

const SignInButton = (props: Props) => {
  return (
    <Button
      onClick={() => {
        signIn();
      }}
      className="text-base font-bold"
    >
      Sign In
    </Button>
  );
};

export default SignInButton;
