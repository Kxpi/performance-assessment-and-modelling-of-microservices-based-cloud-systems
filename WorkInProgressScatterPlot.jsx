import React, { useRef, useState, useLayoutEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { XYPlot, XAxis, YAxis, MarkSeries, Hint } from 'react-vis';
import { compose, withState, withProps } from 'recompose';
import _dropWhile from 'lodash/dropWhile';
import _round from 'lodash/round';

import './react-vis.css';
import './ScatterPlot.css';

const ONE_DAY = 24 * 60 * 60 * 1000000; // microseconds in a day
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
    const { data, onValueClick, overValue, onValueOver, onValueOut, calculateContainerWidth } = props;

    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useLayoutEffect(() => {
        function updateContainerWidth() {
            if (containerRef.current) {
                setContainerWidth(calculateContainerWidth(containerRef.current));
            }
        }

        // Calculate the initial width on first render.
        updateContainerWidth();

        window.addEventListener('resize', updateContainerWidth);

        return () => window.removeEventListener('resize', updateContainerWidth);
    }, []);

    return (
        <div className="TraceResultsScatterPlot" ref={containerRef}>
            {containerWidth && (
                <XYPlot
                    margin={{
                        left: 50,
                    }}
                    width={containerWidth}
                    colorType="literal"
                    height={200}
                >
                    <XAxis
                        title="Time"
                        tickTotal={4}
                        tickFormat={t => moment(t / ONE_MILLISECOND).format('hh:mm:ss a')}
                    />
                    <YAxis title="Duration" tickTotal={3} tickFormat={t => formatDuration(t)} />
                    <MarkSeries
                        sizeRange={[3, 10]}
                        opacity={0.5}
                        onValueClick={onValueClick}
                        onValueMouseOver={onValueOver}
                        onValueMouseOut={onValueOut}
                        data={data}
                    />
                    {overValue && (
                        <Hint value={overValue}>
                            <h4 className="scatter-plot-hint">{overValue.name || '<trace-without-root-span>'}</h4>
                        </Hint>
                    )}
                </XYPlot>
            )}
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
    onValueClick: PropTypes.func.isRequired,
    onValueOut: PropTypes.func.isRequired,
    onValueOver: PropTypes.func.isRequired,
    calculateContainerWidth: PropTypes.func,
};

ScatterPlotImpl.defaultProps = {
    overValue: null,
    // JSDOM does not, as of 2023, have a layout engine, so allow tests to supply a mock width as a workaround.
    calculateContainerWidth: container => container.clientWidth,
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