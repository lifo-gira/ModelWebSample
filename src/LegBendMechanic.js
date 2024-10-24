import { React, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei/core/useGLTF';
import { useFrame } from '@react-three/fiber';

const Model = ({ url, position, initialRotation, scale, autoRotate, rotation }) => {
  const gltf = useGLTF(url);
  const groupRef = useRef();
  let rotationCounter = 0;
  const rotationSpeed = 3;

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      // Increment the rotation counter
      rotationCounter += -rotationSpeed * delta;

      // Apply oscillating rotation around the X-axis between 0 and 90 degrees
      gltf.scene.rotation.x = Math.sin(rotationCounter) * (Math.PI / 2.4);
      gltf.scene.rotation.y = 0
      gltf.scene.rotation.z = 0;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={gltf.scene} scale={scale} />
    </group>
  );
};


const LegBend = () => {
  return (
    <group>

      <Model
        url="LegBendMechanic.glb"
        position={[-0.6, -0.83, -2.6]}
        rotation={[0, -1, 0]}
        scale={[6, 6, 6]} // Adjust the scale to increase the size of the model
      />
      <Model
        url="Legs.glb"
        position={[-0.46, -0.78, -2.6]}
        rotation={[0, -1, 0]}
        scale={[6, 6, 6]} // Adjust the scale to increase the size of the model
        autoRotate // Enable auto-rotation for the second model
      />
    </group>
  );
};

export default LegBend;
