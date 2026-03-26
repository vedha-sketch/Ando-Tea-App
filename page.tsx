"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

let audioCtx: AudioContext | null = null;
const PENTATONIC = [277.18, 329.63, 369.99, 415.30, 493.88, 554.37, 659.25];

const playSuikinkutsu = () => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)] * 2, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 15;

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1.5);
};

const BIOMES = ['shrine', 'bamboo', 'zen', 'sakura', 'mixed'];
const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

const CHUNK_WIDTH = 2600;

const GroundPlane = () => (
  <div className="absolute bottom-[-5px] w-full h-[20vh] z-[1] bg-[#e3dfd3]" />
);

const WoodBoardwalk = () => (
  <div className="absolute bottom-[-5px] w-full h-[20vh] z-[5] pointer-events-none drop-shadow-2xl">
    <svg viewBox="0 0 2600 100" preserveAspectRatio="none" className="w-full h-full" style={{ filter: 'url(#watercolor-bleed)' }}>
      <path d="M0,0 L2600,0 L2600,20 L0,20 Z" fill="#3D322E" />
      {Array.from({ length: 60 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 45}, 0)`}>
          <rect x="2" y="0" width="40" height="25" fill="#5C5046" />
          <path d="M5,5 Q20,2 35,5 M10,12 Q25,10 30,15" stroke="#3D322E" strokeWidth="0.5" fill="none" opacity={0.4} />
          <rect x="2" y="0" width="1" height="25" fill="#2D2422" />
        </g>
      ))}
    </svg>
  </div>
);

const StoneBase = () => (
  <div className="absolute bottom-[-5px] w-full h-[20vh] z-[4] pointer-events-none drop-shadow-2xl">
    <svg viewBox="0 0 2600 100" preserveAspectRatio="none" className="w-full h-full" style={{ filter: 'url(#watercolor-bleed)' }}>
      <rect width="2600" height="100" fill="#4B4B4B" />
      {Array.from({ length: 120 }).map((_, i) => (
        <ellipse key={i} cx={i * 22 + rnd(-5, 5)} cy={rnd(20, 80)} rx={rnd(15, 25)} ry={rnd(10, 20)} fill={i % 3 === 0 ? "#5E5E5E" : (i % 2 === 0 ? "#424242" : "#333333")} opacity={0.8} />
      ))}
      {Array.from({ length: 100 }).map((_, i) => (
        <path key={i} d={`M${i * 26},0 Q${i * 26 + 10},50 ${i * 26},100`} stroke="#1A1A1A" strokeWidth="0.5" fill="none" opacity={0.3} />
      ))}
    </svg>
  </div>
);

const Deer = ({ left }: { left: number }) => {
  const [isBowing, setIsBowing] = useState(false);

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSuikinkutsu();
    setIsBowing(prev => !prev);
  };

  const bgPosition = isBowing ? '100% 0%' : '0% 0%';

  return (
    <div
      onClick={handleTap}
      className="absolute cursor-pointer z-[35] origin-bottom scale-x-[-1] drop-shadow-2xl"
      style={{ bottom: '12vh', left: `${left}%`, width: '190px', height: '197px' }}
    >
      <div
        className="w-full h-full pointer-events-none"
        style={{
          backgroundImage: "url('./deer-sprite5.png')",
          backgroundSize: "200% 100%",
          backgroundPosition: bgPosition,
          backgroundRepeat: 'no-repeat',
          transition: 'none',
        }}
      />
      {/* Scaled ground shadow */}
      <svg viewBox="0 0 100 20" className="absolute bottom-[-15px] left-0 w-full h-[40px] -z-10 pointer-events-none">
        <ellipse cx="50" cy="10" rx="35" ry="5" fill="black" opacity={0.15} />
      </svg>
    </div>
  );
};

const ShibaDog = () => {
  const legTransition = { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <div className="absolute bottom-[10vh] left-[22vw] z-[50] w-[140px] h-[100px] pointer-events-none">
      <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-xl" style={{ filter: 'url(#watercolor-bleed)' }}>
        <ellipse cx="60" cy="92" rx="35" ry="4" fill="black" opacity={0.1} />

        <motion.path
          d="M25,40 C15,25 15,5 30,5 C45,5 50,20 40,35"
          fill="none" stroke="#D98B48" strokeWidth="9" strokeLinecap="round"
          animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}
        />

        <motion.path d="M40,65 L32,92" stroke="#BF7236" strokeWidth="7" strokeLinecap="round"
          animate={{ rotate: [25, -20, 25] }} transition={legTransition} style={{ transformOrigin: "40px 65px" }} />
        <motion.path d="M85,65 L92,92" stroke="#BF7236" strokeWidth="7" strokeLinecap="round"
          animate={{ rotate: [-20, 25, -20] }} transition={legTransition} style={{ transformOrigin: "85px 65px" }} />

        <motion.path d="M50,65 L42,92" stroke="#D98B48" strokeWidth="8" strokeLinecap="round"
          animate={{ rotate: [-20, 25, -20] }} transition={legTransition} style={{ transformOrigin: "50px 65px" }} />
        <motion.path d="M75,65 L82,92" stroke="#D98B48" strokeWidth="8" strokeLinecap="round"
          animate={{ rotate: [25, -20, 25] }} transition={legTransition} style={{ transformOrigin: "75px 65px" }} />

        <path d="M35,42 Q45,32 90,38 Q115,45 110,65 Q105,82 45,78 Q30,75 35,42" fill="#D98B48" />
        <path d="M45,55 Q55,45 85,48 Q100,52 95,68 Q85,75 45,72" fill="#F2ECE4" opacity={0.6} />

        <g transform="translate(95, 28)">
          <path d="M0,25 L28,18 C38,18 38,38 28,42 L0,38" fill="#D98B48" />
          <path d="M8,15 L2,2 L18,12" fill="#D98B48" />
          <path d="M22,15 L28,2 L38,12" fill="#D98B48" />
          <circle cx="24" cy="25" r="1.8" fill="#1A1A1A" />
          <path d="M28,30 Q35,32 32,38" fill="#F2ECE4" />
          <circle cx="34" cy="34" r="1.2" fill="black" />
        </g>
      </svg>
    </div>
  );
};

const ToriiGate = ({ left }: { left: number }) => (
  <div onClick={(e) => { e.stopPropagation(); playSuikinkutsu(); }} className="absolute bottom-[12vh] z-[3] cursor-pointer origin-bottom hover:brightness-110 transition-all drop-shadow-2xl" style={{ left: `${left}%`, width: '320px', height: '320px' }}>
    <svg viewBox="0 0 100 100" overflow="visible" style={{ filter: 'url(#watercolor-bleed)' }} className="w-full h-full" fill="#BA3B31">
      <path d="M15,95 L25,95 L22,25 L18,25 Z" />
      <path d="M75,95 L85,95 L82,25 L78,25 Z" />
      <path d="M10,95 L30,95 L30,90 L10,90 Z" fill="#4B3B3B" />
      <path d="M70,95 L90,95 L90,90 L70,90 Z" fill="#4B3B3B" />
      <path d="M-5,15 Q50,0 105,15 L102,25 Q50,15 -2,25 Z" fill="#A1271F" />
      <path d="M5,35 L95,35 L95,42 L5,42 Z" fill="#BA3B31" />
      <path d="M45,35 L55,35 L55,55 L45,55 Z" fill="#1C1515" />
      <path d="M22,50 L78,50 L78,55 L22,55 Z" />
    </svg>
  </div>
);

const Pagoda = ({ left }: { left: number }) => (
  <div onClick={(e) => { e.stopPropagation(); playSuikinkutsu(); }} className="absolute bottom-[10vh] z-[2] cursor-pointer origin-bottom hover:brightness-110 transition-all drop-shadow-2xl" style={{ left: `${left}%`, width: '350px', height: '550px' }}>
    <svg viewBox="0 0 100 150" overflow="visible" style={{ filter: 'url(#watercolor-bleed)' }} className="w-full h-full" fill="#2a2e30">
      <path d="M35,145 L65,145 L65,130 L35,130 Z" />
      <path d="M10,130 C30,125 70,125 90,130 L95,125 C70,110 30,110 5,125 Z" fill="#1c2022" />
      <path d="M40,120 L60,120 L58,95 L42,95 Z" />
      <path d="M15,95 C35,90 65,90 85,95 L90,90 C65,75 35,75 10,90 Z" fill="#1c2022" />
      <path d="M43,85 L57,85 L55,65 L45,65 Z" />
      <path d="M20,65 C40,60 60,60 80,65 L85,60 C60,45 40,45 15,60 Z" fill="#1c2022" />
      <path d="M45,55 L55,55 L53,35 L47,35 Z" />
      <path d="M25,35 C42,32 58,32 75,35 L80,30 C58,18 42,18 20,30 Z" fill="#1c2022" />
      <path d="M47,25 L53,25 L52,10 L48,10 Z" />
      <path d="M30,10 C45,8 55,8 70,10 L75,5 C55,-5 45,-5 25,5 Z" fill="#1c2022" />
      <path d="M49,0 L51,0 L51,-25 L49,-25 Z" fill="#5E2020" />
      <circle cx="50" cy="-5" r="3" fill="#5E2020" />
      <circle cx="50" cy="-10" r="2.5" fill="#5E2020" />
      <circle cx="50" cy="-15" r="2" fill="#5E2020" />
    </svg>
  </div>
);

const PineTree = ({ left, scale = 1, flip = false }: { left: number, scale?: number, flip?: boolean }) => (
  <div className="absolute bottom-[8vh] z-[2] w-[450px] h-[600px] origin-bottom pointer-events-none drop-shadow-2xl"
    style={{ left: `${left}%`, transform: `scaleX(${flip ? -1 : 1}) scale(${scale})` }}>
    <svg viewBox="0 0 100 120" style={{ filter: 'url(#watercolor-bleed)' }}>
      <path d="M50,120 Q40,90 55,50 T75,10" fill="none" stroke="#2D2824" strokeWidth="8" strokeLinecap="round" />
      <g opacity="0.8">
        <ellipse cx="75" cy="15" rx="35" ry="18" fill="#2A3B2E" />
        <ellipse cx="45" cy="55" rx="40" ry="20" fill="#1B2A1E" />
        <ellipse cx="85" cy="85" rx="45" ry="22" fill="#2A3B2E" />
        {/* Watercolor layered depth */}
        <ellipse cx="60" cy="45" rx="50" ry="25" fill="#2A3B2E" opacity="0.4" />
      </g>
    </svg>
  </div>
);

const SakuraTree = ({ left, scale = 1, flip = false }: { left: number, scale?: number, flip?: boolean }) => (
  <div className="absolute bottom-[10vh] z-[2] w-[550px] h-[650px] origin-bottom pointer-events-none drop-shadow-2xl"
    style={{ left: `${left}%`, transform: `scaleX(${flip ? -1 : 1}) scale(${scale})` }}>
    <svg viewBox="0 0 100 120" style={{ filter: 'url(#watercolor-bleed)' }}>
      {/* Tall, slender crooked trunk */}
      <path d="M50,120 Q48,90 52,60 T48,20" fill="none" stroke="#3D322E" strokeWidth="6" strokeLinecap="round" />
      {/* Higher branches */}
      <path d="M50,70 Q65,55 85,45" fill="none" stroke="#3D322E" strokeWidth="4" strokeLinecap="round" />
      <path d="M51,50 Q30,40 15,35" fill="none" stroke="#3D322E" strokeWidth="4" strokeLinecap="round" />
      <path d="M49,35 Q70,25 75,10" fill="none" stroke="#3D322E" strokeWidth="3" strokeLinecap="round" />
      <path d="M48,25 Q35,15 25,10" fill="none" stroke="#3D322E" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cloud-like clusters made of fused smaller leaf clumps */}
      <g opacity="0.85">
        {/* Top Center Cloud */}
        <path d="M40,20 C35,10 55,5 60,15 C70,10 75,25 65,30 C70,40 50,45 45,35 C35,35 30,25 40,20" fill="#F4CCD2" />
        <path d="M45,22 C42,15 52,12 55,18 C62,15 65,25 60,28 C62,35 52,38 48,32 C42,32 40,25 45,22" fill="#EDBEC5" />

        {/* Right branch Cloud */}
        <path d="M75,40 C70,30 90,25 95,35 C105,35 105,45 95,50 C100,60 80,60 75,50 C65,55 65,45 75,40" fill="#F4CCD2" />
        <path d="M80,42 C78,35 88,32 90,38 C98,38 98,45 90,48 C95,55 82,55 78,48 C72,50 72,45 80,42" fill="#DF94A0" />

        {/* Left branch Cloud */}
        <path d="M20,30 C10,20 30,15 35,25 C45,20 50,35 40,40 C45,50 25,50 20,40 C10,40 10,35 20,30" fill="#F4CCD2" />
        <path d="M22,32 C15,25 28,22 30,28 C38,25 42,35 35,38 C38,45 25,45 22,38 C15,38 15,35 22,32" fill="#EDBEC5" />

        {/* Upper Right minor cloud */}
        <path d="M65,10 C60,2 80,-2 85,8 C95,5 95,20 85,25 C90,35 70,35 65,25 C55,25 55,15 65,10" fill="#EDBEC5" />
        <path d="M68,12 C65,5 78,3 80,10 C88,8 88,18 80,22 C85,28 72,28 68,22 C62,22 62,15 68,12" fill="#F4CCD2" />

        {/* Upper Left minor cloud */}
        <path d="M30,12 C25,5 40,0 45,8 C55,8 50,20 45,22 C45,30 30,30 25,22 C15,22 15,15 30,12" fill="#F4CCD2" />
      </g>

      {/* Floating disconnected petals (the small leaves effect) */}
      <g fill="#F4CCD2" opacity="0.65">
        <ellipse cx="60" cy="38" rx="2" ry="1.5" transform="rotate(30 60 38)" />
        <ellipse cx="35" cy="45" rx="2" ry="1" transform="rotate(-20 35 45)" />
        <ellipse cx="80" cy="55" rx="1.5" ry="1" transform="rotate(15 80 55)" />
        <ellipse cx="45" cy="65" rx="2" ry="1.5" transform="rotate(-40 45 65)" />
        <ellipse cx="70" cy="70" rx="1.5" ry="1" transform="rotate(25 70 70)" />
        <ellipse cx="25" cy="60" rx="2" ry="1" transform="rotate(10 25 60)" />
        <ellipse cx="55" cy="85" rx="1.5" ry="1" transform="rotate(-15 55 85)" />
      </g>
    </svg>
  </div>
);

const ZenRocks = ({ left }: { left: number }) => (
  <div onClick={(e) => { e.stopPropagation(); playSuikinkutsu(); }} className="absolute bottom-[16vh] z-[12] cursor-pointer origin-bottom drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)]" style={{ left: `${left}%`, width: '220px', height: '80px' }}>
    <svg viewBox="0 0 100 50" overflow="visible" style={{ filter: 'url(#watercolor-bleed)' }} className="w-full h-full">
      <path d="M0,45 Q25,40 50,45 T100,45" fill="none" stroke="#D0CDBC" strokeWidth="1" />
      <path d="M0,48 Q25,43 50,48 T100,48" fill="none" stroke="#D0CDBC" strokeWidth="1" />
      <path d="M20,40 C15,30 25,20 35,25 C45,30 40,40 35,45 Z" fill="#6A737D" />
      <path d="M30,42 C30,35 40,32 50,38 C60,42 55,48 45,50 Z" fill="#4E5559" />
      <path d="M60,45 C60,35 70,30 80,35 C90,40 85,50 75,50 Z" fill="#78818A" />
    </svg>
  </div>
);

const SakuraParticles = () => (
  <div className="absolute inset-0 pointer-events-none z-[45] overflow-hidden">
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-[#F4CCD2] rounded-bl-full rounded-tr-full opacity-80"
        style={{ width: rnd(10, 15), height: rnd(10, 15), left: `${rnd(0, 100)}vw`, top: `-10vh` }}
        animate={{ y: ['-10vh', '110vh'], x: [0, rnd(100, 300), rnd(-50, 200), rnd(150, 400)], rotate: [0, 360, 720], scale: [1, 0.6, 1.2, 0.8] }}
        transition={{ duration: rnd(15, 30), repeat: Infinity, ease: 'linear', delay: rnd(0, 20) }}
      />
    ))}
  </div>
);

const CraneSystem = () => {
  const [flocks, setFlocks] = useState<{ id: number, top: number, speed: number, scale: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlocks(prev => [...prev, { id: Date.now(), top: rnd(15, 45), speed: rnd(25, 40), scale: rnd(0.5, 0.8) }]);
      setFlocks(prev => prev.filter(f => Date.now() - f.id < 45000));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const wingVariants = {
    flap: { rotateX: [0, 60, -20, 0], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }
  };

  return (
    <div className="absolute inset-0 z-[25] pointer-events-none overflow-hidden">
      {flocks.map((flock: { id: number, top: number, speed: number, scale: number }) => (
        <motion.div
          key={flock.id}
          className="absolute flex items-center gap-12 cursor-pointer" style={{ pointerEvents: 'auto' }}
          onClick={playSuikinkutsu}
          initial={{ x: '100vw', y: `${flock.top}vh`, scale: flock.scale }}
          animate={{ x: '-40vw', y: [`${flock.top}vh`, `${flock.top - 8}vh`, `${flock.top + 4}vh`, `${flock.top - 4}vh`] }}
          transition={{ x: { duration: flock.speed, ease: 'linear' }, y: { duration: flock.speed, ease: 'easeInOut' } }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative w-20 h-20" style={{ marginTop: rnd(-30, 30) }}>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }} className="w-full h-full">
                <svg viewBox="0 0 100 100" overflow="visible" style={{ filter: 'url(#watercolor-bleed)' }} className="w-full h-full" fill="#FFFFFF">
                  <path d="M10,50 Q40,40 60,50 T95,65" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                  <motion.g variants={wingVariants} animate="flap" transformOrigin="50px 50px">
                    <path d="M40,50 L20,10 L60,30 Z" fill="#F0F0F0" />
                    <path d="M40,50 L30,90 L60,70 Z" fill="#DCDCDC" opacity={0.8} />
                  </motion.g>
                </svg>
              </motion.div>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

const BiomeChunk = ({ biome, windSpeed }: { biome: string, windSpeed: number }) => {
  return (
    <div className="relative h-full flex-shrink-0" style={{ width: `${CHUNK_WIDTH}px` }}>
      <StoneBase />
      <WoodBoardwalk />

      {biome === 'shrine' && (
        <>
          <ToriiGate left={10} />
          <Pagoda left={45} />
          <SakuraTree left={80} scale={1.2} />
          <Deer left={30} />
        </>
      )}

      {biome === 'bamboo' && (
        <>
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-[5vh] w-6 bg-[#384A3B] transform origin-bottom drop-shadow-xl z-[2]"
              style={{ left: `${i * 5 + rnd(1, 4)}%`, height: `${rnd(120, 180)}%`, opacity: parseFloat(rnd(0.8, 1).toFixed(2)), filter: 'url(#watercolor-bleed)' }}
              animate={{ skewX: [0, rnd(2, 6), 0] }}
              transition={{ duration: 10 / windSpeed, repeat: Infinity, ease: 'easeInOut', delay: rnd(0, 3) }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#4A5D4E] opacity-20" />
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="absolute w-12 h-3 bg-[#4A5D4E] rounded-full origin-left" style={{ top: `${15 + j * 15}%`, left: '50%', transform: `rotate(${rnd(-40, -10)}deg) scaleX(${rnd(0.8, 1.4)})` }} />
              ))}
            </motion.div>
          ))}
          <PineTree left={65} scale={0.9} />
          <SakuraTree left={10} scale={0.8} />
          <Deer left={35} />
        </>
      )}

      {biome === 'zen' && (
        <>
          <PineTree left={5} scale={1.1} />
          <ZenRocks left={30} />
          <ZenRocks left={65} />
          <PineTree left={85} scale={0.7} flip={true} />
          <Deer left={50} />
        </>
      )}

      {biome === 'sakura' && (
        <>
          <SakuraTree left={15} scale={1.3} />
          <SakuraTree left={45} scale={1.1} flip={true} />
          <SakuraTree left={80} scale={1.4} />
          <ToriiGate left={5} />
          <Deer left={30} />
          <Deer left={60} />
        </>
      )}

      {biome === 'mixed' && (
        <>
          <Pagoda left={15} />
          <PineTree left={50} scale={1.2} />
          <ToriiGate left={85} />
          <Deer left={35} />
          <Deer left={70} />
        </>
      )}
    </div>
  );
};

export default function AndoHomepage() {
  const windSpeed = 1.0;
  const [chunks, setChunks] = useState<{ id: number, biome: string }[]>([]);
  const xOffset = useMotionValue(0);

  useEffect(() => {
    setChunks([
      { id: 1, biome: 'bamboo' },
      { id: 2, biome: 'shrine' },
      { id: 3, biome: 'sakura' },
    ]);

    const initAudio = () => {
      playSuikinkutsu();
      window.removeEventListener('click', initAudio);
    };
    window.addEventListener('click', initAudio);
    return () => window.removeEventListener('click', initAudio);
  }, []);

  useAnimationFrame((_t: number, delta: number) => {
    const moveBy = (40 * delta) / 1000;
    let currentX = xOffset.get() - moveBy;

    if (Math.abs(currentX) >= CHUNK_WIDTH) {
      currentX += CHUNK_WIDTH;
      setChunks((prev: { id: number, biome: string }[]) => [
        ...prev.slice(1),
        { id: Date.now(), biome: BIOMES[Math.floor(Math.random() * BIOMES.length)] }
      ]);
    }
    xOffset.set(currentX);
  });

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-[#EEECE4] selection:bg-[#BA3B31]/20 font-serif text-[#1C1F20]">
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <filter id="watercolor-bleed" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.8" result="blurred" />
          <feComponentTransfer in="blurred">
            <feFuncA type="linear" slope="1.5" intercept="-0.1" />
          </feComponentTransfer>
        </filter>
      </svg>

      <nav className="absolute inset-0 z-[70] pointer-events-none p-6 md:p-12 flex flex-col justify-between">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-normal tracking-wide text-[#2C2926]">A N D O</h1>
            <p className="text-[10px] md:text-xs uppercase opacity-60 font-sans text-[#4A433A]" style={{ letterSpacing: '8px' }}>Tea House • Ritual</p>
          </div>
        </div>


      </nav>

      <div className="absolute inset-0 z-10 flex">

        <div className="absolute top-[15%] right-[25%] w-32 h-32 rounded-full bg-[#FFFFFF] opacity-80 blur-[4px] pointer-events-none z-[1]" />

        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 400, repeat: Infinity, ease: "linear" }} className="absolute inset-y-0 left-0 w-[200%] flex items-end pointer-events-none opacity-50 z-[1] drop-shadow-2xl">
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ filter: 'url(#watercolor-bleed)' }} className="w-full h-[75vh] fill-[#B5C2C9]">
            <path d="M0,300 L0,180 L80,220 L150,120 L270,190 L380,80 L500,180 L580,220 L650,120 L770,190 L880,80 L1000,180 L1000,300 Z" />
            <path d="M0,300 L0,180 L80,220 L150,120 L270,190 L380,80 L500,180 L580,220 L650,120 L770,190 L880,80 L1000,180 L1000,300 Z" fill="black" opacity="0.1" transform="translate(10, 10)" />
          </svg>
        </motion.div>

        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 280, repeat: Infinity, ease: "linear" }} className="absolute inset-y-0 left-0 w-[200%] flex items-end pointer-events-none opacity-70 z-[1] drop-shadow-2xl">
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ filter: 'url(#watercolor-bleed)' }} className="w-full h-[60vh] fill-[#8A9BA3]">
            <path d="M0,300 L0,220 L60,180 L120,240 L280,100 L400,160 L500,220 L560,180 L620,240 L780,100 L900,160 L1000,220 L1000,300 Z" />
            <path d="M0,300 L0,220 L60,180 L120,240 L280,100 L400,160 L500,220 L560,180 L620,240 L780,100 L900,160 L1000,220 L1000,300 Z" fill="black" opacity="0.08" transform="translate(15, 10)" />
          </svg>
        </motion.div>

        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }} className="absolute inset-y-0 left-0 w-[200%] flex items-end pointer-events-none opacity-90 z-[2] drop-shadow-2xl">
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ filter: 'url(#watercolor-bleed)' }} className="w-full h-[45vh] fill-[#5B717B]">
            <path d="M0,300 L0,230 Q20,210 30,220 Q50,150 70,200 Q100,220 120,180 Q150,150 180,210 Q250,160 300,230 Q350,210 370,180 Q400,160 430,220 L500,230 Q520,210 530,220 Q550,150 570,200 Q600,220 620,180 Q650,150 680,210 Q750,160 800,230 Q850,210 870,180 Q900,160 930,220 L1000,230 L1000,300 Z" />
          </svg>
        </motion.div>

        <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-t from-[#EEECE4]/95 via-[#EEECE4]/40 to-transparent" />

        <GroundPlane />

        <motion.div className="absolute inset-y-0 left-0 flex items-end will-change-transform z-[10]" style={{ x: xOffset }}>
          {chunks.map((chunk: { id: number, biome: string }) => (
            <BiomeChunk key={chunk.id} biome={chunk.biome} windSpeed={windSpeed} />
          ))}
        </motion.div>

        <ShibaDog />
        <SakuraParticles />
      </div>

      <div className="absolute inset-0 z-[60] pointer-events-none opacity-60 mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23ffffff'/%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4' style='mix-blend-mode: multiply;'/%3E%3C/svg%3E")` }} />
    </main>
  );
}
