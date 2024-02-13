import "dotenv/config";
export const prefix = process.env.DEV ? "dev#" : "ai|";
export const useChrome = true;
export const Lisences = process.env.Lisences;
export const MongoURL = process.env.MongoURL;
