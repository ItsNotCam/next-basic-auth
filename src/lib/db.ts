// lib/db.js
import { FSDB } from 'file-system-db';
const db = new FSDB('./data'); // Store data in the `data` folder

export interface User {
  email: string;
  password: string;
}

export interface DBToken {
	id: string;
  email: string;
	expires: number;
}

export const validAuthToken = (token: string): boolean => {
	return db.get("authToken") === token;
}

export const deleteTokenFromDB = async (token: string) => {
	const dbToken = await db.get(`tokens.${token}`);
	if(dbToken) {
		await db.delete(`tokens.${token}`);
	} else {
		throw "no such token exists"
	}
}

export const getUsers = (): User[] => {
	return db.get('users');
}

export const getUser = (email: string): User | undefined => {
	const users: User[] = db.get('users');
	return users.find(user => user.email === email);
}

export const userExists = (email: string): boolean => {
	const users: User[] = db.get('users');
	return users.some(user => user.email === email);
}

export const addUser = (user: User) => {
	db.push('users', user);
}

export const deleteToken = (token: string) => {
	console.log("deleting token", token);	
	db.delete(`tokens.${token}`);
}

export const getToken = (token: string): DBToken | undefined => {
	return db.get(`tokens.${token}`);
}

export const hasToken = (token: string): boolean => {
	return db.has(`tokens.${token}`);
}

export const createToken = (tokenId: string, token: DBToken) => {
	db.set(`tokens.${tokenId}`, token);
}