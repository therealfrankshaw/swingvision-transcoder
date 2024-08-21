import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';


const storage = new Storage();

const origVideoBucketName = "fs-swing-vision-orig-videos";
const processedVideoBucketName = "fs-swing-vision-processed-videos";

const localOrigVideoPath = "./orig-videos";
const localProcessedVideoPath = "./processed-videos";

function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
    console.log(`Directory created at ${dirPath}`);
  }
}


export function setupDirectories() {
  ensureDirectoryExistence(localOrigVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);
}


// download original file to local path
export async function downloadRawVideo(fileName: string) {
  await storage.bucket(origVideoBucketName)
    .file(fileName)
    .download({
      destination: `${localOrigVideoPath}/${fileName}`,
    });

  console.log(
    `gs://${origVideoBucketName}/${fileName} downloaded to ${localOrigVideoPath}/${fileName}.`
  );
}


// convert the video to 360 p
export function convertVideo(videoName: string) {
  const file_name = videoName.split('.').slice(0, -1).join('');
  const file_ext = videoName.split('.').pop();
  const outputVideoName = `${file_name}-processed.${file_ext}`;
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localOrigVideoPath}/${videoName}`)
      .outputOptions("-vf", "scale=-1:360") // 360p
      .on("end", function () {
        console.log(`Processing finished successfully, saving to ${localProcessedVideoPath}/${outputVideoName}`);
        resolve();
      })
      .on("error", function (err: any) {
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${outputVideoName}`);
  })
}


// upload processed video to processed video bucket name
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  // Upload video to the bucket
  await storage.bucket(processedVideoBucketName)
    .upload(`${localProcessedVideoPath}/${fileName}`, {
      destination: fileName,
    });
  console.log(
    `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
  );

  // Set the video to be publicly readable
  await bucket.file(fileName).makePublic();
}


// delete original raw video after processing from container
export function deleteRawVideo(fileName: string) {
  console.log(`deleting original file: ${localOrigVideoPath}/${fileName}`)
  return deleteFile(`${localOrigVideoPath}/${fileName}`);
}


// delete processed video from container
export function deleteProcessedVideo(fileName: string) {
  console.log(`deleting processed file: ${localProcessedVideoPath}/${fileName}`)
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


// delete original file from GCS after conversion
function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file at ${filePath}`, err);
          reject(err);
        } else {
          console.log(`File deleted at ${filePath}`);
          resolve();
        }
      });
    } else {
      console.log(`File not found at ${filePath}, skipping delete.`);
      resolve();
    }
  });
}



