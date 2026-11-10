import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { isSoftwareGl, afterDraw, createContactShadowTexture, createStarGeometry } from './threeUtils';

interface Hero3DSceneProps {
  celebrantName: string;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 5.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.4);
    keyLight.position.set(4, 6, 4);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xbfa16a, 1.8);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const candleLight = new THREE.PointLight(0xffaa44, 2.0, 4);
    candleLight.position.set(0, 1.3, 0);
    scene.add(candleLight);

    // Materials Library
    const champagneGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd6b779,
      metalness: 0.88,
      roughness: 0.18,
    });

    const metallicGoldMat = new THREE.MeshStandardMaterial({
      color: 0xbfa16a,
      metalness: 0.92,
      roughness: 0.15,
    });

    const roseGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4a59a,
      metalness: 0.82,
      roughness: 0.22,
    });

    const ivoryFrostingMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f2,
      roughness: 0.45,
      metalness: 0.05,
    });

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffe680,
    });

    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xe8d3a7,
      metalness: 0.75,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- 1. PROCEDURAL 3D BIRTHDAY CAKE (Multi-part Composite Group) ---
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, -0.75, 0);

    // Ground Contact Shadow Disc
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    cakeGroup.add(shadowMesh);

    // Cake Pedestal / Golden Stand
    const standBaseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.1, 40);
    const standMesh = new THREE.Mesh(standBaseGeo, metallicGoldMat);
    standMesh.position.y = 0.05;
    standMesh.receiveShadow = true;
    cakeGroup.add(standMesh);

    const standPlateGeo = new THREE.CylinderGeometry(1.45, 1.45, 0.05, 48);
    const standPlate = new THREE.Mesh(standPlateGeo, champagneGoldMat);
    standPlate.position.y = 0.12;
    cakeGroup.add(standPlate);

    // Tier 1 (Lower Tier)
    const tier1Geo = new THREE.CylinderGeometry(1.2, 1.2, 0.55, 48);
    const tier1 = new THREE.Mesh(tier1Geo, ivoryFrostingMat);
    tier1.position.y = 0.42;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // Tier 1 Gold Filigree Beaded Border
    const beadCount = 28;
    const beadRadius = 1.22;
    const beadGeo = new THREE.SphereGeometry(0.045, 12, 12);
    for (let i = 0; i < beadCount; i++) {
      const angle = (i / beadCount) * Math.PI * 2;
      const bead = new THREE.Mesh(beadGeo, metallicGoldMat);
      bead.position.set(Math.cos(angle) * beadRadius, 0.16, Math.sin(angle) * beadRadius);
      cakeGroup.add(bead);
    }

    // Tier 2 (Upper Tier)
    const tier2Geo = new THREE.CylinderGeometry(0.78, 0.78, 0.45, 40);
    const tier2 = new THREE.Mesh(tier2Geo, ivoryFrostingMat);
    tier2.position.y = 0.92;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    // Tier 2 Gold Trim Ring
    const trimGeo = new THREE.TorusGeometry(0.79, 0.025, 12, 40);
    const trimMesh = new THREE.Mesh(trimGeo, champagneGoldMat);
    trimMesh.rotation.x = Math.PI / 2;
    trimMesh.position.y = 1.14;
    cakeGroup.add(trimMesh);

    // Candles and Glowing Flames (3 elegant candles)
    const candleStickGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.38, 16);
    const candleOffsets = [
      { x: -0.24, z: 0.15 },
      { x: 0.24, z: 0.15 },
      { x: 0, z: -0.22 },
    ];
    const flameMeshes: THREE.Mesh[] = [];

    candleOffsets.forEach((pos) => {
      // Candle stick
      const candle = new THREE.Mesh(candleStickGeo, metallicGoldMat);
      candle.position.set(pos.x, 1.34, pos.z);
      candle.castShadow = true;
      cakeGroup.add(candle);

      // Flame (faceted teardrop)
      const flameGeo = new THREE.ConeGeometry(0.04, 0.12, 12);
      flameGeo.translate(0, 0.06, 0);
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(pos.x, 1.54, pos.z);
      cakeGroup.add(flame);
      flameMeshes.push(flame);
    });

    rootGroup.add(cakeGroup);

    // --- 2. FLOATING REALISTIC BALLOONS (Composite 3D Groups) ---
    interface BalloonItem {
      group: THREE.Group;
      baseY: number;
      speed: number;
      driftFactor: number;
      phase: number;
    }
    const balloons: BalloonItem[] = [];

    const balloonConfigs = [
      { x: -2.3, y: 0.6, z: -0.4, scale: 0.72, mat: champagneGoldMat, speed: 0.8 },
      { x: -1.9, y: 1.25, z: -1.2, scale: 0.58, mat: roseGoldMat, speed: 1.1 },
      { x: -2.7, y: 1.45, z: 0.2, scale: 0.65, mat: metallicGoldMat, speed: 0.95 },
      { x: 2.3, y: 0.65, z: -0.3, scale: 0.7, mat: metallicGoldMat, speed: 0.85 },
      { x: 1.9, y: 1.3, z: -1.1, scale: 0.6, mat: champagneGoldMat, speed: 1.15 },
      { x: 2.6, y: 1.5, z: 0.1, scale: 0.65, mat: roseGoldMat, speed: 0.9 },
      { x: -1.3, y: 1.6, z: -1.5, scale: 0.52, mat: champagneGoldMat, speed: 1.2 },
      { x: 1.3, y: 1.65, z: -1.6, scale: 0.55, mat: metallicGoldMat, speed: 1.05 },
    ];

    balloonConfigs.forEach((cfg, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(cfg.x, cfg.y, cfg.z);
      bGroup.scale.setScalar(cfg.scale);

      // Balloon Body (stretched sphere)
      const bGeo = new THREE.SphereGeometry(0.65, 24, 24);
      bGeo.scale(1, 1.22, 1);
      const bMesh = new THREE.Mesh(bGeo, cfg.mat);
      bMesh.castShadow = true;
      bGroup.add(bMesh);

      // Balloon Knot (bottom cone)
      const knotGeo = new THREE.ConeGeometry(0.08, 0.1, 12);
      knotGeo.rotateX(Math.PI);
      const knotMesh = new THREE.Mesh(knotGeo, cfg.mat);
      knotMesh.position.y = -0.8;
      bGroup.add(knotMesh);

      // Hanging curlicue string (curved line)
      const curvePoints: THREE.Vector3[] = [];
      const segs = 18;
      for (let s = 0; s <= segs; s++) {
        const t = s / segs;
        const sx = Math.sin(t * Math.PI * 3.5) * 0.08 * (1 - t * 0.5);
        const sy = -0.85 - t * 1.4;
        const sz = Math.cos(t * Math.PI * 3.5) * 0.05 * (1 - t * 0.5);
        curvePoints.push(new THREE.Vector3(sx, sy, sz));
      }
      const stringCurve = new THREE.CatmullRomCurve3(curvePoints);
      const stringGeo = new THREE.TubeGeometry(stringCurve, 16, 0.008, 6, false);
      const stringMat = new THREE.MeshBasicMaterial({ color: 0xd6b779, transparent: true, opacity: 0.5 });
      const stringMesh = new THREE.Mesh(stringGeo, stringMat);
      bGroup.add(stringMesh);

      rootGroup.add(bGroup);
      balloons.push({
        group: bGroup,
        baseY: cfg.y,
        speed: cfg.speed,
        driftFactor: 0.08 + (idx % 3) * 0.03,
        phase: idx * 1.3,
      });
    });

    // --- 3. FLOATING 3D GOLDEN STARS & RIBBONS ---
    interface StarItem {
      mesh: THREE.Mesh;
      rotSpeedX: number;
      rotSpeedY: number;
      baseY: number;
      driftSpeed: number;
      phase: number;
    }
    const stars: StarItem[] = [];

    const starPositions = [
      { x: -1.6, y: 0.8, z: 0.8, s: 0.18 },
      { x: 1.7, y: 0.7, z: 0.9, s: 0.16 },
      { x: -2.8, y: 0.3, z: -0.5, s: 0.22 },
      { x: 2.7, y: 0.4, z: -0.4, s: 0.2 },
      { x: 0.8, y: 2.1, z: 0.4, s: 0.14 },
      { x: -0.7, y: 2.2, z: 0.5, s: 0.15 },
    ];

    starPositions.forEach((sp, idx) => {
      const starGeo = createStarGeometry(0.3, 0.8, 5, 0.2);
      const starMesh = new THREE.Mesh(starGeo, idx % 2 === 0 ? champagneGoldMat : metallicGoldMat);
      starMesh.position.set(sp.x, sp.y, sp.z);
      starMesh.scale.setScalar(sp.s);
      rootGroup.add(starMesh);

      stars.push({
        mesh: starMesh,
        rotSpeedX: 0.4 + (idx % 3) * 0.2,
        rotSpeedY: 0.6 + (idx % 2) * 0.3,
        baseY: sp.y,
        driftSpeed: 0.9 + idx * 0.1,
        phase: idx * 0.8,
      });
    });

    // Spiraling Metallic Golden Ribbon Streamers
    const ribbonCurves = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.8, 2.5, -0.6),
        new THREE.Vector3(-1.4, 1.8, 0.2),
        new THREE.Vector3(-1.7, 1.1, -0.2),
        new THREE.Vector3(-1.3, 0.4, 0.4),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.7, 2.4, -0.5),
        new THREE.Vector3(1.3, 1.7, 0.3),
        new THREE.Vector3(1.6, 1.0, -0.3),
        new THREE.Vector3(1.2, 0.3, 0.5),
      ]),
    ];

    ribbonCurves.forEach((curve) => {
      const rGeo = new THREE.TubeGeometry(curve, 32, 0.035, 8, false);
      const rMesh = new THREE.Mesh(rGeo, ribbonMat);
      rootGroup.add(rMesh);
    });

    // --- 4. FLOATING SPARKLING GOLDEN DUST PARTICLES ---
    const particleCount = isSoftwareGl ? 60 : 150;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = Math.random() * 4.5 - 1.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      particleSpeeds[i] = 0.2 + Math.random() * 0.4;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffe6a3,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Mouse Tracking for Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = normX * 0.4;
      mouseRef.current.targetY = normY * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    let time = 0;

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += delta;

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * (delta * 3.5);
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * (delta * 3.5);

      camera.position.x = mouseRef.current.x * 1.2;
      camera.position.y = 1.35 + mouseRef.current.y * 0.8;
      camera.lookAt(0, 0.35, 0);

      // Slowly rotate cake
      cakeGroup.rotation.y = time * 0.12;

      // Candle flame subtle flicker
      flameMeshes.forEach((flame, idx) => {
        const flicker = 1 + Math.sin(time * 12 + idx * 2.5) * 0.12;
        flame.scale.set(flicker, flicker * 1.1, flicker);
      });
      candleLight.intensity = 1.8 + Math.sin(time * 14) * 0.3;

      // Floating Balloons gentle bobbing & rotation
      balloons.forEach((b) => {
        b.group.position.y = b.baseY + Math.sin(time * b.speed + b.phase) * b.driftFactor;
        b.group.rotation.y = Math.sin(time * 0.3 + b.phase) * 0.15;
        b.group.rotation.z = Math.cos(time * 0.4 + b.phase) * 0.05;
      });

      // Rotating Stars
      stars.forEach((s) => {
        s.mesh.rotation.x += s.rotSpeedX * delta;
        s.mesh.rotation.y += s.rotSpeedY * delta;
        s.mesh.position.y = s.baseY + Math.sin(time * s.driftSpeed + s.phase) * 0.08;
      });

      // Drifting Golden Dust Particles
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += particleSpeeds[i] * delta * 0.3;
        if (pos[i * 3 + 1] > 3.8) {
          pos[i * 3 + 1] = -1.0;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(renderer, animate, frameIdRef);
      } else {
        frameIdRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      clearTimeout(frameIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Clean disposal
      renderer.dispose();
      if (container && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[520px] md:h-[620px] lg:h-[680px] overflow-hidden select-none"
      style={{ touchAction: 'pan-y' }}
      aria-label="Interactive 3D Luxury Birthday Cake and Floating Golden Balloons"
      data-testid="hero-3d-scene"
    />
  );
};
