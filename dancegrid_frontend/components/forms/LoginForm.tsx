"use client";
import Link from "next/link";
import Form from "next/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { loginUser } from "../../api/users";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    try {
      setError(null);
      await loginUser(formData);
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl">Log in:</h2>
      <Form action={handleSubmit} className="flex flex-col gap-4">
        <Label htmlFor="email">Email or username</Label>
        <Input
          id="email"
          name="email"
          type="text"
          placeholder="Username or Email"
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
        />
        <button className="bg-secondary p-2 rounded-md">Log In</button>
      </Form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-between">
        <p> Don't have an account? </p>
        <Link href="/register" className="text-accent">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
