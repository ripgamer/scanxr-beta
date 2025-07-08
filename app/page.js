'use client';
import dynamic from "next/dynamic";

import AFrameScene from "../components/AFrameScene"
import ARButton from "@/components/ARButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
     

      <AFrameScene gltfUrl={"https://cyberpunkaakash.vercel.app/DamagedHelmet.gltf"} />
      {/* <Arcard /> */}
      {/* <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Try AR!</h1>
      <ARButton gltfUrl="https://cyberpunkaakash.vercel.app/DamagedHelmet.gltf" buttonText="View Helmet in AR" />
    </div> */}
      {/* <h1 className="text-3xl font-bold mb-8">Try AR!</h1>
      <ARButton gltfUrl="https://cyberpunkaakash.vercel.app/DamagedHelmet.gltf" buttonText="View Helmet in AR" />
    */}
    </div>
    

  );
}

