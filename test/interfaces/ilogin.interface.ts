export interface Ilogin {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
  accessToken: string;
  refreshToken: string;
}
