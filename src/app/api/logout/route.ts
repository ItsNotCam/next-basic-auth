// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logout, verifySession } from '@/lib/auth';
import { error } from 'console';

export async function POST(req: NextRequest) {
	try {
		await verifySession(req);
	} catch {
		return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
	}

	try {
		logout(req);
	} catch {
		return NextResponse.json({ error: 'Logout failed' }, { status: 400 });
	}
	const response = NextResponse.json({ message: 'Logout successful' });
	response.cookies.delete('token');
	response.cookies.delete('email');
	return response;
}
