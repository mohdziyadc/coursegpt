"use client";
import React, { useMemo, useRef, useState } from "react";
import { Course, Unit, Chapter } from "@prisma/client";
import ChapterCard, { ChapterCardHandler } from "./ChapterCard";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const ConfirmChapters = ({ course }: Props) => {
  const chapterRefs: Record<string, React.RefObject<ChapterCardHandler>> = {};
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      // eslint-disabled-next-line react-hooks/rules-of-hooks
      chapterRefs[chapter.id] = useRef(null);
    });
  });

  /**
   * For total chapter count
   * With the for-of loop, we think about the solution iteratively.
     With reduce, we think about the solution declaratively. We're writing more maintainable code.
   */
  const totalChapterCount = useMemo(() => {
    // This could be a slow function
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);

  console.log(`Total Chapters: ${totalChapterCount}`);
  return (
    <div className="w-full mt-4">
      <div>
        {course.units.map((unit, unitIdx) => {
          return (
            <div key={unit.id} className="mt-5">
              <h2 className="text-sm uppercase text-secondary-foreground/90">
                Unit {unitIdx + 1}
              </h2>
              <h3 className="text-2xl font-bold">{unit.name.split(":")[1]}</h3>
              <div className="mt-3">
                {unit.chapters.map((chapter, chapterIdx) => {
                  return (
                    <ChapterCard
                      ref={chapterRefs[chapter.id]}
                      completedChapters={completedChapters}
                      setCompletedChapters={setCompletedChapters}
                      key={chapter.id}
                      chapter={chapter}
                      chapterIdx={chapterIdx}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex w-full items-center justify-center mt-4">
        <Separator className="flex-[1]" />
        <div className="flex items-center justify-center mx-4">
          <Link
            href={"/create"}
            className={buttonVariants({ variant: "secondary" })}
          >
            <ChevronLeft className="w-4 h-4 mr-2" strokeWidth={4} />
            Back
          </Link>
          {totalChapterCount === completedChapters.size ? (
            <div className="ml-2">
              <Link
                href={`/course/${course.id}/0/0`} // Unit 0, Chapter 0
                className={buttonVariants({ variant: "default" })}
              >
                Save & Continue <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ) : (
            <Button
              className="ml-2 font-semibold"
              onClick={() => {
                setLoading(true);
                Object.values(chapterRefs).forEach((ref) => {
                  // Binding the triggerLoad() function to each of the ChapterCard component.
                  ref.current?.triggerLoad();
                });
              }}
              disabled={loading}
            >
              Generate <ChevronRight className="h-4 w-4 ml-2" strokeWidth={4} />
            </Button>
          )}
        </div>
        <Separator className="flex-[1]" />
      </div>
    </div>
  );
};

export default ConfirmChapters;
