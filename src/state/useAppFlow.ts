import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { ScreenId, CollectionItem, RouteEntry } from './types';
import { APPROVED_MESSAGES } from './types';
import { findRoute } from './routeEngine';
import maSaudeSusData from '../data/ma_saude_sus.json';
import paSaudeSusData from '../data/pa_saude_sus.json';
import mgSaudeSusData from '../data/mg_saude_sus.json';
import maProtecaoSocialData from '../data/ma_protecao_social.json';
import paProtecaoSocialData from '../data/pa_protecao_social.json';
import mgProtecaoSocialData from '../data/mg_protecao_social.json';

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

  const currentTopics = useMemo(() => {
    const dest = matchedRoute?.destinationSheet || '';
    const code = matchedRoute?.routeCode || '';

    if (dest === 'MG_SAUDE_SUS' || code === 'MG_SAUDE_SUS') {
      return mgSaudeSusData as CollectionItem[];
    }
    if (dest === 'PA_SAUDE_SUS' || code === 'PA_SAUDE_SUS') {
      return paSaudeSusData as CollectionItem[];
    }
    if (dest === 'MA_SAUDE_SUS' || code === 'MA_SAUDE_SUS') {
      return maSaudeSusData as CollectionItem[];
    }
    if (dest.includes('MA_PROTE') || code === 'MA_PROT_SOCIAL') {
      return maProtecaoSocialData as CollectionItem[];
    }
    if (dest.includes('PA_PROTE') || code === 'PA_PROT_SOCIAL') {
      return paProtecaoSocialData as CollectionItem[];
    }
    if (dest.includes('MG_PROTE') || code === 'MG_PROT_SOCIAL') {
      return mgProtecaoSocialData as CollectionItem[];
    }

    if (selectedState === 'MG') {
      return mgSaudeSusData as CollectionItem[];
    }
    if (selectedState === 'PA') {
      return paSaudeSusData as CollectionItem[];
    }
    return maSaudeSusData as CollectionItem[];
  }, [matchedRoute, selectedState]);

  const isProtecaoSocial = useMemo(() => {
    const dest = matchedRoute?.destinationSheet || '';
    const code = matchedRoute?.routeCode || '';
    return dest.includes('PROTE') || code.includes('PROT');
  }, [matchedRoute]);

  // Actions
  const handleOpenStateSelector = useCallback(() => {
    navigateTo('tela-2');
  }, [navigateTo]);

  const handleSelectState = useCallback((stateCode: string) => {
    setSelectedState(stateCode);
    if (stateCode === 'MA' || stateCode === 'PA' || stateCode === 'MG') {
      // Flash tela-3 (visual selection feedback) for 200ms, then go to tela-4
      setCurrentScreen('tela-3');
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        navigateTo('tela-4');
      }, 200);
    } else {
      showToast('Estado selecionado inválido.');
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
    } else if (currentTopics.length > 0) {
      window.open(currentTopics[0].linkDrive, '_blank', 'noopener,noreferrer');
    }
  }, [selectedTopic, currentTopics]);

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
    topics: currentTopics,
    isProtecaoSocial,
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
