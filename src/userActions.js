import { app } from "./firebase.config.js";
const actionCodeSettings = {
  url: "http://localhost:5173/",
  iOS: {
    bundleId: "com.example.ios",
  },
  android: {
    packageName: "com.example.android",
    installApp: true,
    minimumVersion: "12",
  },
  handleCodeInApp: true,
};
export async function fetchUsers() {
  try {
    const userList = (await app.auth().listUsers()).users;

    return userList;
  } catch (e) {
    return e;
  }
}
export async function sendVerificationEmail(email) {
  try {
    const link = await app
      .auth()
      .generateEmailVerificationLink(email, actionCodeSettings);

    return link;
  } catch (e) {
    return e;
  }
}

export async function resetPassword(email) {
  try {
    const link = await app
      .auth()
      .generatePasswordResetLink(email, actionCodeSettings);

    return link;
  } catch (error) {
    return error;
  }
}

export async function accountUpdate(uid, action) {
  try {
  await app.auth().updateUser(uid, {
      disabled: action,
    });
    return {uid};
  } catch (error) {
    return error;
  }
}

export async function deleteAccount(uid) {
  try {
    await app.auth().deleteUser(uid);
    return { uid };
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function fetchUserProfile(email) {
  try {
    const user = await app.auth().getUserByEmail(email);
    return user.toJSON();
  } catch (error) {
    return error;
  }
}
