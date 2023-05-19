import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";
import admin from "firebase-admin";
import "firebase-admin/auth";
import * as bcrypt from "bcrypt";

import PropertiesReader from "properties-reader";
import { app, auth, client } from "./firebase.config.js";
import { sendVerificationEmail } from "./userActions.js";

var properties = PropertiesReader("error.properties");

export async function createUser(userObj) {
  try {
    /* const creds = await createUserWithEmailAndPassword(
      getAuth(),
      userObj.email,
      userObj.password
    ); */
    const user = await app.auth().createUser({
      email: userObj.email,
      password: userObj.password,
      displayName: userObj.displayName,
    });

    /* await app
      .auth()
      .updateUser(creds.user.uid, { displayName: userObj.displayName }); */
    sendVerificationEmail(userObj.email);
    return user.toJSON();
  } catch (error) {
    const code = properties.get(error.code);
    if (code) {
      error.message = code;
    }

    throw error;
  }
}

export async function deleteAuthUser(uid) {
  try {
    console.log("In deleting user");
    return await app.auth().deleteUser(uid);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function loginUser(email, password) {
  try {
    const token = await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user.getIdToken();
      })
      .catch((error) => {
        throw error;
      });

    const profile = await app.auth().verifyIdToken(token);

    if (profile) {
      return app.auth().getUserByEmail(profile.email);
    }
  } catch (error) {
    console.log(error);
    const code = properties.get(error.code);

    if (code) {
      error.message = code;
    }
    throw error;
  }
}

export async function signOutUser() {
  return signOut(getAuth())
    .then(() => {
      return true;
    })
    .catch((error) => {
      return error;
    });
}
