import React from 'react';

const SpanInfo = ({ selectedSpan, operationStats }) => {

    console.log("Operation Stats: ", operationStats)
    return (
        <div className="span-info">
            <h2>Span Information</h2>
            <p>Start Time: <br></br>{selectedSpan.startTime + ' μs'}</p>
            <p>Duration: <br></br>{selectedSpan.duration + ' μs'}</p>
            <p>Service: <br></br>{selectedSpan.serviceName}</p>

            <h3>------------------Stats-----------------------------</h3>
            <p>Exec_time_min: <br></br>{operationStats.exec_time_min + ' μs'}</p>
            <p>Exec_time_max <br></br>{operationStats.exec_time_max + ' μs'}</p>
            <p>Exec_time_q1: <br />{operationStats.exec_time_q1 + ' μs'}</p>
            <p>Exec_time_q2: <br />{operationStats.exec_time_q2 + ' μs'}</p>
            <p>Exec_time_q3: <br />{operationStats.exec_time_q3 + ' μs'}</p>
            <p>Exec_time_95_percentile: <br />{operationStats.exec_time_95_percentile + ' μs'}</p>
            <p>Exec_time_99_percentile: <br />{operationStats.exec_time_99_percentile + ' μs'}</p>
            <p>Exec_time_average: <br />{operationStats.exec_time_average + ' μs'}</p>
            <p>Start_time_min: <br />{operationStats.start_time_min + ' μs'}</p>
            <p>Start_time_max: <br />{operationStats.start_time_max + ' μs'}</p>
            <p>Start_time_q1: <br />{operationStats.start_time_q1 + ' μs'}</p>
            <p>Start_time_q2: <br />{operationStats.start_time_q2 + ' μs'}</p>
            <p>Start_time_q3: <br />{operationStats.start_time_q3 + ' μs'}</p>
            <p>Start_time_95_percentile: <br />{operationStats.start_time_95_percentile + ' μs'}</p>
            <p>Start_time_99_percentile: <br />{operationStats.start_time_99_percentile + ' μs'}</p>
            <p>Start_time_average: <br />{operationStats.start_time_average + ' μs'}</p>



        </div>
    );
};

export default SpanInfo;