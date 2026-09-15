import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppFlow } from './useAppFlow';
import { APPROVED_MESSAGES } from './types';

describe('useAppFlow state machine & navigation tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    window.location.hash = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at tela-1 with default state MA', () => {
    const { result } = renderHook(() => useAppFlow());
    expect(result.current.currentScreen).toBe('tela-1');
    expect(result.current.selectedState).toBe('MA');
    expect(result.current.selectedThemes).toEqual([]);
    expect(result.current.matchedRoute).toBeNull();
    expect(result.current.selectedTopic).toBeNull();
  });

  it('transitions tela-1 -> tela-2 on state selector open', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleOpenStateSelector();
    });
    expect(result.current.currentScreen).toBe('tela-2');
  });

  it('transitions tela-2 -> tela-3 -> tela-4 upon selecting MA', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleOpenStateSelector();
    });
    act(() => {
      result.current.handleSelectState('MA');
    });
    expect(result.current.currentScreen).toBe('tela-3');

    // Fast-forward 200ms transition
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.currentScreen).toBe('tela-4');
  });

  it('advances from tela-4 to tela-5', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });
    expect(result.current.currentScreen).toBe('tela-5');
  });

  it('enforces 1 to 3 themes constraint and verbatim error message', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });

    // 0 themes selected -> submit should trigger COUNT_LIMIT
    act(() => {
      result.current.handleContinueFromThemes();
    });
    expect(result.current.toastMessage).toBe(APPROVED_MESSAGES.COUNT_LIMIT);
    expect(result.current.currentScreen).toBe('tela-5');

    // Select 1st theme
    act(() => {
      result.current.handleToggleTheme('Saúde');
    });
    expect(result.current.selectedThemes).toEqual(['Saúde']);

    // Select 2nd theme
    act(() => {
      result.current.handleToggleTheme('SUS');
    });
    expect(result.current.selectedThemes).toEqual(['Saúde', 'SUS']);

    // Select 3rd theme
    act(() => {
      result.current.handleToggleTheme('Campanha');
    });
    expect(result.current.selectedThemes).toEqual(['Saúde', 'SUS', 'Campanha']);

    // Attempt 4th theme -> should block and trigger COUNT_LIMIT
    act(() => {
      result.current.handleToggleTheme('CRAS');
    });
    expect(result.current.selectedThemes).toHaveLength(3);
    expect(result.current.selectedThemes).not.toContain('CRAS');
    expect(result.current.toastMessage).toBe(APPROVED_MESSAGES.COUNT_LIMIT);

    // Toggle off a theme
    act(() => {
      result.current.handleToggleTheme('Campanha');
    });
    expect(result.current.selectedThemes).toEqual(['Saúde', 'SUS']);
  });

  it('blocks navigation with verbatim message when combination has no route', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });
    act(() => {
      result.current.handleToggleTheme('CRAS');
    });
    act(() => {
      result.current.handleToggleTheme('UBS');
    });

    act(() => {
      result.current.handleContinueFromThemes();
    });

    expect(result.current.currentScreen).toBe('tela-5');
    expect(result.current.toastMessage).toBe(APPROVED_MESSAGES.NO_ROUTE);
    expect(result.current.matchedRoute).toBeNull();
  });

  it('matches route successfully with valid combination and navigates to tela-6', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });
    act(() => {
      result.current.handleToggleTheme('Saúde');
    });
    act(() => {
      result.current.handleToggleTheme('SUS');
    });
    act(() => {
      result.current.handleContinueFromThemes();
    });

    expect(result.current.currentScreen).toBe('tela-6');
    expect(result.current.matchedRoute).not.toBeNull();
    expect(result.current.matchedRoute?.destinationSheet).toBe('MA_SAUDE_SUS');
  });

  it('validates rule: 1 tema + CONTINUAR -> válido (Saúde)', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });
    act(() => {
      result.current.handleToggleTheme('Saúde');
    });
    expect(result.current.currentScreen).toBe('tela-5');
    act(() => {
      result.current.handleContinueFromThemes();
    });
    expect(result.current.currentScreen).toBe('tela-6');
    expect(result.current.matchedRoute?.destinationSheet).toBe('MA_SAUDE_SUS');
  });

  it('validates rule: 2 temas ordem invertida + CONTINUAR -> válido (SUS + Saúde)', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });
    act(() => {
      result.current.handleToggleTheme('SUS');
    });
    act(() => {
      result.current.handleToggleTheme('Saúde');
    });
    act(() => {
      result.current.handleContinueFromThemes();
    });
    expect(result.current.currentScreen).toBe('tela-6');
    expect(result.current.matchedRoute?.destinationSheet).toBe('MA_SAUDE_SUS');
  });

  it('validates rule: 3 temas + CONTINUAR -> válido (Saúde + SUS + UBS)', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });
    act(() => {
      result.current.handleToggleTheme('Saúde');
    });
    act(() => {
      result.current.handleToggleTheme('SUS');
    });
    act(() => {
      result.current.handleToggleTheme('UBS');
    });
    act(() => {
      result.current.handleContinueFromThemes();
    });
    expect(result.current.currentScreen).toBe('tela-6');
    expect(result.current.matchedRoute?.destinationSheet).toBe('MA_SAUDE_SUS');
  });

  it('validates rule: 1 tema Campanha agora possui rota e avança com sucesso', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });
    act(() => {
      result.current.handleToggleTheme('Campanha');
    });
    act(() => {
      result.current.handleContinueFromThemes();
    });
    expect(result.current.currentScreen).toBe('tela-6');
    expect(result.current.matchedRoute?.destinationSheet).toBe('MA_SAUDE_SUS');
  });

  it('validates rule: combinação mista sem rota (Saúde + SUAS) + CONTINUAR -> inválido', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });
    act(() => {
      result.current.handleToggleTheme('Saúde');
    });
    act(() => {
      result.current.handleToggleTheme('SUAS');
    });
    act(() => {
      result.current.handleContinueFromThemes();
    });
    expect(result.current.currentScreen).toBe('tela-5');
    expect(result.current.toastMessage).toBe(APPROVED_MESSAGES.NO_ROUTE);
  });

  it('validates rule: toggle desmarca tema sem provocar navegação', () => {
    const { result } = renderHook(() => useAppFlow());
    act(() => {
      result.current.handleContinueFromState();
    });
    // Marcar Saúde
    act(() => {
      result.current.handleToggleTheme('Saúde');
    });
    expect(result.current.selectedThemes).toEqual(['Saúde']);
    expect(result.current.currentScreen).toBe('tela-5');

    // Desmarcar Saúde
    act(() => {
      result.current.handleToggleTheme('Saúde');
    });
    expect(result.current.selectedThemes).toEqual([]);
    expect(result.current.currentScreen).toBe('tela-5');
  });

  it('handles topic selection: tela-6 -> tela-7 -> tela-8', () => {
    const { result } = renderHook(() => useAppFlow());
    const topic1 = result.current.topics[0];

    act(() => {
      result.current.handleSelectTopic(topic1);
    });
    expect(result.current.currentScreen).toBe('tela-7');
    expect(result.current.selectedTopic).toEqual(topic1);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.currentScreen).toBe('tela-8');
  });

  it('allows returning to tela-6 from tela-8', () => {
    const { result } = renderHook(() => useAppFlow());
    const topic1 = result.current.topics[0];

    act(() => {
      result.current.handleSelectTopic(topic1);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    act(() => {
      result.current.handleBackToTopics();
    });
    expect(result.current.currentScreen).toBe('tela-6');
  });

  it('advances from tela-8 to closing tela-9 and allows full restart', () => {
    const { result } = renderHook(() => useAppFlow());
    const topic1 = result.current.topics[0];

    act(() => {
      result.current.handleSelectTopic(topic1);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    act(() => {
      result.current.handleContinueToClosing();
    });
    expect(result.current.currentScreen).toBe('tela-9');

    act(() => {
      result.current.handleRestart();
    });
    expect(result.current.currentScreen).toBe('tela-1');
    expect(result.current.selectedThemes).toEqual([]);
    expect(result.current.matchedRoute).toBeNull();
    expect(result.current.selectedTopic).toBeNull();
  });
});
