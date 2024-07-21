import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import uuid from "react-uuid";
import * as _ from "lodash";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUUid = () => {
  return uuid();
};

export const cloneDeep = (arg) => {
  return _.cloneDeep(arg);
};
