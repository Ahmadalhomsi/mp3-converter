"use client";

import { SignOutButton, UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";


//import { Button } from "@/components/ui/button";
import { ClerkProvider, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'



export const NavbarRoutes = () => {
  // const { userId } = useAuth();
  const pathname = usePathname();


  const isTTSPage = pathname === "/tts";


  return (
    <div className="flex justify-end pt-1 px-1 lg:px-1 gap-1">



      {isTTSPage ? (
        <Link href="/" className="bg-gray-800 hover:bg-blue-900 text-white font-bold py-1 px-6 rounded">

          Exit

        </Link>
      ) : (
        <Link href="/tts" className="bg-gray-800 hover:bg-blue-900 text-white font-bold py-1 px-6 rounded ">

          Go to TTS Page

        </Link>
      )}


      <SignedOut>
        <button className="bg-gray-800 hover:bg-blue-900 text-white font-bold py-1 px-6 rounded ">
          <SignInButton />
        </button>
      </SignedOut>
      <SignedIn>
        <div className="flex gap-x-2">

          <button className="bg-gray-800 hover:bg-blue-900 text-white font-bold px-3 rounded">
            <SignOutButton />
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>


  );

}