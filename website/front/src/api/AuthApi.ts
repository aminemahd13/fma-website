import ApiMethods from "./ApiMethods";


export const logIn = (email: string, password: string) => {
  const url = 'auth/login';
  const body = {
    email,
    password
  }
  return ApiMethods.post(url, body);
}

export const signUp = (firstName: string, lastName: string, email: string, password: string) => {
  const url = 'auth/signup';
  const body = {
    firstName,
    lastName,
    email,
    password
  };
  return ApiMethods.post(url, body);
}

export const resetPassword = (email: string) => {
  const url = 'auth/reset-password';
  const body = {
    email,
  };
  return ApiMethods.post(url, body);
}