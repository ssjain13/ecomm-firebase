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
} from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();


initializeApp({
  apiKey:process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_CODE,
  appId: process.env.APP_ID,
});

const db = getFirestore();

export async function fetchCategoriesApi() {
  const collectionRef = collection(db, "Categories");
  const q = query(collectionRef);
  const snapShot = await getDocs(q);
  const result = [];

  snapShot.forEach((categories) => {
    const res = categories.data();
    const category = {
      id: "",
      name: "",
      description: "",
    };
    category.description = res.description;
    category.name = res.name;
    category.id = categories.id;
    result.push(category);
  });

  return result;
}

export async function createCategoryApi(param) {
  const categoryCollection = collection(db, "Categories");
  const newDoc = await addDoc(categoryCollection, param);
  return newDoc.id;
}
