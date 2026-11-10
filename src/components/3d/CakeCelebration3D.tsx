import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { isSoftwareGl, afterDraw, createContactShadowTexture } from './threeUtils';

interface CakeCelebration3DProps {
  isBlown: boolean;
}

export const CakeCelebration3D: React.FC<CakeCelebration3DProps> = ({ isBlown }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number>(0);
  const isBlownRef = useRef(isBlown);
  isBlownRef.current = isBlown;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 1.4, 4.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Reflection Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff1dc, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffebc4, 2.2);
    keyLight.position.set(3.5, 5, 3.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xbfa16a, 1.6);
    rimLight.position.set(-3.5, 2.5, -3);
    scene.add(rimLight);

    // Candle Flames Light
    const candleLight = new THREE.PointLight(0xffaa33, 2.5, 4.5);
    candleLight.position.set(0, 1.4, 0);
    scene.add(candleLight);

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd6b779,
      metalness: 0.9,
      roughness: 0.16,
    });

    const champagneMat = new THREE.MeshStandardMaterial({
      color: 0xbfa16a,
      metalness: 0.88,
      roughness: 0.2,
    });

    const frostingMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7,
      roughness: 0.4,
      metalness: 0.04,
    });

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffea80,
    });

    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xdcd8d0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Ground Shadow Disc
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.7;
    rootGroup.add(shadowMesh);

    // Cake Group
    const cakeGroup = new THREE.Group();
    cakeGroup.position.y = -0.68;
    rootGroup.add(cakeGroup);

    // Base Stand
    const standGeo = new THREE.CylinderGeometry(1.4, 1.55, 0.08, 48);
    const stand = new THREE.Mesh(standGeo, goldMat);
    stand.position.y = 0.04;
    stand.castShadow = true;
    stand.receiveShadow = true;
    cakeGroup.add(stand);

    // Tier 1 (Bottom Tier)
    const tier1Geo = new THREE.CylinderGeometry(1.25, 1.25, 0.5, 48);
    const tier1 = new THREE.Mesh(tier1Geo, frostingMat);
    tier1.position.y = 0.33;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // Tier 1 Gold Pearl Border
    const beadsCount = 32;
    const beadRadius = 1.26;
    const beadGeo = new THREE.SphereGeometry(0.04, 12, 12);
    for (let i = 0; i < beadsCount; i++) {
      const angle = (i / beadsCount) * Math.PI * 2;
      const bead = new THREE.Mesh(beadGeo, goldMat);
      bead.position.set(Math.cos(angle) * beadRadius, 0.1, Math.sin(angle) * beadRadius);
      cakeGroup.add(bead);
    }

    // Tier 2 (Middle Tier)
    const tier2Geo = new THREE.CylinderGeometry(0.85, 0.85, 0.42, 40);
    const tier2 = new THREE.Mesh(tier2Geo, frostingMat);
    tier2.position.y = 0.79;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    // Tier 2 Gold Trim Ring
    const trimGeo = new THREE.TorusGeometry(0.86, 0.025, 12, 40);
    const trimMesh = new THREE.Mesh(trimGeo, champagneMat);
    trimMesh.rotation.x = Math.PI / 2;
    trimMesh.position.y = 1.0;
    cakeGroup.add(trimMesh);

    // Tier 3 (Top Tier)
    const tier3Geo = new THREE.CylinderGeometry(0.48, 0.48, 0.35, 32);
    const tier3 = new THREE.Mesh(tier3Geo, frostingMat);
    tier3.position.y = 1.18;
    tier3.castShadow = true;
    tier3.receiveShadow = true;
    cakeGroup.add(tier3);

    // 5 Candles with glowing flames
    const candleCount = 5;
    const candleRadius = 0.32;
    const candleStickGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.32, 16);
    const flameGeo = new THREE.ConeGeometry(0.035, 0.11, 12);
    flameGeo.translate(0, 0.055, 0);

    const flameMeshes: THREE.Mesh[] = [];
    const candlePositions: THREE.Vector3[] = [];

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2;
      const cx = Math.cos(angle) * candleRadius;
      const cz = Math.sin(angle) * candleRadius;
      const candlePos = new THREE.Vector3(cx, 1.51, cz);
      candlePositions.push(candlePos);

      // Stick
      const stick = new THREE.Mesh(candleStickGeo, goldMat);
      stick.position.set(cx, 1.48, cz);
      stick.castShadow = true;
      cakeGroup.add(stick);

      // Flame
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(cx, 1.64, cz);
      cakeGroup.add(flame);
      flameMeshes.push(flame);
    }

    // Procedural Smoke Particles (appear when blown)
    const smokePuffs: THREE.Mesh[] = [];
    const smokeGeo = new THREE.SphereGeometry(0.06, 12, 12);
    for (let i = 0; i < candleCount * 3; i++) {
      const smokeMesh = new THREE.Mesh(smokeGeo, smokeMat.clone());
      const cIdx = i % candleCount;
      smokeMesh.position.copy(candlePositions[cIdx]);
      smokeMesh.position.y += 0.15;
      cakeGroup.add(smokeMesh);
      smokePuffs.push(smokeMesh);
    }

    // Rising Balloons (Ascend when blown)
    const balloonRisingGroup = new THREE.Group();
    rootGroup.add(balloonRisingGroup);

    const risingBalloons: { mesh: THREE.Group; speed: number; drift: number }[] = [];
    const bColors = [goldMat, champagneMat, new THREE.MeshStandardMaterial({ color: 0xd4a59a, metalness: 0.85, roughness: 0.2 })];

    for (let i = 0; i < 7; i++) {
      const bG = new THREE.Group();
      const bMeshGeo = new THREE.SphereGeometry(0.4, 20, 20);
      bMeshGeo.scale(1, 1.25, 1);
      const bMesh = new THREE.Mesh(bMeshGeo, bColors[i % bColors.length]);
      bG.add(bMesh);

      const angle = (i / 7) * Math.PI * 2;
      const r = 1.8 + Math.random() * 0.8;
      bG.position.set(Math.cos(angle) * r, -1.5, Math.sin(angle) * r);
      bG.scale.setScalar(0.7 + Math.random() * 0.3);

      balloonRisingGroup.add(bG);
      risingBalloons.push({
        mesh: bG,
        speed: 1.2 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.4,
      });
    }

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    let time = 0;
    let flameFadeProgress = 0;
    let smokeProgress = 0;

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += delta;

      // Slow elegant cake rotation
      cakeGroup.rotation.y = time * 0.18;

      const blown = isBlownRef.current;

      if (blown) {
        // Candles extinguish smoothly
        flameFadeProgress = Math.min(flameFadeProgress + delta * 3.5, 1);
        const flameScale = 1 - flameFadeProgress;

        flameMeshes.forEach((flame) => {
          flame.scale.setScalar(Math.max(flameScale, 0.0001));
        });
        candleLight.intensity = Math.max((1 - flameFadeProgress) * 2.5, 0);

        // Smoke puff ascends
        smokeProgress += delta * 1.2;
        smokePuffs.forEach((puff, idx) => {
          const mat = puff.material as THREE.MeshBasicMaterial;
          const puffTime = (smokeProgress + idx * 0.25) % 1.5;
          puff.position.y = 1.68 + puffTime * 0.9;
          puff.position.x += Math.sin(time * 3 + idx) * 0.003;
          puff.scale.setScalar(1 + puffTime * 2.5);
          mat.opacity = Math.max((1 - puffTime / 1.5) * 0.5, 0);
        });

        // Balloons rise gracefully into the sky
        risingBalloons.forEach((rb) => {
          rb.mesh.position.y += rb.speed * delta;
          rb.mesh.position.x += rb.drift * delta;
          rb.mesh.rotation.y += 0.5 * delta;
        });
      } else {
        // Living, flickering candle flames
        flameMeshes.forEach((flame, idx) => {
          const flicker = 1 + Math.sin(time * 14 + idx * 2.2) * 0.14;
          flame.scale.set(flicker, flicker * 1.15, flicker);
        });
        candleLight.intensity = 2.4 + Math.sin(time * 16) * 0.35;
      }

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
      window.removeEventListener('resize', handleResize);

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
      className="relative w-full h-[400px] md:h-[480px] select-none mx-auto"
      aria-label="3D Birthday Cake for Make A Wish ceremony"
      data-testid="cake-celebration-3d"
    />
  );
};
