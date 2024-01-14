import React from 'react';
import './styles/legend.css';

const Legend = ({ microserviceColors, processes }) => {


    const traceServiceNames = new Set(Object.values(processes).map(process => process.serviceName));
    const filteredServiceColors = {};

    Object.keys(microserviceColors).forEach(serviceName => {
        if (traceServiceNames.has(serviceName)) {
            filteredServiceColors[serviceName] = microserviceColors[serviceName];
        }
    });



    return (
        <div className="cg-legend">
            {Object.entries(filteredServiceColors).map(([service, color]) => (
                <div key={service} className="cg-legend-item">
                    <div className="cg-legend-color" style={{ backgroundColor: color }}></div>
                    <div className="cg-legend-label">{service}</div>
                </div>
            ))}
        </div>
    );
};

export default Legend;