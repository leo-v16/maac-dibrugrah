import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uploadMedia=async(f:File):Promise<string>=>{const d=new FormData();d.append("file",f);d.append("upload_preset",process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_COURSES as string);const r=await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,{method:"POST",body:d});const j=await r.json();return j.secure_url;};
