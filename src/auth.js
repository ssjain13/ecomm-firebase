import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import "firebase-admin/auth";

import PropertiesReader from "properties-reader";
import { app, auth } from "./firebase.config.js";
import { sendVerificationEmail } from "./userActions.js";

var properties = PropertiesReader("error.properties");

export async function createUser(userObj) {
  try {
    const user = await app.auth().createUser({
      email: userObj.email,
      password: userObj.password,
      displayName: userObj.displayName,
    });

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
