import styles from "./page.module.css";
import Image from 'next/image';
import Link from 'next/link';
import { getVideos } from './firebase/functions'
export default async function Home() {
  const videos = await getVideos();


  return (
    <main className={styles.main}>
      <h1>Videos</h1>
      {
        videos.map((video:any) => (
          <Link href={`/video?vid=${video.filename}`}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
    </main>
  );
}
