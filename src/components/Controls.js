import React from 'react';
import './Controls.css';

const Controls = ({ globeProps, setGlobeProps }) => {
  const handleChange = (key, value) => {
    setGlobeProps({
      ...globeProps,
      [key]: value
    });
  };

  return (
    <div className="controls">
      <div className="control-group">
        <label>
          Density: {globeProps.density}
          <input
            type="range"
            min="2"
            max="20"
            value={globeProps.density}
            onChange={(e) => handleChange('density', parseInt(e.target.value))}
          />
          <span className="help-text">Higher = fewer points</span>
        </label>
      </div>
      
      <div className="control-group">
        <label>
          Threshold: {globeProps.threshold}
          <input
            type="range"
            min="0"
            max="255"
            value={globeProps.threshold}
            onChange={(e) => handleChange('threshold', parseInt(e.target.value))}
          />
          <span className="help-text">Brightness cutoff for points</span>
        </label>
      </div>
      
      <div className="control-group">
        <label>
          Point Size: {globeProps.pointSize.toFixed(2)}
          <input
            type="range"
            min="0.01"
            max="0.2"
            step="0.01"
            value={globeProps.pointSize}
            onChange={(e) => handleChange('pointSize', parseFloat(e.target.value))}
          />
        </label>
      </div>
      
      <div className="control-group">
        <label className="checkbox-label">
          Auto Rotate:
          <input
            type="checkbox"
            checked={globeProps.autoRotate}
            onChange={(e) => handleChange('autoRotate', e.target.checked)}
          />
        </label>
      </div>
      
      <div className="control-group">
        <label className="checkbox-label">
          Show Stars:
          <input
            type="checkbox"
            checked={globeProps.showStars}
            onChange={(e) => handleChange('showStars', e.target.checked)}
          />
        </label>
      </div>
      
      <div className="instructions">
        <h3>Controls:</h3>
        <ul>
          <li>Drag to rotate the globe</li>
          <li>Scroll to zoom in/out</li>
          <li>Right-click drag to pan</li>
        </ul>
      </div>
    </div>
  );
};

export default Controls;