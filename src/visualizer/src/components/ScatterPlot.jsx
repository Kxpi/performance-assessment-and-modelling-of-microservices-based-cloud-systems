import moment from 'moment';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withProps } from 'recompose';
import _dropWhile from 'lodash/dropWhile';
import _round from 'lodash/round';
import { XYPlot, XAxis, YAxis, MarkSeries, Hint, makeWidthFlexible, HorizontalGridLines, VerticalGridLines, makeHeightFlexible } from 'react-vis';
import 'react-vis/dist/style.css';


const ONE_DAY = 25 * 60 * 60 * 1000000; // microseconds in a day
const ONE_HOUR = 60 * 60 * 1000000; // microseconds in an hour
const ONE_MINUTE = 60 * 1000000; // microseconds in a minute
const ONE_SECOND = 1000000; // microseconds in a second
const ONE_MILLISECOND = 1000; // microseconds in a millisecond

const UNIT_STEPS = [
    { unit: 'd', microseconds: ONE_DAY, ofPrevious: 24 },
    { unit: 'h', microseconds: ONE_HOUR, ofPrevious: 60 },
    { unit: 'm', microseconds: ONE_MINUTE, ofPrevious: 60 },
    { unit: 's', microseconds: ONE_SECOND, ofPrevious: 1000 },
    { unit: 'ms', microseconds: ONE_MILLISECOND, ofPrevious: 1000 },
    { unit: 'μs', microseconds: 1, ofPrevious: 1000 },
];

const FlexibleXYPlot = makeHeightFlexible(makeWidthFlexible(XYPlot));



function formatDuration(duration) {
    // Drop all units that are too large except the last one
    const [primaryUnit, secondaryUnit] = _dropWhile(
        UNIT_STEPS,
        ({ microseconds }, index) => index < UNIT_STEPS.length - 1 && microseconds > duration
    );

    if (primaryUnit.ofPrevious === 1000) {
        // If the unit is decimal based, display as a decimal
        return `${_round(duration / primaryUnit.microseconds, 2)}${primaryUnit.unit}`;
    }

    const primaryValue = Math.floor(duration / primaryUnit.microseconds);
    const primaryUnitString = `${primaryValue}${primaryUnit.unit}`;
    const secondaryValue = Math.round((duration / secondaryUnit.microseconds) % primaryUnit.ofPrevious);
    const secondaryUnitString = `${secondaryValue}${secondaryUnit.unit}`;
    return secondaryValue === 0 ? primaryUnitString : `${primaryUnitString} ${secondaryUnitString}`;
}


function ScatterPlotImpl(props) {
    const { data, overValue, onValueOver, onValueOut } = props;

    return (
        <div className="TraceResultsScatterPlot">
            <FlexibleXYPlot
                margin={{
                    top: 15,
                    left: 50,
                    right: 25,
                }}
                colorType="literal"
            >
                <HorizontalGridLines />
                <VerticalGridLines />
                <XAxis
                    title="Time"
                    tickFormat={t => moment(t / ONE_MILLISECOND).format('HH:mm:ss')}
                />
                <YAxis
                    title="Duration"
                    tickFormat={t => formatDuration(t)}
                />
                <MarkSeries
                    opacity={0.5}
                    strokeWidth={4}
                    onValueMouseOver={onValueOver}
                    onValueMouseOut={onValueOut}
                    data={data}
                />
                {overValue && (
                    <Hint value={overValue}>
                        <h4 className="scatter-plot-hint">Span ID: {overValue.spanID}</h4>
                        <h4 className="scatter-plot-hint">Operation name: {overValue.name || '<trace-without-root-span>'}</h4>
                        <h4 className="scatter-plot-hint">Time: {moment(overValue.x / ONE_MILLISECOND).format('HH:mm:ss')}</h4>
                        <h4 className="scatter-plot-hint">Duration: {formatDuration(overValue.y)}</h4>
                        <h4 className="scatter-plot-hint">Trace ID: {overValue.traceID}</h4>
                        <h4 className="scatter-plot-hint">Service Name: {overValue.serviceName}</h4>
                    </Hint>
                )}
            </FlexibleXYPlot>
        </div>
    );
}


const valueShape = PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    traceID: PropTypes.string,
    size: PropTypes.number,
    name: PropTypes.string,
});

ScatterPlotImpl.propTypes = {
    data: PropTypes.arrayOf(valueShape).isRequired,
    overValue: valueShape,
    onValueOut: PropTypes.func.isRequired,
    onValueOver: PropTypes.func.isRequired,
};

ScatterPlotImpl.defaultProps = {
    overValue: null,
    // JSDOM does not, as of 2023, have a layout engine, so allow tests to supply a mock width as a workaround.
};

const ScatterPlot = compose(
    withState('overValue', 'setOverValue', null),
    withProps(({ setOverValue }) => ({
        onValueOver: value => setOverValue(value),
        onValueOut: () => setOverValue(null),
    }))
)(ScatterPlotImpl);

export { ScatterPlotImpl };

export default ScatterPlot;