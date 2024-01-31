"use client";

import CrossIcon from "@/components/CrossIcon";
import Dropdown from "@/components/Dropdown";
import FloppyDiskIcon from "@/components/FloppyDiskIcon";
import PlusIcon from "@/components/PlusIcon";
import { PostgrestError } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import { useImmer } from "use-immer";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Question,
  createSurvey,
  getSurvey,
  getSurveyQuestions,
  updateSurvey,
  updateSurveyQuestions,
} from "@/database/surveys";
import ArrowLeftIcon from "@/components/ArrowLeftIcon";

const DEFAULT_QUESTION: Question = {
  id: null,
  type: "Text",
  title: "",
  options: [],
};

export default function EditSurvey() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useImmer<Question[]>([DEFAULT_QUESTION]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSurveyLoading, setIsSurveyLoading] = useState<boolean>(true);

  useEffect(() => {
    const surveyId = searchParams.get("surveyId");
    if (!surveyId) return setIsSurveyLoading(false);

    const getSurveyDetails = async () => {
      try {
        const survey = await getSurvey(surveyId);
        setTitle(survey.title);
        const surveyQuestions = await getSurveyQuestions(surveyId);
        setQuestions(surveyQuestions);
      } catch (error) {
        toast((error as PostgrestError).message, { type: "error" });
      } finally {
        setIsSurveyLoading(false);
      }
    };

    getSurveyDetails();
  }, []);

  const saveSurvey = async () => {
    try {
      setIsSaving(true);
      let surveyId = searchParams.get("surveyId");
      if (!surveyId) {
        const data = await createSurvey(title);
        surveyId = data.id;
      } else {
        await updateSurvey(surveyId, title);
      }
      await updateSurveyQuestions(surveyId, questions);
      router.push("/surveys");
    } catch (error: unknown) {
      toast((error as PostgrestError).message, { type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isSurveyLoading) return <div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center">
      <button
        type="button"
        className="text-blue-300 bg-blue-100 hover:bg-blue-200 font-medium rounded-full text-sm p-4 text-center inline-flex items-center fixed right-8 bottom-8"
        onClick={saveSurvey}
        disabled={isSaving}
      >
        <FloppyDiskIcon />
      </button>
      <div className="mt-4 px-8 py-4 w-full flex">
        <button
          type="button"
          className="mr-3 text-gray-400 bg-gray-100 hover:bg-gray-200 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
          onClick={() => router.push("/surveys")}
          disabled={isSaving}
        >
          <ArrowLeftIcon />
        </button>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="survey title"
          type="text"
          placeholder="Survey Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSaving}
        />
      </div>
      {questions.map((question, questionIndex) => {
        const { type } = question;
        return (
          <div
            className="w-10/12 mt-8 rounded p-8 bg-white relative"
            key={question.id ?? questionIndex}
          >
            <button
              type="button"
              className="text-red-300 bg-red-100 hover:bg-red-200 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
              onClick={() => {
                setQuestions((prevQuestions) => {
                  prevQuestions.splice(questionIndex, 1);
                });
              }}
              disabled={isSaving}
            >
              <CrossIcon />
            </button>
            <div className="flex">
              <p className="flex items-center mr-2">{questionIndex + 1}.</p>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="question title"
                type="text"
                placeholder="Question Title"
                value={question.title}
                onChange={(event) => {
                  setQuestions((prevQuestions) => {
                    const question = prevQuestions[questionIndex];
                    question.title = event.target.value;
                  });
                }}
                disabled={isSaving}
              />
              <Dropdown
                className="ml-4"
                name="question type"
                value={questions[questionIndex].type}
                options={["Text", "Dropdown", "Checkboxes"]}
                disabled={isSaving}
                onChange={(option) => {
                  setQuestions((prevQuestions) => {
                    const question = prevQuestions[questionIndex];
                    if (option === "Text") {
                      prevQuestions[questionIndex] = {
                        id: question.id,
                        type: "Text",
                        title: question.title,
                        options: [],
                      };
                      return;
                    }
                    prevQuestions[questionIndex] = {
                      id: question.id,
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
                      disabled={isSaving}
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
                    if (isSaving) return;
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
          if (isSaving) return;
          setQuestions((prevQuestions) => [...prevQuestions, DEFAULT_QUESTION]);
        }}
      >
        <PlusIcon className="stroke-gray-400" />
      </div>
      <ToastContainer />
    </main>
  );
}
