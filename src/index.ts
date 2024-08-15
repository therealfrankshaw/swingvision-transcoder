import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
app.use(express.json());

app.post('/process-video', (req, res) => {

  const videoFilePath = req.body.videoFilePath;
  const file_name = videoFilePath.split('.').slice(0, -1).join('');
  const file_ext = videoFilePath.split('.').pop();
  const outputVideoFilePath = `.${file_name}-processed.${file_ext}`;

  if (!videoFilePath) {
    console.log(videoFilePath)
    return res.status(400).send('Bad Request: Missing file path');
  }

  ffmpeg(videoFilePath)
    .outputOptions('-vf', 'scale=-1:360') // set to 360p just to know the file format conversion is working
    .on('end', function() {
        res.status(200).send(`Video:${videoFilePath} finished successfully`);
    })
    .on('error', function(err: any) {
        res.status(500).send(`Error while processing video:${videoFilePath}, ` + err.message);
    })
    .save(outputVideoFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});