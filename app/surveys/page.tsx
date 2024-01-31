"use client";

import PencilIcon from "@/components/PencilIcon";
import PlusIcon from "@/components/PlusIcon";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Survey = {
  id: string;
  title: string;
};

const ListSurveys = () => {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-10/12 mt-8 rounded p-8 bg-white flex">
        <div className="flex grow items-center">hello test</div>
        <button className="h-12 w-12 flex items-center justify-center text-gray-300 bg-gray-100 hover:bg-gray-200 rounded-full">
          <PencilIcon />
        </button>
      </div>
      <div
        className="w-10/12 mt-8 rounded p-4 bg-gray-200 hover:bg-gray-300 hover:cursor-pointer flex justify-center align-center"
        onClick={() => router.push("/surveys/new")}
      >
        <PlusIcon className="stroke-gray-400" />
      </div>
    </main>
  );
};

export default ListSurveys;
