import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { MathUtils } from 'three';

export function LegBendAuto(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/LegBendAuto.glb');
  const { actions } = useAnimations(animations, group);
  const [rotationValue, setRotationValue] = useState(0); // Target rotation value
  const [currentRotation, setCurrentRotation] = useState(0); // Current rotation

  useEffect(() => {
    if (animations.length > 0) {
      const defaultAnimation = animations[0].name;
      if (actions[defaultAnimation]) {
        actions[defaultAnimation].play();
      } else {
        console.warn('Default animation not found.');
      }
    }

    return () => {
      Object.values(actions).forEach(action => {
        if (action?.stop) action.stop();
      });
    };
  }, [actions, animations]);

  // Convert degrees to radians
  const degToRad = (deg) => deg * (Math.PI / 90);

  // Define target rotation calculation
  const calculateTargetRotation = useCallback((time) => {
    const startAngle = degToRad(-55); // Start angle in radians
    const amplitude = degToRad(120);  // Total amplitude in radians (±40 degrees)
    const rotationSpeed = 1; // Speed of oscillation
    const oscillation = (amplitude / 2) * Math.sin(time * rotationSpeed);
    const rotation = startAngle + oscillation;
    console.log('Calculated rotation:', rotation); // Debugging
    return rotation;
  }, []);

  useEffect(() => {
    const bone = nodes.mixamorig7LeftLeg;

    if (!bone) {
      console.error('Bone not found in the model.');
      return;
    }

    let lastTime = 0;

    const updateRotation = (time) => {
      if (lastTime === 0) lastTime = time;
      const deltaTime = (time - lastTime) / 1000; // Convert to seconds
      lastTime = time;

      const targetRotation = calculateTargetRotation(time / 1000); // Convert time to seconds
      const rotationSpeed = 4; // Speed of interpolation

      // Debugging: Log the current and target rotations
      console.log('Target rotation:', targetRotation);
      console.log('Current rotation:', bone.rotation.x);

      // Interpolate rotation
      bone.rotation.x = MathUtils.lerp(bone.rotation.x, targetRotation, rotationSpeed * deltaTime);

      // Clamp the rotation range
      const minRotation = degToRad(-55); // Minimum angle in radians (-40 degrees)
      const maxRotation = degToRad(120);  // Maximum angle in radians (80 degrees)
      bone.rotation.x = MathUtils.clamp(bone.rotation.x, minRotation, maxRotation);

      // Debugging: Log the clamped rotation
      console.log('Clamped rotation:', bone.rotation.x);

      requestAnimationFrame(updateRotation);
    };

    // Start the rotation update
    const animationFrameId = requestAnimationFrame(updateRotation);

    return () => cancelAnimationFrame(animationFrameId);
  }, [nodes, calculateTargetRotation]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorig7Hips} />
          <mesh name="Ch08_Hair" geometry={nodes.Ch08_Hair.geometry} material={materials.Ch08_hair} />
          <skinnedMesh name="Ch08_Beard" geometry={nodes.Ch08_Beard.geometry} material={materials.Ch08_hair} skeleton={nodes.Ch08_Beard.skeleton} />
          <skinnedMesh name="Ch08_Body" geometry={nodes.Ch08_Body.geometry} material={materials.Ch08_body} skeleton={nodes.Ch08_Body.skeleton} />
          <skinnedMesh name="Ch08_Eyelashes" geometry={nodes.Ch08_Eyelashes.geometry} material={materials.Ch08_hair} skeleton={nodes.Ch08_Eyelashes.skeleton} />
          <skinnedMesh name="Ch08_Hoodie" geometry={nodes.Ch08_Hoodie.geometry} material={materials.Ch08_body1} skeleton={nodes.Ch08_Hoodie.skeleton} />
          <skinnedMesh name="Ch08_Pants" geometry={nodes.Ch08_Pants.geometry} material={materials.Ch08_body1} skeleton={nodes.Ch08_Pants.skeleton} />
          <skinnedMesh name="Ch08_Sneakers" geometry={nodes.Ch08_Sneakers.geometry} material={materials.Ch08_body1} skeleton={nodes.Ch08_Sneakers.skeleton} />
        </group>
        <mesh name="chair_01" geometry={nodes.chair_01.geometry} material={materials.chair_01_} position={[0, 0, 0.086]} rotation={[Math.PI / 2, 0, 0]} scale={0.012} />
      </group>
    </group>
  );
}

useGLTF.preload('/LegBendAuto.glb');

export default LegBendAuto;
