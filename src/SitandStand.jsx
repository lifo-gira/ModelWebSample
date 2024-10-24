import React, { useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export function SitandStand(props) {
  const { nodes, materials, animations } = useGLTF('/SitandStand.glb');
  const group = useRef();
  const torsoRef = useRef();
  const thighRef = useRef();
  const legsRef = useRef();
  const { actions } = useAnimations(animations, group);
  const [rotationAngle, setRotationAngle] = useState(0); // State for rotation angle
  const [rotateBackward, setRotateBackward] = useState(false); // State to control rotation direction

  // Smoothly rotates the upper model and thigh based on rotationAngle state
  useFrame((state, delta) => {
    // Adjust speed based on your preference
    const rotationSpeed = 0.0168; 
    // Calculate the increment based on rotation direction
    const rotationIncrement = rotateBackward ? -rotationSpeed * delta : rotationSpeed * delta;
    // Update the rotation angle
    setRotationAngle(prevAngle => {
      const newAngle = prevAngle + rotationIncrement;
      // Check if we reached the limits of rotation
      if (newAngle >= Math.PI / 2) {
        // If reached 90 degrees, change direction to rotate backward
        setRotateBackward(true);
        return Math.PI / 2;
      } else if (newAngle <= 0) {
        // If reached 0 degrees, change direction to rotate forward
        setRotateBackward(false);
        return 0;
      }
      // Otherwise, continue rotating
      return newAngle;
    });

    // Rotate the thigh model along with the upper model
    thighRef.current.rotation.x = rotationAngle;
  });

  // Calculate the position of the upper model relative to the thigh's rotation
  const calculateUpperModelPosition = () => {
    const orbitRadius = 0.5; // Adjust the radius of the orbit
    const offsetY = Math.sin(rotationAngle) * orbitRadius;
    const offsetZ = -Math.cos(rotationAngle) * orbitRadius;
    // Move up and to the right
    return [0, offsetY-0.5, offsetZ]; // Adjusted z-axis position
  };


  return (
    <group {...props} dispose={null}>
      <group name='Torso' ref={torsoRef} position={calculateUpperModelPosition()} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh geometry={nodes.Mesh013.geometry} material={materials.Ch08_hair} />
        <mesh geometry={nodes.Mesh013_1.geometry} material={materials.Ch08_body} />
        <mesh geometry={nodes.Mesh013_2.geometry} material={materials.Ch08_body1} />
      </group>
      <mesh geometry={nodes.Box001.geometry} material={materials['17 - Default']} position={[0.004, 0.392, -0.328]} scale={[0.01, 0.007, 0.01]} />
      <mesh geometry={nodes.Line009.geometry} material={materials['21 - Default']} position={[0, 0.178, -0.261]} scale={[0.01, 0.009, 0.01]} />
      <mesh geometry={nodes.Line010.geometry} material={materials['21 - Default']} position={[-0.004, 0.178, -0.451]} scale={[0.01, 0.009, 0.01]} />
      
      <group name='Thigh' ref={thighRef} position={[0.001, 0.487, 0.005]} rotation={[1.58, 0, 0]} scale={0.01}>
        <mesh geometry={nodes.Mesh002.geometry} material={materials.Ch08_body1} />
        <mesh geometry={nodes.Mesh002_1.geometry} material={materials['Material.001']} />
      </group>

      <group name='Legs' ref={legsRef} position={[-0.002, 0.485, -0.024]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh geometry={nodes.Mesh003.geometry} material={materials.Ch08_body} />
        <mesh geometry={nodes.Mesh003_1.geometry} material={materials.Ch08_body1} />
        <mesh geometry={nodes.Mesh003_2.geometry} material={materials.Material} />
      </group>
    </group>
  );
}

useGLTF.preload('/SitandStand.glb');

export default SitandStand;
