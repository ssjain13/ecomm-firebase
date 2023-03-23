import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import PropertiesReader from "properties-reader";
import { createUserProfile, getUserProfile } from "./api.js";

const auth = getAuth();
var properties = PropertiesReader("error.properties");

export async function createUser(userObj) {
  const userInfo = {
    displayName: "",
    email: "",
    phone: "",
    address: "",
    photoUrl: "",
    uid: "",
  };

  try {
    const creds = await createUserWithEmailAndPassword(
      auth,
      userObj.email,
      userObj.password
    );
    const user = creds.user;
    setUserInfo(userInfo, user, userObj);
    return createUserProfile(userInfo);
  } catch (error) {
    const code = properties.get(error.code);
    if (code) {
      error.message = code;
    }
    throw error;
  }
}

function setUserInfo(userInfo, user, userObj) {
  userInfo.uid = user.uid;
  userInfo.displayName = userObj.displayName;
  userInfo.email = userObj.email;
}

export async function loginUser(username, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      username,
      password
    );

    const uid = userCredential.user.uid;
    const profile = await getUserProfile(uid);
    return profile;
  } catch (error) {
    const code = properties.get(error.code);

    if (code) {
      error.message = code;
    }
    throw error;
  }
}

export async function signOutUser() {
  return signOut(auth)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });
}
