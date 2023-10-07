"use client";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

type Props = {
  chapter: Chapter;
  chapterIdx: number;
  completedChapters: Set<string>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export type ChapterCardHandler = {
  // 2. Declaring the function here.
  triggerLoad: () => void;
};

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
  (
    { chapter, chapterIdx, completedChapters, setCompletedChapters }: Props,
    ref
  ) => {
    const [success, setSuccess] = useState<boolean | null>(null);
    const { toast } = useToast();

    const addChapterIdToSet = useCallback(() => {
      setCompletedChapters((prevSet) => {
        const newSet = new Set(prevSet);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [setCompletedChapters, chapter.id]);

    const { mutate: getChapterInfo, isLoading } = useMutation({
      mutationFn: async () => {
        const response = await axios.post(
          "/api/chapter/getInfo",
          JSON.stringify({
            chapterId: chapter.id,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        // console.log(`Video Id; ${videoId}\nSummary:${summary}`);
        addChapterIdToSet();
        setSuccess(true);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          console.error(
            `Error From getInfo mutation: ${JSON.stringify(
              error.response?.data
            )}`
          );
        }
        setSuccess(false);
        toast({
          title: "Error",
          description: "There was an error generating your course",
          variant: "destructive",
        });
        addChapterIdToSet();
      },
    });

    useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet();
      }
    }, [chapter, addChapterIdToSet]);

    useImperativeHandle(ref, () => ({
      // 3. Defining the function here
      async triggerLoad() {
        if (chapter.videoId) {
          addChapterIdToSet();
          return;
        }
        getChapterInfo();
      },
    }));

    return (
      <div
        className={cn("w-full  mt-3 p-3 rounded-lg flex flex-row", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500 font-semibold": success === true,
        })}
      >
        {isLoading && <Loader2 className="flex mr-2 animate-spin" />}
        <div className="flex">{chapter.name}</div>
      </div>
    );
  }
);

ChapterCard.displayName = "Chapter Card";
export default ChapterCard;
