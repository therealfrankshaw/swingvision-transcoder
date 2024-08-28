import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase'


const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');

export async function uploadVideo(file: File) {
  const response: any = await generateUploadUrlFunction({
    fileExtension: file.name.split('.').slice(-1),
    fileName: file.name.split('.').slice(0,-1),
  });

  const url = response?.data?.url
  const result = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  return result;
}

const getVideosFunction = httpsCallable(functions, 'getVideos');

export async function getVideos() {
  const response: any = await getVideosFunction();
  return response.data;
}
