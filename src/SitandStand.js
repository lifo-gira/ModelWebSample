import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

export function SetAnimation({ pose = 'stand', fallbackPose = 'rest', ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/SitandStand.glb');
  const { actions } = useAnimations(animations, group);

  // Clone the scene to avoid modifying the original
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useEffect(() => {
    if (actions) {
      console.log('Available animations:', Object.keys(actions));

      // Stop any currently playing animation
      Object.values(actions).forEach(action => action.stop());

      // Play the new action if it exists
      const actionToPlay = actions[pose] || actions[fallbackPose];
      if (actionToPlay) {
        actionToPlay.reset().play();
      } else {
        console.warn(`Animation "${pose}" or "${fallbackPose}" not found.`);
      }
    }
  }, [pose, fallbackPose, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={clone.getObjectByName('mixamorig7Hips')} />
          <mesh name="Ch08_Hair" geometry={clone.getObjectByName('Ch08_Hair').geometry} material={clone.getObjectByName('Ch08_Hair').material} />
          <skinnedMesh name="Ch08_Beard" geometry={clone.getObjectByName('Ch08_Beard').geometry} material={clone.getObjectByName('Ch08_Beard').material} skeleton={clone.getObjectByName('Ch08_Beard').skeleton} />
          <skinnedMesh name="Ch08_Body" geometry={clone.getObjectByName('Ch08_Body').geometry} material={clone.getObjectByName('Ch08_Body').material} skeleton={clone.getObjectByName('Ch08_Body').skeleton} />
          <skinnedMesh name="Ch08_Eyelashes" geometry={clone.getObjectByName('Ch08_Eyelashes').geometry} material={clone.getObjectByName('Ch08_Eyelashes').material} skeleton={clone.getObjectByName('Ch08_Eyelashes').skeleton} />
          <skinnedMesh name="Ch08_Hoodie" geometry={clone.getObjectByName('Ch08_Hoodie').geometry} material={clone.getObjectByName('Ch08_Hoodie').material} skeleton={clone.getObjectByName('Ch08_Hoodie').skeleton} />
          <skinnedMesh name="Ch08_Pants" geometry={clone.getObjectByName('Ch08_Pants').geometry} material={clone.getObjectByName('Ch08_Pants').material} skeleton={clone.getObjectByName('Ch08_Pants').skeleton} />
          <skinnedMesh name="Ch08_Sneakers" geometry={clone.getObjectByName('Ch08_Sneakers').geometry} material={clone.getObjectByName('Ch08_Sneakers').material} skeleton={clone.getObjectByName('Ch08_Sneakers').skeleton} />
        </group>
        <mesh name="chair_01" geometry={clone.getObjectByName('chair_01').geometry} material={clone.getObjectByName('chair_01').material} position={[0, 0, 0.086]} rotation={[Math.PI / 2, 0, 0]} scale={0.012} />
      </group>
    </group>
  );
}

useGLTF.preload('/SitandStand.glb');

export default SetAnimation;
