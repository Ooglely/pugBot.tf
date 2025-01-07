import { MongoClient } from "mongodb";
import { DB_URL } from "./consts";
import type { SessionData, UserData } from "./auth";

var client = new MongoClient(DB_URL);
var db = client.db("website");
var sessions_db = db.collection("sessions");
var state_db = db.collection("state");

export async function addSession(session: SessionData) {
  await sessions_db.insertOne({
    sessionID: session.sessionID,
    expiresAt: session.expiresAt,
    userData: session.userData,
  });
}

export async function updateSession(sessionID: string, userData: UserData = null) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14);

  if (userData) {
    await sessions_db.updateOne({ sessionID: sessionID }, { $set: { expiresAt: expiresAt, userData: userData } });
  } else {
    await sessions_db.updateOne({ sessionID: sessionID }, { $set: { expiresAt: expiresAt } });
  }
}

export async function getUser(sessionID: string) {
  let user_session = await sessions_db.findOne({ sessionID: sessionID });
  if (user_session) {
    if (user_session.expiresAt < new Date()) {
      await sessions_db.deleteOne({ sessionID: sessionID });
      return null;
    } else {
      return user_session;
    }
  } else {
    return null;
  }
}

export async function addState(state: string) {
  await state_db.insertOne({ state: state });
}

export async function checkState(state: string) {
  // This will check if the state is in the db then delete it
  let result = await state_db.findOne({ state: state });
  if (result) {
    await state_db.deleteOne({ state: state });
    return true;
  } else {
    return false;
  }
}
