//All the params after /api/course/ are dynamic in nature
//i.e -> courseId/unitIdx/chapterIdx are all dynamic.
// That's why we are creating a catch-all route
import CourseSidebar from "@/components/CourseSidebar";
import MainVideoSummary from "@/components/MainVideoSummary";
import QuizCard from "@/components/QuizCard";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    slug: string[]; //must match what contains in the URL
  };
};

const CoursePage = async (props: Props) => {
  const [courseId, unitIdxParam, chapterIdxParam] = props.params.slug;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          chapters: {
            include: {
              questions: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return redirect("/gallery");
  }

  const unitIdx = parseInt(unitIdxParam);
  const chapterIdx = parseInt(chapterIdxParam);

  const unit = course.units[unitIdx];
  if (!unit) {
    return redirect("/gallery");
  }

  const chapter = unit.chapters[chapterIdx];
  if (!chapter) {
    return redirect("/gallery");
  }
  const prevChapter = unit.chapters[chapterIdx - 1];
  const nextChapter = unit.chapters[chapterIdx + 1];
  return (
    <div>
      <CourseSidebar course={course} currChapterId={chapter.id} />
      <div>
        <div className="ml-[400px] px-8">
          <div className="flex">
            <MainVideoSummary
              chapter={chapter}
              unitIdx={unitIdx}
              chapterIndex={chapterIdx}
            />
            <QuizCard chapter={chapter} />
          </div>
          <Separator className="flex-[1] mt-4 bg-gray-500" />
          <div className="flex flex-col sm:flex-row items-center sm:justify-between justify-center mb-4">
            {prevChapter && (
              <Link
                href={`/course/${course.id}/${unitIdx}/${chapterIdx - 1}`}
                className="flex mt-4"
              >
                <div className="flex items-center">
                  <ChevronLeft className="w-6 h-6 mr-1" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-secondary-foreground/60">
                      Previous
                    </span>
                    <span className="text-xl font-bold">
                      {prevChapter.name}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {nextChapter && (
              <Link
                href={`/course/${course.id}/${unitIdx}/${chapterIdx + 1}`}
                className="flex mt-4 "
              >
                <div className="flex items-center">
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-secondary-foreground/60">
                      Next
                    </span>
                    <span className="text-xl font-bold">
                      {nextChapter.name}
                    </span>
                  </div>
                  <ChevronRight className="w-6 h-6 ml-1" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
