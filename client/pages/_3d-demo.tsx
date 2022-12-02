import { Heading } from "@chakra-ui/react";

import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/3d-demo.module.css";

import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";

export default function Test3D() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Heading className={styles.title}>This is not a Teapot</Heading>
        <Canvas className={styles.display}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Teapot position={[0, 0, 0]} />
          <OrbitControls target={[0, 20, 0]} />
        </Canvas>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef(null);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

function Teapot(props) {
  const model = useLoader(GLTFLoader, "/teapot/teapot.gltf");
  return <primitive position={[0, 0.25, 0]} object={model.scene} />;
}
