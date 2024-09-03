'use client';
import styles from "./page.module.css";
import Image from 'next/image';
import Link from 'next/link';
import { onAuthStateChangedHelper } from "./firebase/firebase";
import { User } from "firebase/auth";
import { getVideos } from './firebase/functions';
import { useState, useEffect } from 'react';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchVideos = () => {
        getVideos().then(fetchedVideos => {
          setVideos(fetchedVideos);
        }).catch(error => {
          console.error("Error fetching videos:", error);
        });
      };

      fetchVideos();
    }
  }, [user]);

  return (
    <main className={`${styles.main} ${styles.globalWrapper}`}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Your Videos</h1>
      </div>
      <div className={styles.videoGrid}>
      {
        videos.map((video: any) => (
          <div className={styles.videoContainer} key={video.id}>
            <p>videoSrc: {video.filename}</p>
            <Link href={`/video?vid=${video.filename}`}>
              <Image src={'/thumbnail.gif'} alt='video' width={120} height={80}
                className={styles.thumbnail} />
            </Link>
          </div>
        ))
      }
      </div>
    </main>
  );
}
