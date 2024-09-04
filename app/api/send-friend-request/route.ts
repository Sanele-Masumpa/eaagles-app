import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        console.debug("Starting POST request to /api/send-friend-request");

        // Get the current user from Clerk
        const user = await currentUser();
        if (!user) {
            console.error("No user found. Please log in.");
            return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
        }

        console.debug(`Current User ID from Clerk: ${user.id}`);

        // Parse JSON from the request body
        const { receiverId }: { receiverId?: string } = await request.json();
        if (!receiverId) {
            console.debug("Receiver ID is required");
            return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
        }

        // Ensure the sender and receiver IDs are not the same
        if (user.id === receiverId) {
            console.debug("Attempted to send a friend request to oneself");
            return NextResponse.json({ error: "You cannot send a friend request to yourself" }, { status: 400 });
        }

        // Find sender and receiver users by clerkId
        console.debug("Fetching sender and receiver users from database");

        const senderUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        const receiverUser = await prisma.user.findUnique({
            where: { clerkId: receiverId },
        });

        console.debug(`Sender User: ${JSON.stringify(senderUser)}`);
        console.debug(`Receiver User: ${JSON.stringify(receiverUser)}`);

        if (!senderUser || !receiverUser) {
            console.error("Sender or receiver user not found");
            return NextResponse.json({ error: "Sender or receiver user not found" }, { status: 404 });
        }

        // Check if the friend request already exists
        console.debug("Checking for existing friend request");

        const existingRequest = await prisma.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: senderUser.id,
                    receiverId: receiverUser.id,
                },
            },
        });

        console.debug(`Existing Request: ${JSON.stringify(existingRequest)}`);

        if (existingRequest) {
            console.debug("Friend request already exists");
            return NextResponse.json({ error: "Friend request already exists" }, { status: 400 });
        }

        // Create a new friend request
        console.debug("Creating new friend request");

        const newRequest = await prisma.friendRequest.create({
            data: {
                senderId: senderUser.id,
                receiverId: receiverUser.id,
            },
        });

        console.debug(`New Request: ${JSON.stringify(newRequest)}`);

        return NextResponse.json({ message: 'Friend request sent successfully', request: newRequest });
    } catch (error) {
        console.error('Error sending friend request:', error);
        return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 });
    }
}
