import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import { strict_output } from "./gpt";

export async function searchYoutube(searchQuery: string) {
  //encode string into URI string
  searchQuery = encodeURIComponent(searchQuery);

  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&q=${searchQuery}&type=video&videoDefinition=high&videoDuration=medium&videoEmbeddable=true&maxResults=5&videoCaption=closedCaption&regionCode=US`
  );

  if (!data || data.items[0] == undefined) {
    console.log("Youtube API request failed!");
    return;
  }
  return data.items[0].id.videoId;
}

export async function getTranscript(videoId: string) {
  try {
    const transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
      country: "us",
    });
    let transcript = "";
    for (const t of transcript_arr) {
      transcript += t.text + " ";
    }
    transcript.replaceAll("\n", "");
    return transcript;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function getQuestionsFromTranscript(
  transcript: string,
  chapter_title: string
) {
  type QuestionOutput = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
  }[];

  const questions: QuestionOutput = await strict_output(
    "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words",
    new Array(3).fill(
      `You are to generate three random hard mcq questions about ${chapter_title} with context of the following transcript: ${transcript}. All the questions must have information about the answer.`
    ),
    {
      question: "question",
      answer: "answer to the question with max length of 15 words",
      option1: "option1 with max length of 15 words",
      option2: "option2 with max length of 15 words",
      option3: "option3 with max length of 15 words",
    }
  );
  return questions;
}
