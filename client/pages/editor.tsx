import { Grid, Heading } from "@chakra-ui/react";

import Head from "next/head";
import { useRef, useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/editor.module.css";

export default function EditorPage(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Customize your collage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.navbar}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
      </header>

      <main className={styles.main}>
        <Editor {...props}/>
      </main>
    </div>
  );
}

export function Editor({covers}) {
  
  const [numCols, setNumCols] = useState(3);
  const [numRows, setNumRows] = useState(2);

  return (
    <div className={styles.editor}>
      <div className={styles.controls}>
      </div>
      <div 
        className={styles.collage}
        style={{
          gridTemplateColumns: "repeat(" + numCols + ", 1fr)",
          gridTemplateRows: "repeat(" + numRows + ", 1fr)",
        }}
      >
        {covers.map((cover) => (
          <Image 
            src={cover}
            width="200em" 
            height="200em" 
            placeholder="blur"
            blurDataURL="/missing-cover.jpg"
          />
        ))}
      </div>
    </div>
  )
}

export async function getStaticProps(context) {
  const covers = [
    "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nirvana_album_cover.svg/776px-Nirvana_album_cover.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/4-44_album_cover.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Yandhi_Cover_Art_%28Free_License%29.jpg/1200px-Yandhi_Cover_Art_%28Free_License%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8f/Studio_Killers_Album_Instrumental_Cover.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/6b/Spiral_-_Allison_Crowe_%28album_cover%29.jpg"
  ];
  return {
    props: {
      covers,
    },
  }
} 