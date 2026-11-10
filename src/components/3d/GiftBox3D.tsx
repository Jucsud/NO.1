import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { isSoftwareGl, afterDraw, createContactShadowTexture } from './threeUtils';

interface GiftBox3DProps {
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const GiftBox3D: React.FC<GiftBox3DProps> = ({ isOpen, onToggleOpen }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number>(0);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const onToggleRef = useRef(onToggleOpen);
  onToggleRef.current = onToggleOpen;

  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.4, 4.2);

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

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff3db, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe6b0, 2.5);
    keyLight.position.set(3, 5, 4);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd6b779, 1.8);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Inside Mystery Glow Light
    const innerLight = new THREE.PointLight(0xffdd66, 0, 5);
    innerLight.position.set(0, 0.4, 0);
    scene.add(innerLight);

    // Materials
    const goldBoxMat = new THREE.MeshStandardMaterial({
      color: 0xc89e4c,
      metalness: 0.9,
      roughness: 0.18,
    });

    const satinRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xf3e2b8,
      metalness: 0.6,
      roughness: 0.28,
    });

    const innerDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1a150e,
      roughness: 0.7,
      metalness: 0.2,
      side: THREE.BackSide,
    });

    // Root Gift Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Contact Shadow
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(2.6, 2.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.78;
    rootGroup.add(shadowMesh);

    // Base Box Body (hollow cube)
    const boxSize = 1.3;
    const boxGroup = new THREE.Group();
    boxGroup.position.y = -0.15;
    rootGroup.add(boxGroup);

    const bodyGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const bodyMesh = new THREE.Mesh(bodyGeo, goldBoxMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    boxGroup.add(bodyMesh);

    // Inside lining
    const innerGeo = new THREE.BoxGeometry(boxSize * 0.96, boxSize * 0.96, boxSize * 0.96);
    const innerMesh = new THREE.Mesh(innerGeo, innerDarkMat);
    boxGroup.add(innerMesh);

    // Ribbon straps on body (cross)
    const ribbonWidth = 0.22;
    const ribbonThickness = 0.015;

    // Horizontal ribbon band
    const ribbonBandHGeo = new THREE.BoxGeometry(boxSize + ribbonThickness * 2, boxSize + ribbonThickness * 2, ribbonWidth);
    const ribbonBandH = new THREE.Mesh(ribbonBandHGeo, satinRibbonMat);
    boxGroup.add(ribbonBandH);

    // Vertical ribbon band
    const ribbonBandVGeo = new THREE.BoxGeometry(ribbonWidth, boxSize + ribbonThickness * 2, boxSize + ribbonThickness * 2);
    const ribbonBandV = new THREE.Mesh(ribbonBandVGeo, satinRibbonMat);
    boxGroup.add(ribbonBandV);

    // --- LID GROUP (Animates up & tilts) ---
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, boxSize / 2 + 0.03, 0);
    boxGroup.add(lidGroup);

    const lidSize = boxSize * 1.05;
    const lidHeight = 0.22;
    const lidGeo = new THREE.BoxGeometry(lidSize, lidHeight, lidSize);
    const lidMesh = new THREE.Mesh(lidGeo, goldBoxMat);
    lidMesh.position.y = lidHeight / 2;
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Lid ribbons
    const lidRibbon1Geo = new THREE.BoxGeometry(lidSize + 0.01, lidHeight + 0.01, ribbonWidth);
    const lidRibbon1 = new THREE.Mesh(lidRibbon1Geo, satinRibbonMat);
    lidRibbon1.position.y = lidHeight / 2;
    lidGroup.add(lidRibbon1);

    const lidRibbon2Geo = new THREE.BoxGeometry(ribbonWidth, lidHeight + 0.01, lidSize + 0.01);
    const lidRibbon2 = new THREE.Mesh(lidRibbon2Geo, satinRibbonMat);
    lidRibbon2.position.y = lidHeight / 2;
    lidGroup.add(lidRibbon2);

    // Luxury Bow on top (Torus loops)
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, lidHeight + 0.02, 0);
    lidGroup.add(bowGroup);

    const loopGeo = new THREE.TorusGeometry(0.18, 0.045, 12, 28, Math.PI * 1.6);
    // 4 decorative loops
    for (let i = 0; i < 4; i++) {
      const loop = new THREE.Mesh(loopGeo, satinRibbonMat);
      loop.rotation.y = (i * Math.PI) / 2 + Math.PI / 4;
      loop.rotation.x = Math.PI / 4;
      loop.position.y = 0.12;
      bowGroup.add(loop);
    }
    // Center knot
    const knotGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const knot = new THREE.Mesh(knotGeo, satinRibbonMat);
    knot.position.y = 0.1;
    bowGroup.add(knot);

    // --- SPARKLE BURST PARTICLES ---
    const burstCount = isSoftwareGl ? 40 : 100;
    const burstGeo = new THREE.BufferGeometry();
    const burstPos = new Float32Array(burstCount * 3);
    const burstVel = new Float32Array(burstCount * 3);

    for (let i = 0; i < burstCount; i++) {
      burstPos[i * 3] = 0;
      burstPos[i * 3 + 1] = 0.2;
      burstPos[i * 3 + 2] = 0;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45;
      const speed = 1.2 + Math.random() * 2.2;

      burstVel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      burstVel[i * 3 + 1] = Math.cos(phi) * speed + 0.8;
      burstVel[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }

    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
    const burstMat = new THREE.PointsMaterial({
      color: 0xffea9f,
      size: 0.06,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const burstPoints = new THREE.Points(burstGeo, burstMat);
    rootGroup.add(burstPoints);

    // Raycaster for click interaction on canvas
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects([bodyMesh, lidMesh, knot], true);

      if (intersects.length > 0) {
        onToggleRef.current();
      }
    };

    container.addEventListener('click', handleCanvasClick);

    // Mouse Tracking for Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = normX * 0.4;
      mouseRef.current.targetY = normY * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let lastTime = performance.now();
    let time = 0;
    let openProgress = 0;

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += delta;

      // Mouse Parallax interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * (delta * 4);
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * (delta * 4);

      // Smooth Gentle Floating & Rotation
      rootGroup.position.y = Math.sin(time * 1.5) * 0.06;
      rootGroup.rotation.y = time * 0.25 + mouseRef.current.x * 0.6;
      rootGroup.rotation.x = mouseRef.current.y * 0.3;

      // Smooth Open/Close Animation State Transition
      const targetProgress = isOpenRef.current ? 1 : 0;
      openProgress += (targetProgress - openProgress) * Math.min(delta * 4.5, 1);

      // Lid lifts and tilts backward
      lidGroup.position.y = boxSize / 2 + 0.03 + openProgress * 1.1;
      lidGroup.position.z = -openProgress * 0.4;
      lidGroup.rotation.x = -openProgress * 0.7;
      lidGroup.rotation.z = openProgress * 0.15;

      // Mystery Inner Glow expands when opened
      innerLight.intensity = openProgress * 4.5;

      // Burst particle animation
      if (openProgress > 0.05) {
        burstMat.opacity = Math.min((1 - openProgress * 0.5) * 1.0, 1.0);
        const positions = burstGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < burstCount; i++) {
          positions[i * 3] += burstVel[i * 3] * delta * openProgress;
          positions[i * 3 + 1] += (burstVel[i * 3 + 1] - 0.5 * time) * delta * openProgress;
          positions[i * 3 + 2] += burstVel[i * 3 + 2] * delta * openProgress;
        }
        burstGeo.attributes.position.needsUpdate = true;
      } else {
        burstMat.opacity = 0;
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
      container.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('mousemove', handleMouseMove);

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
      className="relative w-full h-[380px] md:h-[460px] cursor-pointer mx-auto flex items-center justify-center select-none"
      aria-label="3D Interactive Golden Surprise Gift Box. Click to open."
      data-testid="giftbox-3d"
    />
  );
};
