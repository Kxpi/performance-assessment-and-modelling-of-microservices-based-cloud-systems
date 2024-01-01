import React from 'react';
import './styles/legend.css';

const Legend = ({ microserviceColors }) => {
    return (
        <div className="legend">
            {Object.entries(microserviceColors).map(([service, color]) => (
                <div key={service} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: color }}></div>
                    <div className="legend-label">{service}</div>
                </div>
            ))}
        </div>
    );
};

export default Legend;