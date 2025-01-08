export const VALID_NONCE = "http://specs.openid.net/auth/2.0";
export const VALID_ID_SELECT = `${VALID_NONCE}/identifier_select`;
export const VALID_OPENID_ENDPOINT = "https://steamcommunity.com/openid/login";

export const STEAM_API_KEY = process.env.STEAM_API_KEY || import.meta.env.STEAM_API_KEY;

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || import.meta.env.DISCORD_CLIENT_ID;
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || import.meta.env.DISCORD_CLIENT_SECRET;

export const DB_URL = process.env.DB_URL || import.meta.env.DB_URL;
export const PUGBOT_API_KEY = process.env.BOT_API_PASSWORD || import.meta.env.BOT_API_PASSWORD;
export const PUGBOT_SITE_URL = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` || "http://192.168.1.30:4321";
export const GIT_SHA = process.env.RAILWAY_GIT_COMMIT_SHA || "unknown";
