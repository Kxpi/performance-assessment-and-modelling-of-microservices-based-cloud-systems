import React from 'react';
import './styles/legend.css';
const Legend = ({ microserviceColors }) => {
    return (
        <div className="legend">
            {Object.entries(microserviceColors).map(([processKey, data]) => (
                <div key={processKey} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: data.color }}></div>
                    <div className="legend-label">{data.serviceName}</div>
                </div>
            ))}
        </div>
    );
};

export default Legend;
