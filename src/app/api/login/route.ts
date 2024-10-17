// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { loginUser, verifySession } from '@/lib/auth';

export async function POST(req: Request) {
	try {
		await verifySession(req);
		return NextResponse.json({ message: 'Already logged in' }, { status: 200 });
	} catch { }

  try {
    const { email, password } = await req.json();
    const token = await loginUser(email, password);

    const response = NextResponse.json({ message: 'Login successful' });
		response.cookies.set('token', token);
		response.cookies.set('email', email);

    return response;
  } catch (error: any) {
		console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
