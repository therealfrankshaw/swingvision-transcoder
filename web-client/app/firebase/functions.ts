import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');

export async function uploadVideo(file: File) {
  const response: any = await generateUploadUrlFunction({
    fileExtension: file.name.split('.').slice(-1),
    fileName: file.name.split('.').slice(0,-1)
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
