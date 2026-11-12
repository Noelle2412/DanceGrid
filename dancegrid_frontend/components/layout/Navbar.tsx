"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { logoutUser } from "@/api/users";

const Navbar = () => {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [cookies, , removeCookie] = useCookies(["user"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && Boolean(cookies.user);
  const user = cookies.user;

  const handleLogout = async () => {
    try {
      if (user?.id) {
        await logoutUser(user.id);
      }
    } catch (error) {
      console.error("Backend logout error:", error);
    } finally {
      removeCookie("user", { path: "/" });
      router.push("/");
      router.refresh();
    }
  };

  return (
    <header className="bg-accent text-white p-2 flex flex-col lg:flex-row justify-between items-center">
      <span className="logo text-4xl">
        <Link href="/">DanceGrid</Link>
      </span>
      <nav className="flex flex-row gap-8 text-lg items-center">
        <Link href="/choreos">New Choreography</Link>
        {isLoggedIn ? (
          <Link href={`/user/${user.id}`}>My Choreographies</Link>
        ) : null}
        <Link href="/how_to">Help</Link>
        {isLoggedIn ? (
          <button
            className="bg-secondary rounded-md cursor-pointer p-2 hover:opacity-90 transition-opacity"
            onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Sign Up</Link>
          </>
        )}
      </nav>
      {isLoggedIn ? <p>Logged in as {user.email}</p> : null}
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
