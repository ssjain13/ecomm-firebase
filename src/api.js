import { initializeApp, getApp } from "firebase/app";

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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import dotenv from "dotenv";

dotenv.config();

const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: "gs://my-app-9c783.appspot.com",
  messagingSenderId: process.env.MESSAGE_CODE,
  appId: process.env.APP_ID,
};

const app = initializeApp(config);

const db = getFirestore();

export async function getUserProfile(id) {
  const docRef = collection(db, "User");
  const q = query(docRef, where("uid", "==", id));

  const querySnapshot = await getDocs(q);
  var userProfile;
  querySnapshot.forEach((doc) => {
    userProfile = doc.data();
  });
  if (!userProfile) {
    throw new Error(`User profile not found`);
  }
  return userProfile;
}

export async function createUserProfile(userInfo) {
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
  const url = await uploadFile(param.file);
  const data = JSON.parse(param.body.data);
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    url: url,
  });
  data.id = docRef.id;
  data.url = url;

  return data;
}

export async function saveCategory(param, _collection) {
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
export async function deleteProduct(category) {
  //const coll = collection(db, "Products");
  const q = query(
    collection(db, "Products"),
    where("category", "==", category)
  );
  const snapshot = await getDocs(
    query(collection(db, "Products"), where("category", "==", category))
  );

  snapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
}

export async function deleteCategory(category) {
  const docRef = doc(db, "Categories", category.id);
  const snapShot = await getDoc(docRef);
  if (snapShot.exists()) {
    deleteDoc(docRef);
    const snapshot = await getDocs(
      query(collection(db, "Products"), where("category", "==", category.name))
    );
    snapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    return true;
  } else return false;
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

export async function getCountByCategory() {
  const productsRef = collection(db, "Products");
  const q = query(productsRef);
  const querySnapshot = await getDocs(q);
  const countByCategory = {};

  querySnapshot.forEach((doc) => {
    const category = doc.data().category;
    if (countByCategory[category]) {
      countByCategory[category]++;
    } else {
      countByCategory[category] = 1;
    }
  });
  return countByCategory;
}

export async function getProductCountForCategory() {
  const countFinal = [];
  const categories = await fetch("Categories");

  for (const category of categories) {
    const data = await getCount(category.name);
    countFinal.push({ count: data, category: category.name });
  }

  return countFinal;
}
async function getCount(param) {
  const coll = collection(db, "Products");
  const q = query(coll, where("category", "==", param));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function uploadFile(file) {
  const storage = getStorage(app);
  const timestamp = new Date().getTime();
  const storageRef = ref(
    storage,
    "images/" + `${file.originalname}_${timestamp}`
  );

  const metadata = {
    contentType: "image/jpeg",
  };

  const snapshot = await uploadBytes(storageRef, file.buffer, metadata);

  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
