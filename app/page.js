'use client';
import dynamic from "next/dynamic";

// const AFrameScene = dynamic(() => import("@/components/AFrameScene"), { ssr: false });
const Arcard = dynamic(() => import("../components/Arcard"), { ssr: false });
// import AFrameScene from "@/components/AFrameScene";
import { use } from "react";
// import Head from "next/head";

export default function Home() {
  return (
    <div>
      {/* <AFrameScene /> */}
      <Arcard />
    </div>
    

  );
}

