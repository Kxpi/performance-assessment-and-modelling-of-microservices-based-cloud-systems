import React from 'react';

const GraphInfo = ({ selectedOperation, operationStats, span }) => {


    return (
        <div style={{ height: '100%', overflow: 'auto' }}>
            {span ? (
                <div className="span-info">
                    <table>
                        <tbody>
                            <tr>
                                <td><b>Operation name:</b></td>
                                <td>{span.operationName}</td>
                            </tr>
                            <tr>
                                <td><b>SpanID:</b></td>
                                <td>{span.spanID}</td>
                            </tr>
                            <tr>
                                <td><b>Start Time:</b></td>
                                <td>{span.startTime + ' μs'}</td>
                            </tr>
                            <tr>
                                <td><b>Duration:</b></td>
                                <td>{span.duration / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Service:</b></td>
                                <td>{operationStats[span.operationName]["service_name"]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="span-stats">
                    <table>
                        <tbody>
                            <tr>
                                <td><b>Operation name:</b></td>
                                <td>{selectedOperation}</td>
                            </tr>
                            <tr>
                                <td><b>Average duration:</b></td>
                                <td>{operationStats.exec_time_average / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Min duration:</b></td>
                                <td>{operationStats.exec_time_min / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Q1 duration:</b></td>
                                <td>{operationStats.exec_time_q1 / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Q2 duration:</b></td>
                                <td>{operationStats.exec_time_q2 / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Q3 duration:</b></td>
                                <td>{operationStats.exec_time_q3 / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Max duration:</b></td>
                                <td>{operationStats.exec_time_max / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>95_percentile duration:</b></td>
                                <td>{operationStats.exec_time_95_percentile / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>99_percentile duration:</b></td>
                                <td>{operationStats.exec_time_99_percentile / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Stdev duration:</b></td>
                                <td>{operationStats.exec_time_stddev / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>IQR duration:</b></td>
                                <td>{operationStats.exec_time_IQR / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Average startTime:</b></td>
                                <td>{operationStats.start_time_average / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Min startTime:</b></td>
                                <td>{operationStats.start_time_min / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Q1 startTime:</b></td>
                                <td>{operationStats.start_time_q1 / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Q2 startTime:</b></td>
                                <td>{operationStats.start_time_q2 / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Q3 startTime:</b></td>
                                <td>{operationStats.start_time_q3 / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Max startTime:</b></td>
                                <td>{operationStats.start_time_max / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>99_percentile startTime:</b></td>
                                <td>{operationStats.start_time_99_percentile / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>95_percentile startTime:</b></td>
                                <td>{operationStats.start_time_95_percentile / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>Stdev startTime:</b></td>
                                <td>{operationStats.start_time_stddev / 1000 + ' ms'}</td>
                            </tr>
                            <tr>
                                <td><b>IQR startTime:</b></td>
                                <td>{operationStats.start_time_IQR / 1000 + ' ms'}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GraphInfo;