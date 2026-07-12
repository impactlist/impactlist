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

  // The graph previews the DRAFT (form values), while the rest of the site
  // uses the applied parameters — say so whenever the two actually diverge.
  // Compare resolved parameters, not form dirtiness: an invalid draft field
  // resolves back to its applied value, so the graph isn't previewing it.
  // The empty-formValues guard skips the pre-hydration first render, which
  // resolves to defaults and would otherwise flash a false preview label.
  const isDraftPreview = useMemo(() => {
    if (!previewParameters || !globalParameters || Object.keys(formValues).length === 0) {
      return false;
    }
    return Object.keys(previewParameters).some(
      (paramKey) => !Object.is(previewParameters[paramKey], globalParameters[paramKey])
    );
  }, [formValues, globalParameters, previewParameters]);

  const appliedTotalFutureLives = useMemo(
    () => (isDraftPreview ? calculateFutureValueSeries(globalParameters).totalFutureLives : null),
    [isDraftPreview, globalParameters]
  );

  if (!previewParameters || !graphData || graphData.points.length === 0) {
    return null;
  }

  const totalFutureLives = graphData.totalFutureLives;

  return (
    <div className="impact-surface mt-6 p-5">
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-base font-semibold text-strong">Total weighted lives in the present and future</h3>
          {isDraftPreview && <span className="assumptions-draft-chip">Preview using unapplied values</span>}
        </div>
        <p className="mt-1 text-sm text-muted">
          This graph shows how much value the model assigns to lives in each year. It starts with projected global
          population, applies the population limit, then adjusts the value of later years using the discount rate. The
          total is the area under the curve, converted from life-years into "life equivalents" using Years Per Life.
        </p>
        <p className="mt-2 text-sm text-muted">
          Total weighted lives:{' '}
          <span className="font-semibold text-strong">
            <FormattedScientificValue value={formatLives(totalFutureLives)} variant="compact" />
          </span>{' '}
          life equivalents
        </p>
        {appliedTotalFutureLives !== null && (
          <p className="mt-1 text-sm text-muted">
            With currently applied values:{' '}
            <span className="font-semibold text-strong">
              <FormattedScientificValue value={formatLives(appliedTotalFutureLives)} variant="compact" />
            </span>{' '}
            life equivalents
          </p>
        )}
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
        yAxisLabel="Weighted life-years per year"
        tooltipDetailsRenderer={({ pointPayload, formattedTotalValue }) =>
          pointPayload?.population ? (
            <div className="space-y-1">
              <p>
                Weighted life-years:{' '}
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
