"use client";

import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

  return (
    <main className="flex min-h-screen flex-col justify-center items-center">
      <div className="w-80 rounded p-8 bg-white relative">
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
          type="button"
          className="mt-6 w-full text-blue-500 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-300 font-medium rounded text-sm p-2.5 text-center"
          disabled={isFormSubmitting}
          onClick={() => {
            setIsFormSubmitting(true);
          }}
        >
          Sign up
        </button>
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
    </main>
  );
}
