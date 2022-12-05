import Head from "next/head";
import {useState,} from 'react'
import Image from "next/image";
import styles from "../styles/editor.module.css";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Collage } from "../public/collage";

// export default function EditorPage(props) {
//   return (
//     <>
//     <Head>
//       <title>Customize your Collage</title>
//       <link rel="icon" href="/favicon.ico" />
//     </Head>
//     <Editor {...props}/>
//     </>
//   );
// }

export default function Editor({covers} : {covers : string[]}) {
  let [collage, setCollage] = useState(new Collage(covers));
  // Collage and controls are given fixed width and height relative to the viewport
  // The collage will try to fill its assigned space with square covers without overflowing it
  return (
    
    <main className={styles.editor}>
      <div className={styles.controlsContainer}>
        <CollageControls collage={collage} setCollage={setCollage}/>
      </div>
      <div className={styles.collageContainer}>
        <CollageView collage={collage} setCollage={setCollage}/>
      </div>
    </main>
  );
}

// COLLAGE CONTROLs

function CollageControls({collage, setCollage} : {collage: Collage, setCollage: Function}) {

  function setDims(position : number) {
    setCollage({...collage.setDims(position)});
  }

  function setGap(position : number) {
    setCollage({...collage.setGap(position)});
  }

  return (
    <div className={styles.controls}>

      <p>
        Aspect Ratio
      </p>
      {/* <Slider 
          onChange={setDims} 
          aria-label="dims" 
          defaultValue={collage.dim_index} 
          min={1} 
          max={collage.valid_dims.length - 1}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider> */}

      <p>
        Gap Between Covers
      </p>
      {/* <Slider 
          onChange={setGap} 
          aria-label="gap" 
          defaultValue={0} 
          min={0} 
          max={10}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider> */}

    </div>
  );
}

// COLLAGE VIEW

function CollageView({collage, setCollage} : {collage: Collage, setCollage: Function}) {

  const swapCover = (first, second) => {
    setCollage({...collage.swapCover(first, second)});
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        className={styles.collage}
        style={{
          aspectRatio: collage.cols / collage.rows,
          gridTemplateColumns: `repeat(${collage.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${collage.rows}, minmax(0, 1fr))`,
        }}
      >
        {collage.covers.map((url, index) => (
          <Cover
            key={url} 
            index={index} 
            url={url} 
            swapCover={swapCover}
            gap={collage.gap}
          />
        ))}
      </div>
    </DndProvider>
  );
}

function Cover({index, url, swapCover, gap}) {
  // a cover is draggable
  const [, dragRef] = useDrag({
    type: 'cover',
    item: { index },
  })
  // a cover is also a drag receptacle
  const [, dropRef] = useDrop({
      accept: 'cover',
      drop: (other : {index: number}) => {
        swapCover(other.index, index);
      }
  })
  // black magic to combine drag & drop ref
  return (
    <div 
      className={styles.cover} 
      ref={(node) => {dragRef(dropRef(node))}}
      style={{margin: `${gap}%`}}
    >
      {/*Box used to overlay hover border on top of cover image*/}
      <div className={styles.coverOutline}/>
      <Image 
        src={url}
        placeholder="blur"
        blurDataURL="/missing-cover.jpg"
        alt="An album cover"
        sizes="5em"
        fill
      />
    </div>
  )
}

// DATA FETCHING FUNCTIONS

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