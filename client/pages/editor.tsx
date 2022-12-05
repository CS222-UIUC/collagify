import Head from "next/head";
import {useRef, useState,} from 'react'
import Image from "next/image";
import styles from "../styles/editor.module.css";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Flex,
  Spacer,
  VStack,
  AspectRatio,
  Wrap,
} from "@chakra-ui/react";
import theme from "../styles/theme";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import PageWrapper from "../components/PageWrapper";
import { Collage } from "../public/collage";

export default function EditorPage(props) {
  return (
    <PageWrapper subtitle="Editor">
      <Editor {...props} />
    </PageWrapper>
  );
}

export function Editor({ covers }: { covers: string[] }) {
  // Collage and controls are given fixed width and height relative to the viewport
  // The collage will try to fill its assigned space with square covers without overflowing it
  // TODO: use flex instead of grid to implement collage to avoid all the flex box jank
  let [collage, setCollage] = useState(new Collage(covers));
  return (
    <Flex dir="row" align="center" justify="space-between" w="100%" h="100vh">
      <Box w="25%" h="100%" padding="2%">
        <CollageControls collage={collage} setCollage={setCollage}/>
      </Box>
      {/* Converts this to box breaks centering of collage */}
      <div className={styles.collageContainer}>
        <CollageView collage={collage} setCollage={setCollage}/>
      </div>
    </Flex>
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
    <VStack 
      spacing="1em"
      align="start"

      w="100%" h="100%"
      border="0.1em solid"
      borderRadius="0.2em"
      borderColor={theme.colors.spotifyDarkGreen}
      boxShadow="0 0 0.7em var(--chakra-colors-spotifyDarkGreen)"

      padding="5%"
      bgColor={theme.colors.spotifyGrey}
      fontSize="large"
    >

      <p>
        Aspect Ratio
      </p>
      <Slider 
          onChange={setDims} 
          aria-label="dims" 
          defaultValue={collage.dim_index} 
          min={0} 
          max={collage.valid_dims.length - 1}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>

      <p>
        Gap Between Covers
      </p>
      <Slider 
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
      </Slider>

    </VStack>
  );
}

// COLLAGE VIEW

function CollageView({collage, setCollage} : {collage: Collage, setCollage: Function}) {

  const swapCover = (first, second) => {
    setCollage({...collage.swapCover(first, second)});
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Collage cannot be converted into chakra <Grid> without breaking scaling */}
      {/* I wasted 2 hours trying to do that */}
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
    type: "cover",
    item: { index },
  })
  // a cover is also a drag receptacle
  const [, dropRef] = useDrop({
      accept: 'cover',
      drop: (other : {index: number}) => {
        swapCover(other.index, index);
      }
  })
  return (
    <AspectRatio 
      ratio={1}
      pos="relative"
      margin={gap}
      ref={(node) => {dragRef(dropRef(node))}}  // black magic to combine drag & drop ref
    >
      <Box>
        <Box 
          w="100%" h="100%" 
          pos="absolute"
          zIndex={1}
          _hover={{ border:"0.2em solid var(--chakra-colors-spotifyLightGreen)" }}
        />
        <Image
          src={url}
          placeholder="blur"
          blurDataURL="/missing-cover.jpg"
          alt="An album cover"
          sizes="5em"
          fill
        />
      </Box>
    </AspectRatio>
  );
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
    "https://i.scdn.co/image/ab67616d00001e02f4862b4fa494ef26fd8f199e",
  ];
  // TODO: Add code that fetches covers from spotify API here
  // Ideally the covers should be of the same size
  return {
    props: {
      covers,
    },
  };
}
