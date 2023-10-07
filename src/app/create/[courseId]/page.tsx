import ConfirmChapters from "@/components/ConfirmChapters";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    courseId: string;
  };
};

const CreateChapters = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/gallery");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: props.params.courseId,
    },
    //SQL Joins -> Returns the entire JSON string with units & chapters
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/create");
  }

  return (
    <div className="flex flex-col max-w-xl items-start my-16 mx-auto ">
      <h5 className="text-sm uppercase text-secondary-foreground/80">
        Course Name
      </h5>
      <h1 className="text-5xl font-bold">{course.name}</h1>

      <div className="flex p-4 mt-5 bg-secondary rounded-lg">
        <Info className="w-12 h-12 mr-3 my-auto text-blue-400" />
        <div className="text-sm sm:text-base">
          We generated chapters for each of your units. Look over them and then
          click the button to confirm and continue
        </div>
      </div>
      <ConfirmChapters course={course} />
    </div>
  );
};

export default CreateChapters;
