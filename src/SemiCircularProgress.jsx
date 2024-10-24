import React from 'react';
import './SemiCircularProgress.css';

const SemiCircularProgress = ({ percentage, maxAngle, color }) => {
  const radius = 224; // 320 * 0.7 for 30% size reduction
  const strokeWidthColored = 16.8;  // 24 * 0.7 for reduced thickness of the colored track
  const strokeWidthGray = 5.6;     // 8 * 0.7 for reduced thickness of the gray track
  const normalizedRadius = radius - strokeWidthColored / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const maxOffset = (maxAngle / 360) * circumference; // Calculate the max length based on maxAngle
  const strokeDashoffset = maxOffset - (percentage / 100) * maxOffset; // Adjust according to percentage

  return (
    <div className="semi-circular-progress-container">
      <svg
        height={radius * 2 + strokeWidthColored} // Adjust height and width to fit the arc
        width={radius * 2 + strokeWidthColored}
        className="progress-circle"
      >
        {/* Gray thin background circle */}
        <circle
          stroke="lightgrey"
          opacity="70%"
          fill="transparent"
          strokeWidth={strokeWidthGray}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="background-circle"
          style={{
            strokeDasharray: `${maxOffset} ${circumference - maxOffset}`,
            transform: `rotate(-90deg)`, // Start from top (12 o'clock position)
            transformOrigin: '50% 50%',
          }}
        />

        {/* Colored arc, dynamically updating the stroke color based on the flexion angle */}
        <circle
          stroke={color} /* Set stroke color dynamically */
          opacity="70%"
          fill="transparent"
          strokeWidth={strokeWidthColored}
          strokeDasharray={`${maxOffset} ${circumference}`}
          style={{
            strokeDashoffset,
            transform: `rotate(-90deg)`, // Start from top (12 o'clock position)
            transformOrigin: '50% 50%',
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  );
};

export default SemiCircularProgress;
