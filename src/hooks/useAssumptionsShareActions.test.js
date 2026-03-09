import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useAssumptionsShareActions from './useAssumptionsShareActions';

const mockAttachSavedAssumptionsShareReference = vi.fn();
const mockSaveNewAssumptions = vi.fn();
const mockPersistAsActive = vi.fn();
const mockShowNotification = vi.fn();
const mockClipboardWriteText = vi.fn();

vi.mock('../utils/savedAssumptionsStore', () => ({
  attachSavedAssumptionsShareReference: (...args) => mockAttachSavedAssumptionsShareReference(...args),
  saveNewAssumptions: (...args) => mockSaveNewAssumptions(...args),
}));

const activeLibraryEntry = {
  id: 'saved-1',
  label: 'Saved Assumptions',
  source: 'local',
  description: 'Saved assumption description',
};

const assumptionsForSharing = {
  globalParameters: {
    timeLimit: 500,
  },
};

const buildHook = (overrides = {}) =>
  renderHook(() =>
    useAssumptionsShareActions({
      activeLibraryEntry,
      assumptionsForSharing,
      hasUnsavedChanges: false,
      persistAsActive: mockPersistAsActive,
      showNotification: mockShowNotification,
      ...overrides,
    })
  );

describe('useAssumptionsShareActions', () => {
  beforeEach(() => {
    mockAttachSavedAssumptionsShareReference.mockReset();
    mockSaveNewAssumptions.mockReset();
    mockPersistAsActive.mockReset();
    mockShowNotification.mockReset();
    mockClipboardWriteText.mockReset();
    mockClipboardWriteText.mockResolvedValue(undefined);

    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: mockClipboardWriteText,
      },
    });
  });

  it('re-attaches a new share reference to the active saved assumptions entry', () => {
    mockAttachSavedAssumptionsShareReference.mockReturnValue({
      ok: true,
      entry: { id: 'saved-1' },
    });

    const { result } = buildHook();

    act(() => {
      result.current.handleShareSaved({
        reference: 'shared-ref',
        description: 'Shared description',
      });
    });

    expect(mockAttachSavedAssumptionsShareReference).toHaveBeenCalledWith({
      reference: 'shared-ref',
      description: 'Shared description',
      assumptions: assumptionsForSharing,
      preferredId: 'saved-1',
    });
    expect(mockPersistAsActive).toHaveBeenCalledWith('saved-1');
    expect(mockSaveNewAssumptions).not.toHaveBeenCalled();
  });

  it('creates a new saved assumptions entry when no matching entry can be found', () => {
    mockAttachSavedAssumptionsShareReference.mockReturnValue({
      ok: false,
      errorCode: 'not_found',
    });
    mockSaveNewAssumptions.mockReturnValue({
      ok: true,
      entry: { id: 'saved-new' },
    });

    const { result } = buildHook();

    act(() => {
      result.current.handleShareSaved({
        reference: 'shared-ref',
        description: 'Shared description',
      });
    });

    expect(mockSaveNewAssumptions).toHaveBeenCalledWith({
      label: 'shared-ref',
      description: 'Shared description',
      assumptions: assumptionsForSharing,
      source: 'local',
      reference: 'shared-ref',
      resolveDuplicateLabel: true,
    });
    expect(mockPersistAsActive).toHaveBeenCalledWith('saved-new');
  });

  it('copies an existing share link and shows a success notification', async () => {
    const { result } = buildHook();

    await act(async () => {
      await result.current.handleCopySavedLink({
        shareUrl: 'http://localhost:3000/?shared=shared-ref',
      });
    });

    expect(mockClipboardWriteText).toHaveBeenCalledWith('http://localhost:3000/?shared=shared-ref');
    expect(mockShowNotification).toHaveBeenCalledWith('success', 'Copied share link.');
  });

  it('shows an error notification when copying a share link fails', async () => {
    mockClipboardWriteText.mockRejectedValue(new Error('clipboard unavailable'));
    const { result } = buildHook();

    await act(async () => {
      await result.current.handleCopySavedLink({
        shareUrl: 'http://localhost:3000/?shared=shared-ref',
      });
    });

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        'error',
        'Could not copy link automatically. Please copy it manually.'
      );
    });
  });
});
