import { supabase } from "@/supabase";
import { Question, getSurvey, getSurveyQuestions } from "./surveys";

export const createResponse = async () => {
  const { error, data } = await supabase.from("responses").insert({}).select();
  if (error) throw error;
  return data[0];
};

export const createAnswers = async (
  responseId: string,
  questions: Question[],
  answers: string[]
) => {
  let index = 0;
  for await (const question of questions) {
    const answer = answers[index];
    index++;
    const { error } = await supabase
      .from("answers")
      .insert({ responseId, questionId: question.id as string, answer });
    if (error) throw error;
  }
};

export const getResponses = async (surveyId: string) => {
  const [survey, surveyQuestions] = await Promise.all([
    getSurvey(surveyId),
    getSurveyQuestions(surveyId),
  ]);
  const surveyQuestionIds = surveyQuestions.map((question) => question.id);
  const { error, data: answers } = await supabase
    .from("answers")
    .select()
    .in("questionId", surveyQuestionIds);
  if (error) throw error;
  const results: { [key: string]: { [key: string]: string } } = {};
  answers.forEach(({ responseId, questionId, answer }) => {
    const response = results[responseId];
    if (!response) results[responseId] = {};
    const questionTitle = surveyQuestions.find(
      (question) => question.id === questionId
    )?.title;
    if (questionTitle) {
      results[responseId][questionTitle] = answer;
    }
  });
  return {
    title: survey.title,
    data: Object.values(results),
  };
};
