'use server';
import { cookies } from 'next/headers';

export const changeSectionCookie = (proposal: string, value: string) => cookies().set(`${proposal}:selected-section`, value);
