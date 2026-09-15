import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScreenView } from './ScreenView';
import maSaudeSusData from '../data/ma_saude_sus.json';

describe('ScreenView Component Hotspots', () => {
  const defaultProps = {
    currentScreen: 'tela-2' as const,
    selectedThemes: [],
    selectedTopic: null,
    topics: maSaudeSusData,
    onOpenStateSelector: vi.fn(),
    onSelectState: vi.fn(),
    onContinueFromState: vi.fn(),
    onToggleTheme: vi.fn(),
    onContinueFromThemes: vi.fn(),
    onSelectTopic: vi.fn(),
    onOpenDriveLink: vi.fn(),
    onBackToTopics: vi.fn(),
    onContinueToClosing: vi.fn(),
    onRestart: vi.fn(),
  };

  it('renders tela-2 hotspots and calls onSelectState with MA when clicking Maranhao', () => {
    const onSelectState = vi.fn();
    render(<ScreenView {...defaultProps} onSelectState={onSelectState} />);
    const maButton = screen.getByRole('button', { name: /Maranhão \(MA\)/i });
    expect(maButton).toBeDefined();
    fireEvent.click(maButton);
    expect(onSelectState).toHaveBeenCalledTimes(1);
    expect(onSelectState).toHaveBeenCalledWith('MA');
  });

  it('calls onSelectState with other states on tela-2', () => {
    const onSelectState = vi.fn();
    render(<ScreenView {...defaultProps} onSelectState={onSelectState} />);
    const paButton = screen.getByRole('button', { name: /Pará \(PA\)/i });
    fireEvent.click(paButton);
    expect(onSelectState).toHaveBeenCalledWith('PA');
  });

  it('renders tela-5 theme pills and triggers onMoggleTheme', () => {
    const onToggleTheme = vi.fn();
    render(
      <ScreenView
        {...defaultProps}
        currentScreen="tela-5"
        onToggleTheme={onToggleTheme}
      />
    );
    const saudePill = screen.getByRole('button', { name: /Tema Saúde/i });
    fireEvent.click(saudePill);
    expect(onToggleTheme).toHaveBeenCalledWith('Saúde');
  });

  it('renders tela-8 action buttons: Clique aqui, Voltar, Continuar', () => {
    const onOpenDriveLink = vi.fn();
    const onBackToTopics = vi.fn();
    const onContinueToClosing = vi.fn();
    render(
      <ScreenView
        {...defaultProps}
        currentScreen="tela-8"
        selectedTopic={maSaudeSusData[0]}
        onOpenDriveLink={onOpenDriveLink}
        onBackToTopics={onBackToTopics}
        onContinueToClosing={onContinueToClosing}
      />
    );
    const driveBtn = screen.getByRole('button', { name: /Abrir pasta no Google Drive/i });
    fireEvent.click(driveBtn);
    expect(onOpenDriveLink).toHaveBeenCalledTimes(1);

    const backBtn = screen.getByRole('button', { name: /Voltar para a seleção de tópicos/i });
    fireEvent.click(backBtn);
    expect(onBackToTopics).toHaveBeenCalledTimes(1);

    const contBtn = screen.getByRole('button', { name: /Continuar para tela final/i });
    fireEvent.click(contBtn);
    expect(onContinueToClosing).toHaveBeenCalledTimes(1);
  });

  it('renders Pará background image when selectedState is PA', () => {
    const { container } = render(
      <ScreenView
        {...defaultProps}
        currentScreen="tela-6"
        selectedState="PA"
      />
    );
    const img = container.querySelector('img.screen-bg-img');
    expect(img?.getAttribute('src')).toBe('/assets/pa/pa-tela-6.png');
  });

  it('renders Maranhão background image when selectedState is MA', () => {
    const { container } = render(
      <ScreenView
        {...defaultProps}
        currentScreen="tela-6"
        selectedState="MA"
      />
    );
    const img = container.querySelector('img.screen-bg-img');
    expect(img?.getAttribute('src')).toBe('/assets/tela-6.png');
  });
});
