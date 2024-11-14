import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className="header border-b">
      <div className=" max-w-7xl mx-auto flex sticky top-0 py-2 justify-between">
        <p className=" font-semibold">Car Management Application</p>
        <SignedOut>{/* <SignInButton /> */}</SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
