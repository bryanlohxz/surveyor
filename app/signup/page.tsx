"use client";

import Link from "next/link";
import { supabase } from "@/supabase";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

  const signUpNewUser = async () => {
    try {
      setIsFormSubmitting(true);
      if (password !== confirmPassword)
        return toast("Passwords do not match.", { type: "error" });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) return toast(error.message, { type: "error" });
      router.push("/surveys");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col justify-center items-center">
      <div className="w-80 rounded p-8 bg-white relative">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            signUpNewUser();
          }}
        >
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm password"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <button
            type="submit"
            className="mt-6 w-full text-blue-500 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-300 font-medium rounded text-sm p-2.5 text-center"
            disabled={isFormSubmitting}
          >
            Sign up
          </button>
        </form>
        <div className="mt-6 text-gray-400">
          <p>
            Already have an account?{" "}
            <Link
              href="/"
              className="text-blue-300 hover:text-blue-400 underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
