import { async, errorPrefix } from "@firebase/util";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import PropertiesReader from "properties-reader";
const auth = getAuth();
var properties = PropertiesReader("error.properties");

export async function createUser(username, password) {
    const userInfo = {
        displayName: "",
        email: "",
        phone: "",
        address: "",
        photoUrl: "",
        uid: "",
        token: "",
      };

  return createUserWithEmailAndPassword(auth, username, password)
    .then((creds) => {
      const user = creds.user;
      
      return user;
    })
    .catch((error) => {
      return { code: error.code, message: error.message };
    });
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
      userCredential.user.getIdToken().then(data=>{
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
