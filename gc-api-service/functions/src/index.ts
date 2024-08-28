

import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";


initializeApp();
const firestore = new Firestore();
const storage = new Storage();
const origVideoBucketName = "fs-swing-vision-orig-videos";

export const createUser = functions.auth.user().onCreate((user)=>{
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };
  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(
    `User created: ${JSON.stringify(userInfo)}`, {structuredData: true}
  );
  return;
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  // make sure user is authenticated before they can upload to GCS
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }
  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(origVideoBucketName);

  const uniqFileName = (
    `${data.fileName}-${Date.now()}-${auth.uid}.${data.fileExtension}`
  );

  // generate signed url to allow user to upload video for 15 mins.
  const [url] = await bucket.file(uniqFileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000,
  });

  return {url, uniqFileName};
});


export const getVideos = onCall({maxInstances: 1}, async () => {
  const querySnapshot =
    await firestore.collection("videos").limit(10).get();
  return querySnapshot.docs.map((doc) => doc.data());
});
