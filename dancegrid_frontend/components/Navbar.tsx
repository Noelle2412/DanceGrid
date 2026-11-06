"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-accent text-white p-2 flex flex-row justify-between items-center">
      <span className="logo text-4xl">
        <Link href="/">DanceGrid</Link>
      </span>
      <nav className="flex flex-row gap-8 text-lg">
        <Link href="/choreos">New Choreography</Link>
        <Link href="/how_to">Help</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Sign Up</Link>
      </nav>
      <button
        className="bg-secondary text-white p-2 rounded-lg cursor-pointer"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
        {!mounted
          ? "Toggle Theme"
          : resolvedTheme === "dark"
            ? "Lightmode"
            : "Darkmode"}
      </button>
    </header>
  );
};

export default Navbar;
