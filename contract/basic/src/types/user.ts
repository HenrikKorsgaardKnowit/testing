import { z } from "zod";

export interface User {
    id?:number;
    userName?:string;
    password?:string;
}

const zUser = z.object({
  id: z.number().int().optional(),
  userName: z.union([
        z.string(),
        z.null()
  ]).optional(),
  password: z.union([
      z.string(),
      z.null()
  ]).optional()
});

export const parseUser = (data:any):User => {
  const user = zUser.parse(data);
  return user as User;
}





