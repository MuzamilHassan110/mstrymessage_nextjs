"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="shadow-md p-4 bg-[#101524]">
      <div className="container max-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0 text-white">
          Mystry Message
        </a>
        {session ? (
          <>
            <span className="mr-4 text-white font-normal text-xl">
              Welcome " {user?.username || user?.email} "
            </span>
            <Button className="w-full md:w-auto" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link className="text-white font-normal text-xl" href={"/sign-in"}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
