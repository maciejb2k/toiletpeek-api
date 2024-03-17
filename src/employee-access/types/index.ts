import { Socket } from 'socket.io';

export type EmployeeAccessJWT = {
  sub: string;
  iat: number;
  exp: number;
};

export type EmployeeAccessSocket = Socket & {
  isEmployeeAuthorized: boolean;
  organizationId: string;
};
