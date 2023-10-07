import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { error } from "console";
import { NextResponse } from "next/server";
import * as z from "zod";

const chapterSchema = z.object({
  chapterId: z.string(),
});
export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = chapterSchema.parse(body);
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });
    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter not found",
        },
        { status: 404 }
      );
    }

    const videoId = await searchYoutube(chapter.youtubeSearchQuery);

    let transcript = await getTranscript(videoId);
    const maxLength = 500;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");
    type summaryOutput = {
      summary: string;
    };

    const summaryPrompt: summaryOutput = await strict_output(
      "You are an AI capable of summarising a youtube transcript",
      "summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" +
        transcript,
      { summary: "summary of the transcript" } // this is the output we need.
    );
    const summary = summaryPrompt.summary;
    console.log(`Summary: ${summary}`);

    try {
      const questions = await getQuestionsFromTranscript(
        transcript,
        chapter.name
      );
      console.log(`Question Output: ${JSON.stringify(questions)}`);
    } catch (e) {
      console.error(error);
    }

    // await prisma.question.createMany({
    //   data: questions.map((ques) => {
    //     let options = [ques.answer, ques.option1, ques.option2, ques.option3];
    //     options = options.sort(() => Math.random() - 0.5);
    //     return {
    //       question: ques.question,
    //       answer: ques.answer,
    //       mcqOptions: JSON.stringify(options),
    //       chapterId: chapterId,
    //     };
    //   }),
    // });

    // await prisma.chapter.update({
    //   where: { id: chapterId },
    //   data: {
    //     videoId: videoId,
    //     summary: summary,
    //   },
    // });
    return NextResponse.json({ videoId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Body",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Unkown servor error",
        },
        { status: 500 }
      );
    }
  }
}
