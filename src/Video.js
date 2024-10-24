// VideoPlayer.js

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Plane } from '@react-three/drei';
import PropTypes from 'prop-types';
import * as THREE from 'three';  // Import everything from 'three'

const VideoPlayer = ({ videoSrc, position, scale, rotation }) => {
  const videoRef = useRef();
  const [videoTexture, setVideoTexture] = useState(null);

  // Create the video element
  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.play();
    videoRef.current = video;

    // Create texture from the video
    const texture = new THREE.VideoTexture(video);
    setVideoTexture(texture);

    return () => {
      video.pause();
      video.src = '';
    };
  }, [videoSrc]);

  return (
    <Plane
      position={position}
      rotation={rotation}
      args={[16, 9]} // Aspect ratio for the plane
      scale={scale}
    >
      {videoTexture && <meshBasicMaterial attach="material" map={videoTexture} />}
    </Plane>
  );
};

VideoPlayer.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
  rotation: PropTypes.arrayOf(PropTypes.number),
};

VideoPlayer.defaultProps = {
  position: [0, 0, 0],
  scale: 1,
  rotation: [0, 0, 0],
};

export default VideoPlayer;
