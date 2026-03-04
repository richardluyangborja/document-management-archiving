import { JWTPayload } from "jose";
import { Role } from "./generated/prisma/enums";

export interface SessionPayload extends JWTPayload {
  userId: string;
  role: Role;
}
