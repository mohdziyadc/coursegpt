import { Chapter, Course, Unit } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const GalleryCourseCard = ({ course }: Props) => {
  return (
    <div className="rounded-lg border border-secondary">
      <div>
        <Link href={`/course/${course.id}/0/0`} className="relative w-fit">
          <Image
            src={course.thumbnailImg || ""}
            alt="course Image"
            className=" object-cover rounded-lg"
            width={400}
            height={300}
          />
          <span className="px-2 py-1 absolute bottom-2 left-2 right-2 text-white rounded-md bg-black/50 w-fit ">
            {course.name}
          </span>
        </Link>
      </div>
      <div className="p-4">
        <h4 className="text-sm text-secondary-foreground/60 ">Units</h4>
        <div className="space-y-1">
          {course.units.map((unit, unitIdx) => {
            return (
              <div key={unitIdx} className="flex flex-col underline">
                <Link href={`/course/${course.id}/${unitIdx}/0`}>
                  {unit.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GalleryCourseCard;
