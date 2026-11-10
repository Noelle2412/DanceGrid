"use client";
import Link from "next/link";
import Form from "next/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { loginUser } from "../../api/users";

const LoginForm = () => {
  const router = useRouter();
  const [, setCookie] = useCookies(["user"]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    try {
      setError(null);
      const data = await loginUser(formData);
      // Store user information in the 'user' cookie
      // data could be { user: { ... }, token: "..." } or user object directly depending on backend
      const userData = data?.user || data;
      setCookie("user", userData, { path: "/", maxAge: 60 * 60 * 24 * 7 }); // 7 days
      router.push("/");
      router.refresh();
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
        <button className="bg-secondary p-2 rounded-md cursor-pointer">
          Log In
        </button>
      </Form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-between">
        <p> Don&apos;t have an account? </p>
        <Link href="/register" className="text-accent">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
