import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { db } from './db';
const COOKIE='cataply_session';
function secret(){const v=process.env.AUTH_SECRET;if(!v)throw new Error('AUTH_SECRET is not configured');return new TextEncoder().encode(v)}
export async function createSession(userId:string){const token=await new SignJWT({userId}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('30d').sign(secret());(await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*30})}
export async function clearSession(){(await cookies()).delete(COOKIE)}
export async function getCurrentUser(){try{const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;const {payload}=await jwtVerify(token,secret());const userId=typeof payload.userId==='string'?payload.userId:null;if(!userId)return null;return db.user.findUnique({where:{id:userId},select:{id:true,name:true,email:true}})}catch{return null}}
