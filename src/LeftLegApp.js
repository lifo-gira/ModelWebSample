import React from 'react';
import SeperateLegs from './LeftLeg';
import { Canvas } from '@react-three/fiber';
import './App.css'; // Import your CSS file for styling

function LeftLegApp() {
  // Adjust these values to center and scale the model
  const modelPosition = [0, 0, 0];
  const modelScale = 3;

  return (
    <div className="app-container">
      <Canvas style={{ width: 800, height: 600 }} pixelRatio={window.devicePixelRatio}>
        {/* Other R3F components go here */}
        <SeperateLegs position={modelPosition} scale={modelScale} />
        <directionalLight position={[5, 10, 20]} intensity={6} />
        <directionalLight position={[5, 10, 20]} intensity={6} />
      </Canvas>
    </div>
  );
}

export default LeftLegApp;
