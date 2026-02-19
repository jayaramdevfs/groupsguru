"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";

const spring = {
  type: "spring",
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

function PremiumInput() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      animate={{
        boxShadow: focused
          ? "0px 0px 30px rgba(168,85,247,0.7)"
          : "0px 0px 0px rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-2xl"
    >
      <div className="relative h-16 rounded-2xl bg-purple-950/60 border border-purple-700/40 backdrop-blur-xl px-5 flex items-center">

        {/* REAL INPUT (hidden text, caret visible) */}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute inset-0 px-5 bg-transparent outline-none text-transparent caret-pink-400 font-bold text-lg"
          placeholder=""
        />

        {/* Animated Text */}
        <div className="flex items-center pointer-events-none font-bold text-lg text-white">
          {value.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                ...spring,
              }}
              className="inline-block"
              style={{
                transformOrigin: "center",
                textShadow:
                  "0px 0px 14px rgba(168,85,247,0.9)",
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {!value && (
          <span className="text-purple-300/60 font-bold text-lg pointer-events-none">
            Enter Email
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function DesignPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      smoothWheel: true,
      wheelMultiplier: 1,
      lerp: 0.08, // smoother interpolation
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".orb", {
        y: -60,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.7,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#0f051d] via-[#12081f] to-[#0a0114] text-white relative overflow-hidden p-10"
    >
      <div className="orb absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-700/30 rounded-full blur-3xl" />
      <div className="orb absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-700/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="relative z-10 max-w-5xl mx-auto space-y-24"
      >
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            PREMIUM LMS
          </h1>
          <p className="text-purple-200/80 text-lg font-bold">
            Refined Interactive System
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <PremiumInput />
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{
              y: -10,
              boxShadow:
                "0px 30px 70px rgba(147,51,234,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            className="px-14 py-5 rounded-2xl text-white font-extrabold bg-gradient-to-r from-purple-600 to-pink-600"
          >
            ENTER PLATFORM
          </motion.button>
        </div>

        <div className="bg-purple-950/50 backdrop-blur-xl border border-purple-800/40 rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(147,51,234,0.3)]">
          <table className="w-full text-left">
            <thead className="bg-purple-900/70 text-purple-200 font-bold">
              <tr>
                <th className="p-6">NAME</th>
                <th className="p-6">ROLE</th>
                <th className="p-6">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {["ADMIN", "STUDENT", "INSTRUCTOR"].map((name, i) => (
                <motion.tr
                  key={i}
                  onClick={() => setActiveRow(i)}
                  whileHover={{
                    backgroundColor: "rgba(147,51,234,0.18)",
                  }}
                  className="border-t border-purple-800/40 cursor-pointer font-bold"
                >
                  <td className="p-6">{name}</td>
                  <td className="p-6">USER</td>
                  <td className="p-6">
                    <motion.span
                      animate={
                        activeRow === i
                          ? {
                              scale: [1, 1.2, 1],
                              boxShadow:
                                "0px 0px 20px rgba(236,72,153,0.6)",
                            }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      className="text-pink-400"
                    >
                      ACTIVE
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="h-40" />
      </motion.div>
    </div>
  );
}
