import { getAuthSession } from "@/lib/auth";
import React from "react";
import { redirect } from "next/navigation";
import { InfoIcon } from "lucide-react";
import CourseForm from "@/components/CourseForm";
import { checkSubscription } from "@/lib/subscription";

export default async function Create() {
  const session = await getAuthSession();
  const isPro = await checkSubscription();

  if (!session?.user) {
    return redirect("/gallery");
  }
  return (
    <>
      <div className="flex flex-col items-start max-w-xl px-8 my-16 mx-auto sm:px-0">
        <h1 className="self-center text-4xl font-bold text-center sm:text-6xl">
          Create a course
        </h1>
        <div className="flex p-4 mt-5 bg-secondary">
          <InfoIcon className="w-12 h-12 mr-3 text-blue-400" />
          <div className="text-md sm:text-base">
            Enter in a course title, or what you want to learn about. Then enter
            a list of specific units you want to learn. Our AI will generate a
            course for you!
          </div>
        </div>
        <CourseForm isPro={isPro} />
      </div>
    </>
  );
}
