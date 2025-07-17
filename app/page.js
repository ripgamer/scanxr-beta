'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect } from "react";


import { motion } from "motion/react";
import { FaSearch } from "react-icons/fa";
import confetti from "canvas-confetti";
import LucyHero from '../components/mvpblocks/mockup-hero.jsx';
import AppHero from '../components/mvpblocks/app-hero.jsx';
import WaitlistPage from "../components/mvpblocks/waitlist.jsx"


export default function Home() {
  // const { user } = useUser();
  // useEffect(() => {
  //   confetti();
  // }, []);




  return (
    <div className="">
      <WaitlistPage />



</div>
  );
}
