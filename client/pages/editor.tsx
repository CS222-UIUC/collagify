import Head from "next/head";
import {useState,} from 'react'
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

export function Editor({covers} : {covers : string[]}) {
  
  // Make the collage approximately square initially
  const default_rows = Math.floor(Math.sqrt(covers.length));
  const default_cols = Math.ceil(covers.length / default_rows); 

  const [numCols, setNumCols] = useState(default_cols);
  const [numRows, setNumRows] = useState(default_rows);

  // Collage and controls are given fixed width and height relative to the viewport
  // The collage will try to fill its assigned space with square covers without overflowing it
  return (
    <div className={styles.editor}>

      <div className={styles.controls}>
      </div>

      <div className={styles.collageContainer}>
        <div 
          className={styles.collage}
          style={{
            aspectRatio: numCols / numRows,
            gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
          }}
        >
          {covers.map((cover) => (
            <div className={styles.cover}>
              <Image 
                src={cover}
                placeholder="blur"
                blurDataURL="/missing-cover.jpg"
                alt="An album cover"
                fill
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export async function getServerSideProps(context) {
  const covers = [
    "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nirvana_album_cover.svg/776px-Nirvana_album_cover.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/4-44_album_cover.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Yandhi_Cover_Art_%28Free_License%29.jpg/1200px-Yandhi_Cover_Art_%28Free_License%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8f/Studio_Killers_Album_Instrumental_Cover.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/6b/Spiral_-_Allison_Crowe_%28album_cover%29.jpg",
    "https://i.scdn.co/image/ab67616d00001e022118bf9b198b05a95ded6300",
    "https://i.scdn.co/image/ab67616d00001e020c100c40bdedea776770e7aa",
    "https://i.scdn.co/image/ab67616d00001e02f4862b4fa494ef26fd8f199e"
  ];
  // TODO: Add code that fetches covers from spotify API here 
  // Ideally the covers should be of the same size 
  return {
    props: {
      covers,
    },
  }
} 