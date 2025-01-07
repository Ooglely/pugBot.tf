import { createId } from "@paralleldrive/cuid2";
import { addSession } from "./database";

export interface SessionData {
  _id?: string;
  sessionID: string;
  expiresAt: Date;
  userData: UserData;
}

export interface UserData {
  steam?: {
    id: string;
    data?: any;
  };
  discord?: {
    id: string;
    data?: any;
  };
}

export async function createSession(userData: UserData) {
  let sessionID = createId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14);

  await addSession({
    sessionID,
    expiresAt,
    userData,
  });

  return sessionID;
}
