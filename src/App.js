import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './App.css';
import LegBendAuto from "./LegBendAuto";

import GLBModel from './GLBModel';
import SemiCircularProgress from './SemiCircularProgress';

function App() {
  const [stepCount, setStepCount] = useState(0); // Step count state
  const [color, setColor] = useState("red");     // Initial color (Red)

  // Callback to update step count and color from GLBModel
  const handleStepCountChange = (newStepCount) => {
    setStepCount(newStepCount);
    // Update the color based on the flexion angle
    const newColor = categorizeLegBending(newStepCount); 
    setColor(newColor);
  };

  // Map step count (0-167) to percentage (0-100%)
  const percentage = (stepCount / 90) * 100;

  // Categorize flexionAngle and return color
  const categorizeLegBending = (flexionAngle) => {
    if (flexionAngle > 60) {
      return "#01b48e";
    } else if (flexionAngle >= 30 && flexionAngle <= 45) {
      return "#faa416";
    } else if(flexionAngle > 45 && flexionAngle <= 120){
      return "#fdcd07";
    }else {
      return "#ee184e";
    }
  };

  return (
    <div className='container'>
      <div>
      {/* Render the arc progress bar */}
      <div className="semi-circular-progress-container">
        <SemiCircularProgress 
          percentage={percentage} 
          maxAngle={250} 
          color={color} /* Pass the updated color to SemiCircularProgress */
        />

        {/* Insert GLBModel inside the same container */}
        <div className="threejs-canvas-container">
          <Canvas 
            camera={{ position: [10.5, 3.5, 10.5], fov: 11, near: 1, far: 1000 }} // Adjusted camera position and fov for 30% reduction
          >
            <ambientLight intensity={3.5} />
            <directionalLight position={[3.5, 3.5, 3.5]} />
            < LegBendAuto/>
            <OrbitControls />
          </Canvas>
        </div>
      </div>
      <div className="step-counter">Steps: {stepCount}</div>
      </div>
      <div>
      {/* Render the arc progress bar */}
      <div className="semi-circular-progress-container">
        <SemiCircularProgress 
          percentage={percentage} 
          maxAngle={250} 
          color={color} /* Pass the updated color to SemiCircularProgress */
        />

        {/* Insert GLBModel inside the same container */}
        <div className="threejs-canvas-container">
          <Canvas 
            camera={{ position: [10.5, 3.5, 10.5], fov: 11, near: 1, far: 1000 }} // Adjusted camera position and fov for 30% reduction
          >
            <ambientLight intensity={3.5} />
            <directionalLight position={[3.5, 3.5, 3.5]} />
            < LegBendAuto/>
            <OrbitControls />
          </Canvas>
        </div>
      </div>
      <div className="step-counter">Steps: {stepCount}</div>
      </div>
    </div>
  );
}

export default App;
