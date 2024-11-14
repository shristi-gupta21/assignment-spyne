import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
const Header = () => {
  return (
    <header className=" border-b  h-16  ">
      <div className="px-4 xl:px-0 max-w-7xl mx-auto flex sticky top-0 h-full justify-between items-center">
        <p className=" font-semibold shrink-0 flex ">Car Management App</p>
        <div className="flex justify-evenly w-2/5 font-medium">
          <Link href="/">Home</Link>
          <Link href="/create">Create</Link>
        </div>
        <div className="flex w-2/5 items-end justify-end">
          <SignedOut>{/* <SignInButton /> */}</SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
