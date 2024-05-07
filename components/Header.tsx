"use client";

import { SignOutButton, UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";


//import { Button } from "@/components/ui/button";
import { ClerkProvider, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'



export const NavbarRoutes = () => {
  // const { userId } = useAuth();
  const pathname = usePathname();


  const isdetailsUpdatePage = pathname === "/detailsUpdate";
  const isAdminPage = pathname === "/admin";


  return (
    <div className="flex justify-end pt-1 px-1 lg:px-1">
      <SignedOut>
        <button className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-0.5 px-4 rounded">
          <SignInButton />
        </button>
      </SignedOut>
      <SignedIn>
        <div className="flex gap-x-2">
          <UserButton afterSignOutUrl="/" />
          <button className="bg-gray-500 hover:bg-blue-700 text-white font-bold px-3 rounded">
            <SignOutButton />
          </button>
        </div>
      </SignedIn>
    </div>


  );

}