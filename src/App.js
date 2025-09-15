import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import GlobeDots from './components/GlobeDots';
import Controls from './components/Controls';
import './App.css';

function App() {
  const [globeProps, setGlobeProps] = useState({
    density: 6,
    threshold: 120,
    pointSize: 0.05,
    autoRotate: true,
    showStars: true,
  });

  return (
    <div className="App">
      <div className="controls-panel">
        <h1>3D Globe Visualizer</h1>
        <Controls globeProps={globeProps} setGlobeProps={setGlobeProps} />
      </div>
      
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <color attach="background" args={["#020210"]} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          
          <GlobeDots 
            density={globeProps.density}
            threshold={globeProps.threshold}
            pointSize={globeProps.pointSize}
            autoRotate={globeProps.autoRotate}
          />
          
          {globeProps.showStars && <Stars radius={100} depth={50} count={5000} factor={4} />}
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.8}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default App;