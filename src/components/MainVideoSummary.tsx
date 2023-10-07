import { Chapter } from "@prisma/client";
import React from "react";

type Props = {
  chapter: Chapter;
  unitIdx: number;
  chapterIndex: number;
};

const MainVideoSummary = ({ chapter, unitIdx, chapterIndex }: Props) => {
  return (
    <div className="flex-[2] mt-14">
      <h4 className="text-sm uppercase text-secondary-foreground/60">
        Unit {unitIdx + 1} &bull; Chapter {chapterIndex + 1}
      </h4>
      <h1 className="text-4xl font-bold">{chapter.name.split(":")[1]}</h1>
      <iframe
        title="chapter video"
        className="w-full mt-4 aspect-video max-h-96"
        src={`https://www.youtube.com/embed/${chapter.videoId}`}
        allowFullScreen
      />
      <div className="mt-2 font-bold text-3xl">
        Summary
        <p className="text-secondary-foreground/75 text-base mt-2 tracking-wide leading-relaxed">
          {chapter.summary}
        </p>
      </div>
    </div>
  );
};

export default MainVideoSummary;
