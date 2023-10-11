import React from 'react';

const SpanInfo = ({ selectedSpan, operationStats }) => {

    console.log("Operation Stats: ", operationStats)
    return (
        <div className="span-info">
            <h2>Span Information</h2>
            <p>Start Time: <br></br>{selectedSpan.startTime}</p>
            <p>Duration: <br></br>{selectedSpan.duration}</p>
            <p>Service: <br></br>{selectedSpan.serviceName}</p>

            <h3>------------------Stats-----------------------------</h3>
            <p>Exec_time_min: <br></br>{operationStats.exec_time_min}</p>
            <p>Exec_time_max <br></br>{operationStats.exec_time_max}</p>
            <p>Exec_time_q1: <br />{operationStats.exec_time_q1}</p>
            <p>Exec_time_q2: <br />{operationStats.exec_time_q2}</p>
            <p>Exec_time_q3: <br />{operationStats.exec_time_q3}</p>
            <p>Exec_time_95_percentile: <br />{operationStats.exec_time_95_percentile}</p>
            <p>Exec_time_99_percentile: <br />{operationStats.exec_time_99_percentile}</p>
            <p>Exec_time_average: <br />{operationStats.exec_time_average}</p>
            <p>Start_time_min: <br />{operationStats.start_time_min}</p>
            <p>Start_time_max: <br />{operationStats.start_time_max}</p>
            <p>Start_time_q1: <br />{operationStats.start_time_q1}</p>
            <p>Start_time_q2: <br />{operationStats.start_time_q2}</p>
            <p>Start_time_q3: <br />{operationStats.start_time_q3}</p>
            <p>Start_time_95_percentile: <br />{operationStats.start_time_95_percentile}</p>
            <p>Start_time_99_percentile: <br />{operationStats.start_time_99_percentile}</p>
            <p>Start_time_average: <br />{operationStats.start_time_average}</p>



        </div>
    );
};

export default SpanInfo;