import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  query,
  getDocs,
  deleteDoc,
  where,
  getCountFromServer,
} from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_CODE,
  appId: process.env.APP_ID,
});

const db = getFirestore();
export async function createUserProfile(userInfo) {
  const user = {
    displayName: "",
    email: "",
    phone: "",
    address: "",
    photoUrl: "",
    uid: "",
  };

  // Update user profile in firestore.
  const collectionRef = collection(db, "User");
  const docRef = doc(collectionRef);

  await setDoc(docRef, {
    ...userInfo,
  });

  return userInfo;
}

export async function save(param, _collection) {
  const collectionRef = collection(db, _collection);
  const docRef = doc(collectionRef);

  await setDoc(docRef, {
    ...param,
    id: docRef.id,
  });
  param.id = docRef.id;

  return param;
}

export async function updateApi(data, collectionParam) {
  var isUpdated = false;
  const docRef = doc(db, collectionParam, data.id);
  const d = await getDoc(docRef);

  if (d.exists()) {
    setDoc(docRef, data);
    isUpdated = true;
  }
  return isUpdated;
}

export async function deleteApi(param, _collection) {
  const docRef = doc(db, _collection, param.id);
  const snapShot = await getDoc(docRef);
  if (snapShot.exists()) {
    deleteDoc(docRef);
    return true;
  } else return false;
}
export async function fetch(_collection) {
  const collectionRef = collection(db, _collection);
  const q = query(collectionRef);
  const snapShot = await getDocs(q);
  const result = [];

  snapShot.forEach((r) => {
    const res = r.data();
    result.push(res);
  });

  return result;
}

const productCategory = {
  category: "",
  count: 0,
};
export async function getProductCountForCategory(param) {
  const countFinal = [];
  /*  fetch("Categories").then((data) => {
    data.forEach((category) => {
      getCount(category).then((val) => {
        productCategory.count = val;
        productCategory.category = category.id;        
      });
    });
    console.log(countFinal);
  }); */

  return getCount(param);
}
async function getCount(param) {
  const coll = collection(db, "Products");
  const q = query(coll, where("category", "==", param));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}
