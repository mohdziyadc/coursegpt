import { Chapter, Course, Unit } from "@prisma/client";
import React from "react";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  currChapterId: string;
};

const CourseSidebar = ({ course, currChapterId }: Props) => {
  return (
    <div className="w-[400px] absolute top-1/2 -translate-y-1/2 p-8 rounded-r-3xl bg-secondary">
      <div className="text-4xl font-bold">{course.name}</div>
      {course.units.map((unit, unitIdx) => {
        return (
          <div key={unit.id} className="mt-4">
            <h2 className="text-sm uppercase text-secondary-foreground/60">
              Unit {unitIdx + 1}
            </h2>
            <h2 className="text-2xl font-semibold">
              {unit.name.split(":")[1]}
            </h2>
            {unit.chapters.map((chapter, chapterIdx) => (
              <div key={chapter.id}>
                <Link
                  href={`/course/${course.id}/${unitIdx}/${chapterIdx}`}
                  className={cn("text-secondary-foreground/60", {
                    "font-bold text-green-500": currChapterId === chapter.id,
                  })}
                >
                  {chapter.name.split(":")[1]}
                </Link>
              </div>
            ))}
            <Separator className="bg-gray-500 mt-2" />
          </div>
        );
      })}
    </div>
  );
};

export default CourseSidebar;
