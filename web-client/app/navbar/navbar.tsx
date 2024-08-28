'use client';
import SignIn from "./signIn";
import Upload from "./upload"
import Link from "next/link";
import Image from "next/image";

import styles from "./navbar.module.css";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { User } from "firebase/auth";



function NavBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);


  return (
    <nav className={styles.nav}>
      <Link href="/">
        <Image width={160} height={90} style={{borderRadius:'10px'}}
          src="/SwingVisionImage.jpg" alt="Logo"/>
      </Link>
      { 
        user && <Upload />
      }
      <SignIn user={user} />
    </nav>
  );
}

export default NavBar;
