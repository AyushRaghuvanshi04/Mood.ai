import { NextResponse } from "next/server";
import { getServerAuth } from "@/auth";

export async function GET() {
  const session = await getServerAuth();
  
  if (session) {
    return NextResponse.json({ 
      success: true, 
      message: "Already logged in",
      user: session.user 
    });
  }
  
  // For testing purposes, let's try to bypass the state cookie issue
  return NextResponse.json({ 
    success: false, 
    message: "Not logged in",
    suggestion: "Try clearing browser cookies and trying again"
  });
}

