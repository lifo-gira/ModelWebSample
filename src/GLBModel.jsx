import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Model({ url, onStepCountChange }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();
  const elapsedTimeRef = useRef(0); // Track total elapsed time
  const lastUpdateTimeRef = useRef(0); // Track time since the last increment

  const [stepCount, setStepCount] = useState(0); // Step counter

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((object) => {
        if (object.isBone) {
          console.log(object.name); // Log each bone name to find the leg bone
        }
      });
    }
  }, [scene]);

  useFrame((state, delta) => {
    elapsedTimeRef.current += delta; // Increment elapsed time by delta

    // Check if one second has passed since the last increment
    if (elapsedTimeRef.current - lastUpdateTimeRef.current >= 1) {
      lastUpdateTimeRef.current = elapsedTimeRef.current; // Update last increment time

      // Access and animate the specific leg bone
      if (modelRef.current) {
        const legBone = modelRef.current.getObjectByName('mixamorig7RightLeg'); // Replace with actual bone name
        if (legBone) {
          if (legBone.rotation.x <= 2) {
            legBone.rotation.x += 0.1; // Increment the rotation by 0.1 every second

            // Increment the step counter
            const newStepCount = stepCount + 1;
            setStepCount(newStepCount);

            // Call the callback function to pass the step count to App.js
            if(newStepCount>90){
              onStepCountChange(90);
            }else{
              onStepCountChange(newStepCount);
            }
          }
        }
      }
    }
  });

  return <primitive object={scene} ref={modelRef} />;
}

export default function GLBModel({ onStepCountChange }) {
  return <Model url="/D.glb" onStepCountChange={onStepCountChange} />;
}
