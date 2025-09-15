import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import "./GlobeDots.css";

// GlobeDots component
function latLonFromUV(u, v) {
  const lon = (u - 0.5) * Math.PI * 2.0;
  const lat = (0.5 - v) * Math.PI;
  return { lat, lon };
}

const GlobeDots = ({
  imageUrl = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
  radius = 4,
  density = 6,
  threshold = 120,
  pointSize = 0.05,
  autoRotate = true,
  onInitializationComplete
}) => {
  const pointsRef = useRef();
  const [geometry, setGeometry] = useState(null);
  const [material, setMaterial] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [imageUrl]);

  useEffect(() => {
    if (!texture || !texture.image) return;

    const img = texture.image;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const tmpPositions = [];
    const tmpColors = [];

    for (let y = 0; y < canvas.height; y += density) {
      for (let x = 0; x < canvas.width; x += density) {
        const i = (y * canvas.width + x) * 4;
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const bright = (r + g + b) / 3;
        
        if (bright > threshold) {
          const u = x / canvas.width;
          const v = y / canvas.height;
          const { lat, lon } = latLonFromUV(u, v);
          const px = radius * Math.cos(lat) * Math.cos(lon);
          const py = radius * Math.sin(lat);
          const pz = radius * Math.cos(lat) * Math.sin(lon);
          
          tmpPositions.push(px, py, pz);
          tmpColors.push(r / 255, g / 255, b / 255);
        }
      }
    }

    const positions = new Float32Array(tmpPositions);
    const colors = new Float32Array(tmpColors);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    if (colors.length > 0) {
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }
    
    geo.computeBoundingSphere();

    const dotCanvas = document.createElement("canvas");
    dotCanvas.width = 64;
    dotCanvas.height = 64;
    const dotCtx = dotCanvas.getContext("2d");
    
    if (dotCtx) {
      dotCtx.fillStyle = "#ffffff";
      dotCtx.beginPath();
      dotCtx.arc(32, 32, 28, 0, Math.PI * 2);
      dotCtx.closePath();
      dotCtx.fill();
    }

    const dotTexture = new THREE.CanvasTexture(dotCanvas);
    const mat = new THREE.PointsMaterial({
      size: pointSize,
      sizeAttenuation: true,
      vertexColors: true,
      map: dotTexture,
      alphaTest: 0.01,
      transparent: true,
    });

    setGeometry(geo);
    setMaterial(mat);
    setInitialized(true);
  }, [texture, density, threshold, radius, pointSize]);

  useEffect(() => {
    if (initialized && onInitializationComplete) {
      onInitializationComplete();
    }
  }, [initialized, onInitializationComplete]);

  useFrame((state, delta) => {
    if (autoRotate && pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15;
    }
  });

  if (!geometry || !material) {
    return null;
  }

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
};

export default GlobeDots;