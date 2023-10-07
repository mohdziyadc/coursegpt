"use client";
import { cn } from "@/lib/utils";
import { Chapter, Question } from "@prisma/client";
import React, { useCallback, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

type Props = {
  chapter: Chapter & {
    questions: Question[];
  };
};

const QuizCard = ({ chapter }: Props) => {
  // We are dealing with a list of questions. Hence we need a mapping data structure to handle this
  //mapping from question.id to current selected answer
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // mapping from question.id to correct answer or not (true, false, not answered)
  const [questionState, setQuestionState] = useState<
    Record<string, boolean | null>
  >({});
  const checkAnswers = useCallback(() => {
    const newQuesState = { ...questionState };
    chapter.questions.map((ques) => {
      const user_answer = answers[ques.id];
      if (!user_answer) return;
      if (user_answer === ques.answer) {
        newQuesState[ques.id] = true;
      } else {
        newQuesState[ques.id] = false;
      }
    });
    setQuestionState(newQuesState);
  }, [answers, chapter.questions, questionState]);

  return (
    <div className="flex-[1] mt-14 ml-8">
      <h1 className="text-2xl font-bold">Concept Check</h1>
      <div className="mt-2">
        {chapter.questions.map((ques) => {
          //our mcq options are currently is JSON format, convert it into string array
          const options = JSON.parse(ques.mcqOptions) as string[];
          return (
            <div
              key={ques.id}
              className={cn("mt-4 p-3 border border-secondary rounded-lg", {
                "bg-green-700": questionState[ques.id] === true,
                "bg-red-500": questionState[ques.id] === false,
                "bg-secondary": questionState[ques.id] === null,
              })}
            >
              <h1 className="text-lg font-semibold">{ques.question}</h1>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(e) => {
                    setAnswers((prev) => {
                      return {
                        ...prev,
                        [ques.id]: e,
                      };
                    });
                  }}
                >
                  {options.map((option, idx) => {
                    // option = option.charAt(0).toUpperCase() + option.slice(1);
                    return (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={ques.id + idx.toString()}
                        />
                        <Label htmlFor={ques.id + idx.toString()}>
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <Button className="mt-4 w-full" onClick={checkAnswers}>
        Check Answer
      </Button>
    </div>
  );
};

export default QuizCard;
