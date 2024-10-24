import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { MathUtils } from 'three';

export function LegBend(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/LegBend.glb');
  const { actions } = useAnimations(animations, group);
  const [rotationValue, setRotationValue] = useState(0); // Target rotation value
  const [currentRotation, setCurrentRotation] = useState(0); // Current rotation

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received rotation speed:', data.rotationSpeed); // Debug log
        setRotationValue(data.rotationSpeed);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onopen = () => console.log('WebSocket connection established');
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket connection closed');

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (animations.length > 0) {
      const defaultAnimation = animations[0].name;
      if (actions[defaultAnimation]) {
        actions[defaultAnimation].play();
      } else {
        console.warn(`No action found for default animation: ${defaultAnimation}`);
      }
    } else {
      console.warn('No animations found.');
    }

    // Cleanup function
    return () => {
      if (actions) {
        Object.values(actions).forEach(action => {
          if (action && typeof action.stop === 'function') {
            action.stop();
          }
        });
      }
    };
  }, [actions, animations]);

  const calculateTargetRotation = useCallback((value) => {
    const minRotation = -Math.PI / 2; // Adjusted for a larger range
    const maxRotation = 0;
    const clampedValue = MathUtils.clamp(value, 0, 110);
    const target = (clampedValue / 110) * (minRotation - maxRotation) + maxRotation;
    console.log('Calculated target rotation:', target); // Debug log
    return target;
  }, []);

  const smoothTransition = useCallback((current, target, deltaTime, speed) => {
    return current + (target - current) * (1 - Math.exp(-speed * deltaTime));
  }, []);

  useEffect(() => {
    let lastTime = 0;

    const bone = nodes.mixamorig7LeftLeg;
    if (!bone) {
      console.error('Bone not found in the model.');
      return;
    }

    const minRotation = -Math.PI / 2; // Adjusted for a larger range
    const maxRotation = 0;

    const updateRotation = (time) => {
      if (lastTime === 0) lastTime = time;
      const deltaTime = (time - lastTime) / 1000; // Time in seconds
      lastTime = time;

      const targetRotation = calculateTargetRotation(rotationValue);
      const speed = 10; // Adjust this value to control the smoothness

      setCurrentRotation(prevRotation => {
        const newRotation = smoothTransition(prevRotation, targetRotation, deltaTime, speed);
        const clampedRotation = MathUtils.clamp(newRotation, minRotation, maxRotation);
        bone.rotation.x = clampedRotation;

        console.log('Current rotation:', clampedRotation, 'Target rotation:', targetRotation, 'Rotation value:', rotationValue); // Debug log

        if (Math.abs(clampedRotation - targetRotation) < 0.01) { // Threshold to stop updating
          return targetRotation;
        }
        return newRotation;
      });

      requestAnimationFrame(updateRotation);
    };

    requestAnimationFrame(updateRotation);

    return () => {
      // Cleanup any ongoing updates if necessary
    };
  }, [rotationValue, nodes, calculateTargetRotation, smoothTransition]);

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

useGLTF.preload('/LegBend.glb');

export default LegBend;
