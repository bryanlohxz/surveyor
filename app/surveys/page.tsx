"use client";

import ArrowDownTrayIcon from "@/components/ArrowDownTrayIcon";
import PencilIcon from "@/components/PencilIcon";
import PlusIcon from "@/components/PlusIcon";
import ShareIcon from "@/components/ShareIcon";
import TrashIcon from "@/components/TrashIcon";
import { AuthContext } from "@/context/AuthContext";
import { deleteSurvey, getSurveys, Survey } from "@/database/surveys";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { getResponses } from "@/database/responses";
import { PostgrestError } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const csvConfig = mkConfig({ useKeysAsHeaders: true });

const ListSurveys = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [isSurveysLoading, setIsSurveysLoading] = useState<boolean>(true);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  useEffect(() => {
    getSurveys(auth?.user.id || "")
      .then((data) => {
        setIsSurveysLoading(false);
        setSurveys(data);
      })
      .catch((error: unknown) => {
        toast((error as PostgrestError).message, { type: "error" });
        setIsSurveysLoading(false);
      });
  }, []);

  const handleShareSurvey = async (surveyId: string) => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/view?surveyId=${surveyId}`
    );
    alert(`To respond to the survey, visit the link copied to your clipboard.`);
  };

  const handleExportToCsv = async (surveyId: string) => {
    try {
      setIsActionLoading(true);
      const surveyResponses = await getResponses(surveyId);
      const csv = generateCsv(csvConfig)(surveyResponses.data);
      download(csvConfig)(csv);
    } catch (error) {
      toast((error as PostgrestError).message, { type: "error" });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isSurveysLoading) return <div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center">
      {surveys.map((survey) => {
        return (
          <div
            className="w-10/12 mt-8 rounded p-8 bg-white flex"
            key={survey.id}
          >
            <div className="flex grow items-center">{survey.title}</div>
            <button
              className="h-12 w-12 flex items-center justify-center text-blue-300 bg-blue-100 hover:bg-blue-200 rounded-full disabled:bg-gray-100 disabled:text-gray-300"
              disabled={isActionLoading}
              onClick={() => router.push(`/surveys/edit?surveyId=${survey.id}`)}
            >
              <PencilIcon />
            </button>
            <button
              className="ml-3 h-12 w-12 flex items-center justify-center text-blue-300 bg-blue-100 hover:bg-blue-200 rounded-full disabled:bg-gray-100 disabled:text-gray-300"
              onClick={() => handleShareSurvey(survey.id)}
            >
              <ShareIcon />
            </button>
            <button
              className="ml-3 h-12 w-12 flex items-center justify-center text-blue-300 bg-blue-100 hover:bg-blue-200 rounded-full disabled:bg-gray-100 disabled:text-gray-300"
              onClick={() => handleExportToCsv(survey.id)}
            >
              <ArrowDownTrayIcon />
            </button>
            <button
              type="button"
              className="ml-6 text-red-300 bg-red-100 hover:bg-red-200 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center disabled:bg-gray-100 disabled:text-gray-300"
              disabled={isActionLoading}
              onClick={async () => {
                try {
                  setIsActionLoading(true);
                  await deleteSurvey(survey.id);
                  location.reload();
                } catch (error) {
                  toast((error as PostgrestError).message, { type: "error" });
                  setIsActionLoading(false);
                }
              }}
            >
              <TrashIcon />
            </button>
          </div>
        );
      })}
      <div
        className="w-10/12 mt-8 rounded p-4 bg-gray-200 hover:bg-gray-300 hover:cursor-pointer flex justify-center align-center"
        onClick={() => {
          if (isActionLoading) return;
          router.push("/surveys/edit");
        }}
      >
        <PlusIcon className="stroke-gray-400" />
      </div>
      <ToastContainer />
    </main>
  );
};

export default ListSurveys;
