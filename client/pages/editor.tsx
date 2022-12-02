import { /*useCallback,*/ useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/editor.module.css";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Flex,
  // SliderMark,
  // useSlider,
} from "@chakra-ui/react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PageWrapper from "../components/PageWrapper";

export default function EditorPage(props) {
  return (
    <PageWrapper subtitle="Editor">
      <Editor {...props} />
    </PageWrapper>
  );
}

export function Editor({ covers }: { covers: string[] }) {
  // TODO: return error page if covers is empty
  const kMaxCovers = 100;
  covers = covers.slice(0, kMaxCovers);

  let possible_rows = findPossibleRows(covers.length);
  // Make the collage approximately square initially
  let default_index = Math.floor(possible_rows.length / 2);
  let default_rows = possible_rows[default_index];
  let default_cols = findColFromRow(covers.length, default_rows);

  let [numRows, setNumRows] = useState(default_rows);
  let [numCols, setNumCols] = useState(default_cols);

  // Covers can be arranged into n rows if covers % n
  const changeCollageDimensions = (index) => {
    setNumRows(possible_rows[index]);
    setNumCols(findColFromRow(covers.length, possible_rows[index]));
  };

  // Collage and controls are given fixed width and height relative to the viewport
  // The collage will try to fill its assigned space with square covers without overflowing it
  return (
    <Flex className={styles.editor}>
      <Box className={styles.controlsContainer}>
        <Slider
          onChange={changeCollageDimensions}
          aria-label="aspect"
          defaultValue={default_index}
          min={1}
          max={possible_rows.length - 1}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>

      <Box className={styles.collageContainer}>
        <Collage covers={covers} rows={numRows} cols={numCols} />
      </Box>
    </Flex>
  );
}

function findColFromRow(num_covers: number, num_rows: number): number {
  return Math.ceil(num_covers / num_rows);
}

function findPossibleRows(num_covers: number): number[] {
  let to_return: number[] = [];
  for (let num_rows = 1; num_rows <= num_covers; num_rows++) {
    let num_cols = findColFromRow(num_covers, num_rows);
    // There must not be empty rows
    if (num_covers > num_cols * (num_rows - 1)) {
      to_return.push(num_rows);
    }
  }
  return to_return;
}

export function Collage({ covers, rows, cols }) {
  let [displayCovers, setDisplayCovers] = useState(covers);
  const moveCover = (index_a, index_b) => {
    let tmp = displayCovers[index_a];
    displayCovers[index_a] = displayCovers[index_b];
    displayCovers[index_b] = tmp;
    // this trick makes react thinks we are changing displayCovers into a new object and rerender
    setDisplayCovers([...displayCovers]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={styles.collage}
        style={{
          aspectRatio: cols / rows,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {displayCovers.map((url, index) => (
          <Cover index={index} url={url} moveCover={moveCover} />
        ))}
      </div>
    </DndProvider>
  );
}

export function Cover({ index, url, moveCover }) {
  // useDrag - the list item is draggable
  const [, dragRef] = useDrag({
    type: "cover",
    item: { index },
  });
  // useDrop - the list item is also a drop area
  const [, dropRef] = useDrop({
    accept: "cover",
    drop: (item: { index: number }) => {
      console.log("dropping");
      moveCover(item.index, index);
    },
  });
  const ref = useRef(null);
  const dragDropRef = dragRef(dropRef(ref));
  return (
    <div className={styles.cover} ref={dragDropRef}>
      {/*Box used to overlay hover border on top of cover image*/}
      <div className={styles.coverOutline} />
      <Image
        src={url}
        placeholder="blur"
        blurDataURL="/missing-cover.jpg"
        alt="An album cover"
        sizes="10em"
        fill
      />
    </div>
  );
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
