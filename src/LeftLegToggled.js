import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei/core/useGLTF';
import { useFrame } from '@react-three/fiber';

const Model = ({ url, position, rotation, scale, autoRotate, rotationSpeed }) => {
  const gltf = useGLTF(url);
  const groupRef = useRef();

  useFrame((state, delta) => {
    console.log('Current rotationSpeed:', rotationSpeed);
    if (autoRotate && groupRef.current) {
      if (rotationSpeed !== undefined) {
        gltf.scene.rotation.x = rotationSpeed;
      }
      gltf.scene.rotation.y = 0;
      gltf.scene.rotation.z = 0;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={gltf.scene} scale={scale} />
    </group>
  );
};

const LeftLegToggled = () => {
  const [rotationSpeed, setRotationSpeed] = useState(0);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received rotationSpeed:', data.rotationSpeed);
  
  // Ensure the received rotationSpeed is a valid number
  if (!isNaN(data.rotationSpeed)) {
    // Restrict the rotationSpeed to be within 0 to 150 degrees
    const restrictedRotationSpeed = Math.min(150, Math.max(0, data.rotationSpeed));
    
    // Convert degrees to radians for Three.js rotation
    const rotationInRadians = (restrictedRotationSpeed / 180) * Math.PI;

    setRotationSpeed(rotationInRadians);
  }
};

    return () => {
      ws.close();
    };
  }, []);

  return (
    <group>
      <Model
        url="LegBendMechanicToggled.glb"
        position={[-0.4, -0.20, -1]}
        rotation={[0, -0.3, 0]}
        scale={[4, 4, 4]}
      />
      <Model
        url="LeftLegToggled.glb"
        position={[-0.7, -0.09, -1.1]}
        rotation={[0, -0.3, 0]}
        scale={[4, 4, 4]}
        autoRotate
        rotationSpeed={rotationSpeed}
      />
      <Model
        url="RightLegToggled.glb"
        position={[-0.08, -0.13, -0.8]}
        rotation={[0, -0.3, 0]}
        scale={[4, 4, 4]}
      />
    </group>
  );
};

export default LeftLegToggled;