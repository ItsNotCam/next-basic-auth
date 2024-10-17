// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { registerUser, verifySession } from '@/lib/auth';

export async function POST(req: Request) {
	try {
		await verifySession(req);
		return NextResponse.json({ error: 'Already logged in' }, { status: 200 });
	} catch { }
	
  try {
    const { email, password } = await req.json();
		if(email === undefined || password === undefined || email === "" || password === "") {
			throw "Email and password are required";
		}

    await registerUser(email, password);
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
