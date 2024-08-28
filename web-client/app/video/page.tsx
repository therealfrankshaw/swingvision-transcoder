'use client';

import { useSearchParams } from 'next/navigation'

export default function Video() {
  const videoPrefix = 'https://storage.googleapis.com/fs-swing-vision-processed-videos/';
  const videoSrc = useSearchParams().get('vid');

  return (
    <div>
      <h1>Video</h1>
      { <video controls src={videoPrefix + videoSrc}/> }
    </div>
  );
}