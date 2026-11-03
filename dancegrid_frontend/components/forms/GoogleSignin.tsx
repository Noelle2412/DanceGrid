"use client";
const GoogleSignin = () => {
  return (
    <a
      href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
      className="flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-md hover:bg-muted">
      Sign in with Google
    </a>
  );
};

export default GoogleSignin;
