'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect } from "react";


import { motion } from "motion/react";
import { FaSearch } from "react-icons/fa";
import confetti from "canvas-confetti";
import LucyHero from '../components/mvpblocks/mockup-hero.jsx';
import AppHero from '../components/mvpblocks/app-hero.jsx';
import WaitlistPage from "../components/mvpblocks/waitlist.jsx"
import Team2 from '@/components/mvpblocks/team-2.jsx';
import ModelViewer from '@/components/ModelViewer.jsx';


export default function Home() {
  // const { user } = useUser();
  // useEffect(() => {
  //   confetti();
  // }, []);




  return (
    <div className="">
      <WaitlistPage />
      <Team2></Team2>
      <ModelViewer gltfUrl="https://modelviewer.dev/shared-assets/models/Astronaut.glb" />



</div>
  );
}
