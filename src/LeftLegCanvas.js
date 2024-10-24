// FirstCanvas.js
import React from 'react';
import LeftLeg from './LeftLeg';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

function LeftLegCanvas() {
  const modelPosition = [-10, -1, -10];
  const modelScale = 3;

  return (
    <div style={{ width: 400, height: 600 }}>
      <Canvas style={{ width: '100%', height: '100%' }} pixelRatio={window.devicePixelRatio}>
        <LeftLeg position={modelPosition} scale={modelScale} />
        {/* Other R3F components go here */}
        <directionalLight position={[5, 10, 20]} intensity={1} />
        <directionalLight position={[-5, -10, -20]} intensity={1} />
      </Canvas>
    </div>
  );
}

export default LeftLegCanvas;
