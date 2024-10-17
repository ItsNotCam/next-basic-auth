// lib/auth.ts
import bcrypt from 'bcryptjs';
import { addUser, createToken, DBToken, deleteToken, getToken, getUser, getUsers, hasToken, User, userExists } from './db';
import { parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { uuid } from 'uuidv4';
import { hash } from 'crypto';

const SALT = process.env.SALT || 'super-secret';

export interface CookieToken {
	id: string;
}

// Register user
export async function registerUser(email: string, password: string): Promise<void> {
  if (userExists(email)) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, SALT);
	addUser({
		email: email,
		password: hashedPassword
	})
}


// Login user
export async function loginUser(email: string, password: string): Promise<string> {
	const user: User | undefined = getUser(email);
  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

	const id = uuid();
	const hashedId = await bcrypt.hash(id, SALT);
	const expires = Date.now() + 5 * 60 * 1000; // now + 5 minutes
	createToken(id, {
		id: hashedId,
		email: email,
		expires: expires
	});

  return id;
}

export async function verifyToken(token: string): Promise<boolean> {
	const dbToken: DBToken | undefined = getToken(token);
	if(!dbToken) {
		throw new Error('Invalid or expired session token');
	}

	if(dbToken.expires < Date.now()) {
		deleteToken(token);
		throw new Error('Session token expired');
	}

	const validToken = await bcrypt.compare(token, dbToken.id);
	if(!validToken) {
		throw new Error('Invalid or expired session token');
	}

	return true;
}

export async function verifySession(req: Request): Promise<boolean> {
	const cookieHeader = req.headers.get('cookie');
	if (!cookieHeader) {
		throw new Error('No cookies found');
	}

	const cookies = parse(cookieHeader);
	const sessionToken = cookies['token'];

	if (!sessionToken) {
		throw new Error('No session token found');
	}

	const valid = await verifyToken(sessionToken.replaceAll("\"",""));
	return valid;
}

export function logout(req: NextRequest) {
	const cookieHeader = req.headers.get('cookie');
	if (!cookieHeader) {
		throw new Error('No cookies found');
	}

	const cookies = parse(cookieHeader);
	let sessionToken = cookies['token'];

	if (!sessionToken) {
		throw new Error('No session token found');
	}

	sessionToken = sessionToken.replaceAll("\"","");
	deleteToken(sessionToken);
}