import React from 'react';
import './styles/legend.css';

const Legend = ({ microserviceColors }) => {
    return (
        <div className="cg-legend">
            {Object.entries(microserviceColors).map(([service, color]) => (
                <div key={service} className="cg-legend-item">
                    <div className="cg-legend-color" style={{ backgroundColor: color }}></div>
                    <div className="cg-legend-label">{service}</div>
                </div>
            ))}
        </div>
    );
};

export default Legend;