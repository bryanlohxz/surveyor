import { supabase } from "@/supabase";
import { error } from "console";

export type Survey = {
  id: string;
  title: string;
  userId: string;
};

export type Question = {
  id: string | null;
  type: string;
  title: string;
  options: string[];
};

export const createSurvey = async (title: string) => {
  const { error, data } = await supabase
    .from("surveys")
    .insert({ title })
    .select();
  if (error) throw error;
  return data[0];
};

export const updateSurvey = async (surveyId: string, title: string) => {
  const { error, data } = await supabase
    .from("surveys")
    .update({ title })
    .eq("id", surveyId);
  if (error) throw error;
};

export const deleteSurvey = async (surveyId: string) => {
  const questionsResposne = await supabase
    .from("surveyQuestions")
    .delete()
    .eq("surveyId", surveyId);
  if (questionsResposne.error) throw questionsResposne.error;
  const surveysResponse = await supabase
    .from("surveys")
    .delete()
    .eq("id", surveyId);
  if (surveysResponse.error) throw surveysResponse.error;
};

export const updateSurveyQuestions = async (
  surveyId: string,
  questions: Question[]
) => {
  const selectResponse = await supabase
    .from("surveyQuestions")
    .select()
    .eq("surveyId", surveyId);
  if (selectResponse.error) throw selectResponse.error;
  const questionsWithQuestionNumbers = questions.map(
    (question, questionIndex) => ({
      ...question,
      questionNumber: questionIndex + 1,
    })
  );

  const newQuestionIds = questionsWithQuestionNumbers.map(
    (question) => question.id
  );
  for await (const question of selectResponse.data) {
    if (newQuestionIds.includes(question.id)) continue;
    const { error } = await supabase
      .from("surveyQuestions")
      .delete()
      .eq("id", question.id);
    if (error) throw error;
    // TODO: Delete survey question's answers as well.
  }

  for await (const question of questionsWithQuestionNumbers) {
    if (!question.id) continue;
    const { error } = await supabase
      .from("surveyQuestions")
      .update({
        title: question.title,
        type: question.type,
        questionNumber: question.questionNumber,
        options: question.type === "Text" ? null : question.options.join("\n"),
        metadata: null,
      })
      .eq("id", question.id);
    if (error) throw error;
  }
  const insertData = questionsWithQuestionNumbers
    .filter((question) => question.id == null)
    .map((question) => ({
      surveyId,
      title: question.title,
      type: question.type,
      questionNumber: question.questionNumber,
      options: question.type === "Text" ? null : question.options.join("\n"),
      metadata: null,
    }));
  const insertResponse = await supabase
    .from("surveyQuestions")
    .insert(insertData);
  if (insertResponse.error) throw insertResponse.error;
};

export const getSurveys = async (userId: string) => {
  const { error, data } = await supabase
    .from("surveys")
    .select()
    .eq("userId", userId);
  if (error) throw error;
  return data;
};

export const getSurvey = async (surveyId: string) => {
  const { error, data } = await supabase
    .from("surveys")
    .select()
    .eq("id", surveyId);
  if (error) throw error;
  return data[0];
};

export const getSurveyQuestions = async (
  surveyId: string
): Promise<Question[]> => {
  const questionsResponse = await supabase
    .from("surveyQuestions")
    .select()
    .eq("surveyId", surveyId);
  if (questionsResponse.error) throw questionsResponse.error;
  return questionsResponse.data
    .sort((a, b) => a.questionNumber - b.questionNumber)
    .map((question) => {
      return {
        id: question.id,
        title: question.title,
        type: question.type,
        options: question.options?.split("\n") || [],
      };
    });
};
