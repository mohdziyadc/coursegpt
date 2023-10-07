import GalleryCourseCard from "@/components/GalleryCourseCard";
import { prisma } from "@/lib/db";
import React from "react";

type Props = {};

const GalleryPage = async (props: Props) => {
  const courses = await prisma.course.findMany({
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
  });
  return (
    <div className="py-8 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 place-items-center">
        {courses.map((course) => {
          return (
            <div key={course.id}>
              <GalleryCourseCard course={course} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryPage;
