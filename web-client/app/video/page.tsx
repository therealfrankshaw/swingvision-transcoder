'use client';

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function VideoContent() {
  const videoPrefix = 'https://storage.googleapis.com/fs-swing-vision-processed-videos/';
  const videoSrc = useSearchParams().get('vid');

  return (
    <div>
      <h1>Video</h1>
      <p> videoSrc: {videoSrc} </p>
      { <video controls src={videoPrefix + videoSrc}/> }
    </div>
  );
}

export default function Video() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoContent />
    </Suspense>
  )
}