import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import PropertiesReader from "properties-reader";
import { createUserProfile } from "./api.js";

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

  return createUserWithEmailAndPassword(auth, userObj.email, userObj.password)
    .then((creds) => {
      const user = creds.user;      
      setUserInfo(userInfo, user, userObj);
      return createUserProfile(userInfo);
      
    })
    .catch((error) => {
      return { code: error.code, message: error.message };
    });
}

function setUserInfo(userInfo, user, userObj) {
  userInfo.uid = user.uid;
  userInfo.displayName = userObj.displayName;
  userInfo.email = userObj.email;
}

export async function loginUser(username, password) {
  const user = {
    displayName: "",
    email: "",
    phone: "",
    address: "",
    photoUrl: "",
    uid: "",
    token: "",
  };
  return signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      user.displayName = userCredential.user.displayName;
      user.email = userCredential.user.email;
      userCredential.user.getIdToken().then((data) => {
        user.token = data;
      });
      user.uid = userCredential.user.uid;
      return user;
    })
    .catch((error) => {
      error.message = properties.get(error.code);
      throw error;
    });
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
