import { useState, useEffect, useCallback, useRef } from 'react';
import type { ScreenId, CollectionItem, RouteEntry } from './types';
import { APPROVED_MESSAGES } from './types';
import { findRoute } from './routeEngine';
import maSaudeSusData from '../data/ma_saude_sus.json';

const SESSION_STORAGE_KEY = 'acervo_digital_state_v1';

export function useAppFlow() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('tela-1');
  const [selectedState, setSelectedState] = useState<string>('MA');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [matchedRoute, setMatchedRoute] = useState<RouteEntry | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<CollectionItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const navigateTo = useCallback((nextScreen: ScreenId, pushToHistory = true) => {
    setCurrentScreen(nextScreen);
    if (pushToHistory && typeof window !== 'undefined') {
      window.history.pushState({ screen: nextScreen }, '', '#' + nextScreen);
    }
  }, []);

  // Initialize from sessionStorage or window hash
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentScreen) setCurrentScreen(parsed.currentScreen);
        if (parsed.selectedState) setSelectedState(parsed.selectedState);
        if (Array.isArray(parsed.selectedThemes)) setSelectedThemes(parsed.selectedThemes);
        if (parsed.matchedRoute) setMatchedRoute(parsed.matchedRoute);
        if (parsed.selectedTopic) setSelectedTopic(parsed.selectedTopic);
        return;
      }
    } catch {
      // Fallback gracefully
    }

    if (window.location.hash) {
      const hashScreen = window.location.hash.replace('#', '') as ScreenId;
      const validScreens: ScreenId[] = [
        'tela-1', 'tela-2', 'tela-3', 'tela-4',
        'tela-5', 'tela-6', 'tela-7', 'tela-8', 'tela-9'
      ];
      if (validScreens.includes(hashScreen)) {
        setCurrentScreen(hashScreen);
      }
    }
  }, []);

  // Save state to sessionStorage
  useEffect(() => {
    try {
      const toSave = {
        currentScreen,
        selectedState,
        selectedThemes,
        matchedRoute,
        selectedTopic
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Ignore sessionStorage errors
    }
  }, [currentScreen, selectedState, selectedThemes, matchedRoute, selectedTopic]);

  // Handle popstate (Browser back/forward)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.screen) {
        setCurrentScreen(e.state.screen as ScreenId);
      } else if (window.location.hash) {
        const hashScreen = window.location.hash.replace('#', '') as ScreenId;
        setCurrentScreen(hashScreen || 'tela-1');
      } else {
        setCurrentScreen('tela-1');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Actions
  const handleOpenStateSelector = useCallback(() => {
    navigateTo('tela-2');
  }, [navigateTo]);

  const handleSelectState = useCallback((stateCode: string) => {
    setSelectedState(stateCode);
    if (stateCode === 'MA') {
      // Flash tela-3 (visual selection feedback) for 200ms, then go to tela-4
      setCurrentScreen('tela-3');
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        navigateTo('tela-4');
      }, 200);
    } else {
      showToast('Atualmente apenas os arquivos do Maranhão estão disponíveis.');
    }
  }, [navigateTo, showToast]);

  const handleContinueFromState = useCallback(() => {
    navigateTo('tela-5');
  }, [navigateTo]);

  const handleToggleTheme = useCallback((theme: string) => {
    setSelectedThemes((prev) => {
      if (prev.includes(theme)) {
        return prev.filter((t) => t !== theme);
      }
      if (prev.length >= 3) {
        showToast(APPROVED_MESSAGES.COUNT_LIMIT);
        return prev;
      }
      return [...prev, theme];
    });
  }, [showToast]);

  const handleContinueFromThemes = useCallback(() => {
    if (selectedThemes.length === 0 || selectedThemes.length > 3) {
      showToast(APPROVED_MESSAGES.COUNT_LIMIT);
      return;
    }

    const route = findRoute(selectedState, selectedThemes);
    if (!route) {
      showToast(APPROVED_MESSAGES.NO_ROUTE);
      return;
    }

    setMatchedRoute(route);
    navigateTo('tela-6');
  }, [selectedThemes, selectedState, showToast, navigateTo]);

  const handleSelectTopic = useCallback((topic: CollectionItem) => {
    setSelectedTopic(topic);
    // Flash tela-7 (highlight feedback) for 200ms, then advance to tela-8
    setCurrentScreen('tela-7');
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      navigateTo('tela-8');
    }, 200);
  }, [navigateTo]);

  const handleOpenDriveLink = useCallback(() => {
    if (selectedTopic?.linkDrive) {
      window.open(selectedTopic.linkDrive, '_blank', 'noopener,noreferrer');
    } else if (maSaudeSusData.length > 0) {
      window.open(maSaudeSusData[0].linkDrive, '_blank', 'noopener,noreferrer');
    }
  }, [selectedTopic]);

  const handleBackToTopics = useCallback(() => {
    navigateTo('tela-6');
  }, [navigateTo]);

  const handleContinueToClosing = useCallback(() => {
    navigateTo('tela-9');
  }, [navigateTo]);

  const handleRestart = useCallback(() => {
    setSelectedThemes([]);
    setMatchedRoute(null);
    setSelectedTopic(null);
    navigateTo('tela-1');
  }, [navigateTo]);

  return {
    currentScreen,
    selectedState,
    selectedThemes,
    matchedRoute,
    selectedTopic,
    toastMessage,
    topics: maSaudeSusData as CollectionItem[],
    showToast,
    navigateTo,
    handleOpenStateSelector,
    handleSelectState,
    handleContinueFromState,
    handleToggleTheme,
    handleContinueFromThemes,
    handleSelectTopic,
    handleOpenDriveLink,
    handleBackToTopics,
    handleContinueToClosing,
    handleRestart,
  };
}
