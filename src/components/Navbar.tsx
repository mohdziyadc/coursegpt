import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";

type Props = {};

//Navbar is a server component.
const Navbar = async (props: Props) => {
  const session = await getAuthSession();
  return (
    <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-10 h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-center sm:justify-between h-full gap-2 px-8 mx-auto max-w-7xl ">
        {/* Cool AF */}
        <Link href={"/gallery"} className="items-center hidden gap-2 sm:flex">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
            CourseGPT
          </p>
        </Link>
        <div className="flex items-center gap-3">
          <Link href={"/gallery"} className="mr-3">
            Gallery
          </Link>
          {session?.user && (
            <>
              <Link href={"/create"} className="mr-3">
                Create
              </Link>
              <Link href={"/settings"} className="mr-3">
                Settings
              </Link>
            </>
          )}
          <ThemeToggle className="mr-3" />
          <div className="flex items-center ">
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

//when using fixed use layout Utilities for controlling the placement of positioned elements.
