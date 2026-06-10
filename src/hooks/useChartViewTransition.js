import { useEffect, useState } from 'react';
import { CHART_ANIMATION_DURATION } from '../utils/constants';
import { OTHER_CAUSES_NAME } from './useCategoryChartData';

// Consistent row order across both views: largest donations first, with the
// aggregate "Other Causes" row pinned to the bottom.
const compareChartRows = (a, b) => {
  if (a.name === OTHER_CAUSES_NAME) return 1;
  if (b.name === OTHER_CAUSES_NAME) return -1;
  return b.donationValue - a.donationValue;
};

const buildViewRows = (rawChartData, chartView) =>
  [...rawChartData].sort(compareChartRows).map((item) => ({
    ...item,
    value: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
    valueTarget: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
  }));

/**
 * The entity chart's view-toggle state machine (donations ⇄ lives saved).
 *
 * The chart renders `valueTarget` with recharts animation enabled, so a
 * toggle animates by holding the FROM value in `value` and moving
 * `valueTarget` to the new view; once the animation window passes, rows are
 * rebuilt from `rawChartData` with both fields on the new view's values.
 * Rebuilds are suppressed while a transition or its animation is in flight
 * so data updates can't interrupt the motion.
 */
const useChartViewTransition = (rawChartData) => {
  const [chartView, setChartView] = useState('livesSaved');
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [transitionStage, setTransitionStage] = useState('none');
  const [chartData, setChartData] = useState([]);

  // Rebuild rows from the source data whenever idle (initial load, data
  // changes from assumption edits, and the settle step after a transition).
  useEffect(() => {
    if (rawChartData.length === 0 || transitionStage !== 'none' || shouldAnimate) return;
    setChartData(buildViewRows(rawChartData, chartView));
  }, [rawChartData, chartView, transitionStage, shouldAnimate]);

  // Start a toggle transition: animate FROM the currently displayed value TO
  // the new view's value, then mark the transition finished.
  useEffect(() => {
    if (transitionStage !== 'shrinking') return;

    setChartData((currentData) =>
      currentData.map((item) => ({
        ...item,
        value: item.valueTarget,
        valueTarget: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
      }))
    );

    const timer = setTimeout(() => {
      setTransitionStage('none');
    }, CHART_ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [transitionStage, chartView]);

  // Keep the animation flag up slightly past the animation itself so the
  // settle rebuild can't cut the motion short.
  useEffect(() => {
    if (!shouldAnimate) return;

    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, CHART_ANIMATION_DURATION + 50);

    return () => clearTimeout(timer);
  }, [chartData, shouldAnimate]);

  const handleChartViewChange = (view) => {
    setShouldAnimate(true);
    setTransitionStage('shrinking');
    setChartView(view);
  };

  return {
    chartData,
    chartView,
    isTransitioning: transitionStage !== 'none',
    handleChartViewChange,
  };
};

export default useChartViewTransition;
