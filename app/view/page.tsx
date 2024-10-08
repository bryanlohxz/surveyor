"use client";

import Dropdown from "@/components/Dropdown";
import { PostgrestError } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import { useImmer } from "use-immer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Question, getSurvey, getSurveyQuestions } from "@/database/surveys";
import { createAnswers, createResponse } from "@/database/responses";

export default function ViewSurvey() {
  const searchParams = useSearchParams();
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);
  const [surveyResponses, setSurveyResponses] = useImmer<string[]>([]);
  const [isSurveyLoading, setIsSurveyLoading] = useState<boolean>(true);
  const [isSurveySubmitting, setIsSurveySubmitting] = useState<boolean>(false);

  useEffect(() => {
    const surveyId = searchParams.get("surveyId");
    if (!surveyId) return setIsSurveyLoading(false);

    const getSurveyDetails = async () => {
      try {
        const survey = await getSurvey(surveyId);
        setSurveyTitle(survey.title);
        const surveyQuestions = await getSurveyQuestions(surveyId);
        setSurveyQuestions(surveyQuestions);
        setSurveyResponses(surveyQuestions.map((question) => ""));
      } catch (error) {
        toast((error as PostgrestError).message, { type: "error" });
      } finally {
        setIsSurveyLoading(false);
      }
    };

    getSurveyDetails();
  }, []);

  const submitResponse = async () => {
    setIsSurveySubmitting(true);
    try {
      const { id: responseId } = await createResponse();
      await createAnswers(responseId, surveyQuestions, surveyResponses);
      toast("Response has been submitted.", { type: "success" });
    } catch (error) {
      toast((error as PostgrestError).message, { type: "error" });
      setIsSurveySubmitting(false);
    }
  };

  if (isSurveyLoading) return <div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center pb-32">
      <div className="mt-4 px-8 py-4 w-full flex justify-center">
        <h1 className="text-xl">{surveyTitle}</h1>
      </div>
      {surveyQuestions.map((question, index) => {
        const { type } = question;
        return (
          <div
            className="w-10/12 mt-8 rounded p-8 bg-white relative"
            key={question.id}
          >
            <div className="flex">
              <p className="flex items-center mr-2">{index + 1}.</p>
              <h2 className="text-lg">{question.title}</h2>
            </div>
            {type === "Text" && (
              <input
                className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`question response ${question.id}`}
                type="text"
                placeholder="Write your answer here..."
                disabled={isSurveySubmitting}
                value={surveyResponses[index]}
                onChange={(event) => {
                  setSurveyResponses((surveyResponses) => {
                    surveyResponses[index] = event.target.value;
                  });
                }}
              />
            )}
            {type === "Dropdown" && (
              <Dropdown
                className="mt-4 h-12 w-full"
                options={question.options}
                includeEmptyOption
                value={surveyResponses[index]}
                disabled={isSurveySubmitting}
                onChange={(selection) => {
                  setSurveyResponses((surveyResponses) => {
                    surveyResponses[index] = selection;
                  });
                }}
              />
            )}
            {type === "Checkboxes" && (
              <div className="mt-4 w-full">
                {question.options.map((option) => {
                  return (
                    <div className="h-12 w-full flex items-center" key={option}>
                      <input
                        className="mr-4 h-6 w-6"
                        type="checkbox"
                        id={option}
                        name={option}
                        disabled={isSurveySubmitting}
                        checked={surveyResponses[index]
                          .split(",")
                          .includes(option)}
                        onChange={(event) => {
                          setSurveyResponses((surveyResponses) => {
                            let checkedOptions: string[];
                            if (surveyResponses[index] === "")
                              checkedOptions = [];
                            else
                              checkedOptions =
                                surveyResponses[index].split(",");
                            const newOptions = checkedOptions.filter(
                              (options) => options !== option
                            );
                            if (!event.target.checked) {
                              surveyResponses[index] = newOptions.join(",");
                              return;
                            }
                            newOptions.push(option);
                            surveyResponses[index] = newOptions.join(",");
                          });
                          surveyResponses[index].split("\n").includes(option);
                        }}
                      />
                      {option}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <button
        className="w-10/12 mt-8 rounded p-4 bg-blue-200 hover:bg-blue-300 hover:cursor-pointer disabled:bg-gray-100 disabled:text-gray-300 flex justify-center align-center"
        disabled={isSurveySubmitting}
        onClick={submitResponse}
      >
        Submit
      </button>
      <ToastContainer />
    </main>
  );
}
