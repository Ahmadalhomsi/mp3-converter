import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const data = await req.json();
        const userId = data.userId;
        const UserType = data.UserType
        console.log(userId);
        console.log(UserType);


        await clerkClient.users.updateUserMetadata(userId, {
            unsafeMetadata: {
                "UserType": UserType,
            }
        });


        return NextResponse.json("User Metadata Updated");

    } catch (error) {
        return NextResponse.json("Errorista + " + error);
    }
}