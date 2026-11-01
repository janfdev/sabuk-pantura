import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSeabedCanvasProps {
  className?: string;
}

export const ThreeSeabedCanvas: React.FC<ThreeSeabedCanvasProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f3ea);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 5.0);
    camera.lookAt(0.2, 0.2, 0);

    // 2. High-DPI Antialiased WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Precision Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7e6, 1.3);
    sunLight.position.set(5, 8, 4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xd4e4da, 0.5);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // 4. Procedural Bathymetric Slope
    const planeGeo = new THREE.PlaneGeometry(8, 5.2, 54, 40);
    planeGeo.rotateX(-Math.PI / 2);

    const posAttr = planeGeo.attributes.position as THREE.BufferAttribute;
    const origPositions = new Float32Array(posAttr.array);

    for (let i = 0; i < posAttr.count; i++) {
      const x = origPositions[i * 3];
      const z = origPositions[i * 3 + 2];
      const slope = (x + 2.8) * 0.24;
      const ripple = Math.sin(x * 1.6) * Math.cos(z * 1.8) * 0.14;
      posAttr.setY(i, slope + ripple - 0.45);
    }
    planeGeo.computeVertexNormals();

    const planeMat = new THREE.MeshStandardMaterial({
      color: 0xc8bea8,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true,
    });
    const seabedMesh = new THREE.Mesh(planeGeo, planeMat);
    seabedMesh.receiveShadow = true;
    scene.add(seabedMesh);

    // 5. Architectural Wireframe Contour Overlay (Survey Blueprint Style)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x8a7f6c,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireMesh = new THREE.Mesh(planeGeo, wireMat);
    wireMesh.position.y = 0.005;
    scene.add(wireMesh);

    // 6. Translucent Coastal Tidal Water Layer
    const waterGeo = new THREE.PlaneGeometry(8, 5.2, 32, 24);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x163828,
      transparent: true,
      opacity: 0.58,
      roughness: 0.12,
      metalness: 0.15,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -0.04;
    scene.add(waterMesh);

    // 7. Stylized Rhizophora Prop-Roots & Canopy Clusters
    const treeGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x112b1d, roughness: 0.92 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x1e4f33, roughness: 0.55 });
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xb55a33, roughness: 0.4 });

    const treePositions = [
      { x: 1.25, z: 0.15, scale: 1.05 },
      { x: 2.1, z: -0.65, scale: 0.88 },
      { x: 2.45, z: 0.75, scale: 0.95 },
    ];

    treePositions.forEach(({ x, z, scale }) => {
      const singleTree = new THREE.Group();
      singleTree.position.set(x, 0.25, z);
      singleTree.scale.setScalar(scale);

      // Canopy
      const canopyGeo = new THREE.DodecahedronGeometry(0.42, 1);
      const canopy = new THREE.Mesh(canopyGeo, leafMat);
      canopy.position.y = 1.15;
      canopy.castShadow = true;
      singleTree.add(canopy);

      // Propagule Seed Accent
      const seedGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const seed = new THREE.Mesh(seedGeo, flowerMat);
      seed.position.set(0.18, 0.9, 0.15);
      singleTree.add(seed);

      // Main Stem
      const stemGeo = new THREE.CylinderGeometry(0.045, 0.065, 0.85, 8);
      const stem = new THREE.Mesh(stemGeo, trunkMat);
      stem.position.y = 0.58;
      stem.castShadow = true;
      singleTree.add(stem);

      // Curved Arching Prop Roots
      const rootCount = 6;
      for (let r = 0; r < rootCount; r++) {
        const angle = (r / rootCount) * Math.PI * 2;
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, 0.45, 0),
          new THREE.Vector3(Math.cos(angle) * 0.38, 0.24, Math.sin(angle) * 0.38),
          new THREE.Vector3(Math.cos(angle) * 0.52, -0.3, Math.sin(angle) * 0.52)
        );
        const rootGeo = new THREE.TubeGeometry(curve, 10, 0.022, 6, false);
        const rootMesh = new THREE.Mesh(rootGeo, trunkMat);
        rootMesh.castShadow = true;
        singleTree.add(rootMesh);
      }

      treeGroup.add(singleTree);
    });
    scene.add(treeGroup);

    // 8. Floating Micro-Suspension Particles (Organic Plankton)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePos[p * 3] = (Math.random() - 0.5) * 5;
      particlePos[p * 3 + 1] = Math.random() * 0.8 - 0.2;
      particlePos[p * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x82a991,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 9. Parallax Tracking
    let targetRotY = 0;
    let targetRotX = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = normX * 0.24;
      targetRotX = normY * 0.14;
    };
    container.addEventListener('mousemove', handlePointerMove);

    // 10. Viewport Intersection Observer
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = !!entry?.isIntersecting;
    });
    observer.observe(container);

    // 11. Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Tide Breathing
      waterMesh.position.y = -0.04 + Math.sin(elapsed * 1.1) * 0.038;

      // Canopy Breeze
      treeGroup.children.forEach((tree, idx) => {
        tree.rotation.z = Math.sin(elapsed * 1.4 + idx) * 0.02;
      });

      // Camera Smooth Interpolation
      camera.position.x += (Math.sin(targetRotY) * 2.4 - camera.position.x) * 0.045;
      camera.position.y += (3.4 + targetRotX * 1.4 - camera.position.y) * 0.045;
      camera.lookAt(0.2, 0.15, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      wireMat.dispose();
      waterGeo.dispose();
      waterMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[260px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing ${className || ''}`}
      aria-label="Model 3D Interaktif Batimetri Pasang Surut dan Struktur Akar Mangrove"
    />
  );
};
