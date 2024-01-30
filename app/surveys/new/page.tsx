"use client";

import CrossIcon from "@/components/CrossIcon";
import Dropdown from "@/components/Dropdown";
import PlusIcon from "@/components/PlusIcon";
import { useImmer } from "use-immer";
import { useState } from "react";

type QuestionText = {
  type: "Text";
  title: string;
};
type QuestionDropdown = {
  type: "Dropdown";
  title: string;
  options: string[];
};
type QuestionCheckboxes = {
  type: "Checkboxes";
  title: string;
  options: string[];
};
type Question = QuestionText | QuestionDropdown | QuestionCheckboxes;

const DEFAULT_QUESTION: Question = {
  type: "Text",
  title: "",
};

export default function NewSurvey() {
  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useImmer<Question[]>([DEFAULT_QUESTION]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="mt-4 px-8 py-4 w-full">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="survey title"
          type="text"
          placeholder="Survey Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      {questions.map((question, questionIndex) => {
        const { type } = question;
        return (
          <div
            className="w-10/12 mt-8 rounded p-8 bg-white relative"
            key={questionIndex}
          >
            <button
              type="button"
              className="text-red-300 bg-red-100 hover:bg-red-200 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
              onClick={() => {
                setQuestions((prevQuestions) => {
                  prevQuestions.splice(questionIndex, 1);
                });
              }}
            >
              <CrossIcon />
            </button>
            <div className="flex">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="question title"
                type="text"
                placeholder="Question Title"
                onChange={(event) => {
                  setQuestions((prevQuestions) => {
                    const question = prevQuestions[questionIndex];
                    question.title = event.target.value;
                  });
                }}
              />
              <Dropdown
                name="question type"
                value={questions[questionIndex].type}
                options={["Text", "Dropdown", "Checkboxes"]}
                onChange={(option) => {
                  setQuestions((prevQuestions) => {
                    const question = prevQuestions[questionIndex];
                    if (option === "Text") {
                      prevQuestions[questionIndex] = {
                        type: "Text",
                        title: question.title,
                      };
                      return;
                    }
                    prevQuestions[questionIndex] = {
                      type: option === "Dropdown" ? "Dropdown" : "Checkboxes",
                      title: question.title,
                      options:
                        question.type === "Text" ? [""] : question.options,
                    };
                  });
                }}
              />
            </div>
            {(type === "Dropdown" || type === "Checkboxes") && (
              <>
                {question.options.map((option, optionIndex) => {
                  return (
                    <input
                      key={optionIndex}
                      className="shadow appearance-none border rounded w-full mt-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Option"
                      value={option}
                      onChange={(event) => {
                        setQuestions((prevQuestions) => {
                          const question = prevQuestions[questionIndex];
                          if (question.type === "Text") return;
                          question.options[optionIndex] = event.target.value;
                        });
                      }}
                    />
                  );
                })}
                <div
                  className="mt-4 rounded p-2 bg-gray-200 hover:bg-gray-300 hover:cursor-pointer flex justify-center align-center"
                  onClick={() => {
                    setQuestions((prevQuestions) => {
                      const question = prevQuestions[questionIndex];
                      if (question.type === "Text") return;
                      question.options.push("");
                    });
                  }}
                >
                  <PlusIcon className="stroke-gray-400" />
                </div>
              </>
            )}
          </div>
        );
      })}
      <div
        className="w-10/12 mt-8 rounded p-4 bg-gray-200 hover:bg-gray-300 hover:cursor-pointer flex justify-center align-center"
        onClick={() => {
          setQuestions((prevQuestions) => [...prevQuestions, DEFAULT_QUESTION]);
        }}
      >
        <PlusIcon className="stroke-gray-400" />
      </div>
    </main>
  );
}
