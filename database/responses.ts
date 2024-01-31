import { supabase } from "@/supabase";
import { Question } from "./surveys";

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
