"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
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
    <>

      <div className="flex gap-x-2 ml-auto">


        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
          />
        </SignedIn>

      </div>
    </>
  )
}