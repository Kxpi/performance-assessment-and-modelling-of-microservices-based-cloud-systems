import React from 'react';

const SpanInfo = ({ selectedSpan, operationStats }) => {

    console.log("Operation Stats: ", operationStats)
    return (
        <div className="span-info">
            <h2>Span Information</h2>
            <p><b>Operation name:</b> <br></br>{selectedSpan.operationName} </p>
            <p><b>Start Time:</b> <br></br>{selectedSpan.startTime + ' μs'}</p>
            <p><b>Duration:</b> <br></br>{selectedSpan.duration / 1000 + ' ms'}</p>
            <p><b>Service:</b> <br></br>{selectedSpan.serviceName}</p>

            {/* <h3>------------------Stats-----------------------------</h3>
            <p>Average duration: <br />{operationStats.exec_time_average / 1000 + ' ms'}</p>
            <p>Min duration: <br />{operationStats.exec_time_min / 1000 + ' ms'}</p>
            <p>Q1 duration: <br />{operationStats.exec_time_q1 / 1000 + ' ms'}</p>
            <p>Q2 duration: <br />{operationStats.exec_time_q2 / 1000 + ' ms'}</p>
            <p>Q3 duration: <br />{operationStats.exec_time_q3 / 1000 + ' ms'}</p>
            <p>Max duration <br />{operationStats.exec_time_max / 1000 + ' ms'}</p>
            <p>95_percentile duration: <br />{operationStats.exec_time_95_percentile / 1000 + ' ms'}</p>
            <p>99_percentile duration: <br />{operationStats.exec_time_99_percentile / 1000 + ' ms'}</p>
            <p>Stdev duration: <br />{operationStats.exec_time_stddev / 1000 + ' ms'}</p>
            <p>IQR duration: <br />{operationStats.exec_time_IQR / 1000 + ' ms'}</p> */}
        </div>
    );
};

export default SpanInfo;