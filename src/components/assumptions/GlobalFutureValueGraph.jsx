import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import LivesSavedGraph from '../charts/LivesSavedGraph';
import FormattedScientificValue from '../shared/FormattedScientificValue';
import { formatLives, formatNumber } from '../../utils/formatters';
import { calculateFutureValueSeries, resolveFutureValuePreviewParameters } from '../../utils/futureValueVisualization';

const GlobalFutureValueGraph = ({ globalParameters, defaultGlobalParameters, formValues }) => {
  const previewParameters = useMemo(
    () => resolveFutureValuePreviewParameters(globalParameters, defaultGlobalParameters, formValues),
    [defaultGlobalParameters, formValues, globalParameters]
  );

  const graphData = useMemo(
    () => (previewParameters ? calculateFutureValueSeries(previewParameters) : null),
    [previewParameters]
  );

  if (!previewParameters || !graphData || graphData.points.length === 0) {
    return null;
  }

  const totalFutureLives = graphData.totalFutureLives;

  return (
    <div className="impact-surface mt-6 p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-strong">Value of the Future</h3>
        <p className="mt-1 text-sm text-muted">
          Discounted value of future lives considered under the current global parameters.
        </p>
        <p className="mt-2 text-sm text-muted">
          Total value considered:{' '}
          <span className="font-semibold text-strong">
            <FormattedScientificValue value={formatLives(totalFutureLives)} variant="compact" />
          </span>{' '}
          life equivalents
        </p>
      </div>

      <LivesSavedGraph
        data={graphData.points}
        seriesMetadataOverride={graphData.seriesMetadata}
        height={260}
        colorMode="effect"
        tooltipValueFormatter={formatNumber}
        tooltipUnitLabel="discounted life-years"
        tooltipShowSummaryValue={false}
        xAxisLabel="Year"
        yAxisLabel="Discounted life-years"
        tooltipDetailsRenderer={({ pointPayload, formattedTotalValue }) =>
          pointPayload?.population ? (
            <div className="space-y-1">
              <p>
                Discounted life-years:{' '}
                <span className="font-medium text-strong">
                  <FormattedScientificValue value={formattedTotalValue} variant="compact" />
                </span>
              </p>
              <p>
                Population:{' '}
                <span className="font-medium text-strong">
                  <FormattedScientificValue value={formatNumber(pointPayload.population)} variant="compact" />
                </span>
              </p>
            </div>
          ) : null
        }
      />
    </div>
  );
};

GlobalFutureValueGraph.propTypes = {
  globalParameters: PropTypes.object.isRequired,
  defaultGlobalParameters: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default GlobalFutureValueGraph;
