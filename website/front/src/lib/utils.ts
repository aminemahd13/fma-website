import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { default as c } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getUserDataFromToken(token: string | undefined) {
  try {
    return token
      ? JSON.parse(atob(token?.split('.')[1]))
      : undefined
  } catch(_) {
    return undefined
  }
}

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export const getUploadFolderName = (firstName: string, lastName: string) => {
  return firstName.toLowerCase().replace(' ', '') + '_' + lastName.toLowerCase().replace(' ', '');
}

export const generateFileName = (bytes = 6) => c.randomBytes(bytes).toString("hex")

export const getSlideshowImages = () => ([
  {src: '/slideshow/1.jpg', key: 'photo-1'},
  {src: '/slideshow/2.jpg', key: 'photo-2'},
  {src: '/slideshow/3.jpg', key: 'photo-3'},
  {src: '/slideshow/4.jpg', key: 'photo-4'},
  {src: '/slideshow/5.jpg', key: 'photo-5'},
  {src: '/slideshow/6.jpg', key: 'photo-6'},
  {src: '/slideshow/7.jpg', key: 'photo-7'},
  {src: '/slideshow/8.jpg', key: 'photo-8'},
  {src: '/slideshow/9.jpg', key: 'photo-9'},
  {src: '/slideshow/10.jpg', key: 'photo-10'},
])

export const getToken = () => {
  return localStorage.getItem('access_token');
}

export const checkToken = (token: string) => {
  const { exp } = getUserDataFromToken(token);
  return parseInt(exp) > (new Date().getTime() + 1) / 1000;
}

export const excludeFileFields = ({
  cnie,
  schoolCertificate,
  grades,
  regulations,
  parentalAuthorization,
  termsAgreement,
  ...keep
}: any) => keep

export const objectMap = (obj: any, fn: any) => {
  const newObject = {} as any;
  Object.keys(obj).forEach((key) => {
    newObject[key] = fn(obj[key]);
  });
  return newObject;
}

export const delay = (ms: number) => {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export const isBoolean = (value: any) => (typeof value === "boolean") || (value instanceof Boolean)

export const sanitizeApplication = (application: any) => {
  const newObject = {} as any;
  Object.keys(application).forEach((key) => {
    newObject[key] = (key === 'dateOfBirth')
      ? new Date(application[key])
      : application[key]===null ? "" : application[key]
  });
  return newObject;
}

export const camelCaseToText = (camel: string) => {
  const result = camel.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export const shuffle = (unshuffled: any[]) => {
  return unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
