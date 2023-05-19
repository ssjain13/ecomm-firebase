import * as firebaseClient from "firebase/app";
import "firebase/auth";
import serviceAccount from "../../serviceAccountKey.js";
import admin from "firebase-admin";
import dotenv from "dotenv";
import { getAuth } from "firebase/auth";
dotenv.config();
// Initialize Firebase client SDK
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: "gs://my-app-9c783.appspot.com",
  messagingSenderId: process.env.MESSAGE_CODE,
  appId: process.env.APP_ID,
};

export const client = firebaseClient.initializeApp(firebaseConfig);

export const auth = getAuth(client);

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});
