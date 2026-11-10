import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { isSoftwareGl, afterDraw } from './threeUtils';

export const ConstellationHeart3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    // Parametric 3D Heart Points
    const heartGroup = new THREE.Group();
    scene.add(heartGroup);

    const heartPoints: THREE.Vector3[] = [];
    const pointCount = 64;

    for (let i = 0; i < pointCount; i++) {
      const t = (i / pointCount) * Math.PI * 2;
      // Heart parametric equation
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const z = Math.sin(t * 3) * 2.2;

      // Scale to viewable size
      heartPoints.push(new THREE.Vector3(x * 0.08, y * 0.08 + 0.1, z * 0.08));
    }

    // Glowing Star Nodes at heart coordinates
    const starGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffea9f });

    heartPoints.forEach((pt) => {
      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.position.copy(pt);
      heartGroup.add(starMesh);
    });

    // Connecting Constellation Lines
    const lineCurve = new THREE.CatmullRomCurve3(heartPoints, true);
    const linePoints = lineCurve.getPoints(120);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xd6b779,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const lineMesh = new THREE.Line(lineGeo, lineMat);
    heartGroup.add(lineMesh);

    // Floating Stardust Halo around Heart
    const dustCount = isSoftwareGl ? 35 : 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 3.5;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0xfff0b8,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    heartGroup.add(dustPoints);

    // Central Warm Heart Light
    const heartLight = new THREE.PointLight(0xffd577, 2.5, 4);
    heartGroup.add(heartLight);

    // Animation Loop
    let lastTime = performance.now();
    let time = 0;

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += delta;

      // Gentle pulse & rotation
      const pulse = 1 + Math.sin(time * 2.2) * 0.04;
      heartGroup.scale.set(pulse, pulse, pulse);
      heartGroup.rotation.y = time * 0.35;
      heartGroup.rotation.x = Math.sin(time * 0.5) * 0.12;

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
      className="relative w-64 h-64 md:w-80 md:h-80 mx-auto select-none"
      aria-label="3D Celestial Golden Constellation Heart"
      data-testid="constellation-heart-3d"
    />
  );
};
