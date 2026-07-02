import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate static petals once on mount to avoid hydration mismatch
    const generatePetals = () => {
      const newPetals: Petal[] = [];
      for (let i = 0; i < 20; i++) {
        newPetals.push({
          id: i,
          x: Math.random() * 100, // percentage
          delay: Math.random() * 10, // seconds
          duration: 10 + Math.random() * 15, // 10-25 seconds
          size: 10 + Math.random() * 20, // 10-30px
          rotation: Math.random() * 360,
        });
      }
      return newPetals;
    };
    
    setPetals(generatePetals());
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute bg-primary/20 rounded-full"
          style={{
            width: petal.size,
            height: petal.size * 1.5,
            left: `${petal.x}%`,
            top: -50,
            borderRadius: "50% 0 50% 50%",
          }}
          initial={{ y: -50, rotate: petal.rotation, opacity: 0 }}
          animate={{
            y: ["0vh", "120vh"],
            rotate: [petal.rotation, petal.rotation + 180],
            opacity: [0, 1, 0.8, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
