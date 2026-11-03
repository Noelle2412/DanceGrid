"use client";
import Link from "next/link";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { registerUser } from "../../api/users";

const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    try {
      setError(null);
      await registerUser(formData);
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    }
  }
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl">Register:</h2>
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
        <Label htmlFor="repeat_password">Repeat Password</Label>
        <Input
          id="repeat_password"
          name="repeat_password"
          type="password"
          placeholder="Password"
        />
        <button className="bg-secondary p-2 rounded-md">Register</button>
      </Form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-between">
        <p>Already have an account? </p>
        <Link href="/login" className="text-accent">
          Login here
        </Link>
      </div>
    </div>
  );
};
export default RegisterForm;
