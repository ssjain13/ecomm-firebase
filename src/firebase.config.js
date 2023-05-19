import * as firebaseClient from "firebase/app";
import "firebase/auth";

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
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.private_key,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
  }),
  databaseURL: process.env.DATABASE_URL,
});
