'use client';
import dynamic from "next/dynamic";

import AFrameScene from "../components/AFrameScene"

export default function Home() {
  return (
    <div>
      <AFrameScene gltfUrl={"https://cyberpunkaakash.vercel.app/DamagedHelmet.gltf"} />
      {/* <Arcard /> */}
    </div>
    

  );
}

