import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uploadMedia = async (file: File, preset: string): Promise<string> => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", preset);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    { method: "POST", body: data }
  );
  
  const json = await response.json();
  return json.secure_url;
};
