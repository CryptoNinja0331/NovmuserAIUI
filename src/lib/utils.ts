import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import uuid from "react-uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUUid = () => {
  return uuid();
};
