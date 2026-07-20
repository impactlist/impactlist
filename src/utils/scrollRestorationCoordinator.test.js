import { describe, expect, it } from 'vitest';
import {
  beginHistoryEntryScrollRestoration,
  getHistoryEntryScrollId,
  isHistoryEntryScrollRestorationActive,
} from './scrollRestorationCoordinator';

describe('scrollRestorationCoordinator', () => {
  it('builds the same stable id for a complete router location', () => {
    expect(
      getHistoryEntryScrollId({
        key: 'entry-1',
        pathname: '/assumptions',
        search: '?tab=recipients',
        hash: '#details',
      })
    ).toBe('entry-1:/assumptions?tab=recipients#details');
  });

  it('keeps nested restoration activity until every owner finishes', () => {
    const finishFirst = beginHistoryEntryScrollRestoration('entry-1');
    const finishSecond = beginHistoryEntryScrollRestoration('entry-1');

    try {
      expect(isHistoryEntryScrollRestorationActive('entry-1')).toBe(true);
      finishFirst();
      finishFirst();
      expect(isHistoryEntryScrollRestorationActive('entry-1')).toBe(true);

      finishSecond();
      expect(isHistoryEntryScrollRestorationActive('entry-1')).toBe(false);
    } finally {
      finishFirst();
      finishSecond();
    }
  });
});
