import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

const LoadingSpinner = (props: Props) => {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <Loader2 className=" animate-spin w-12 h-12" />
    </div>
  );
};

export default LoadingSpinner;
