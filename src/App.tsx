import { useAppFlow } from './state/useAppFlow';
import { ViewportContainer } from './components/ViewportContainer';
import { ScreenView } from './components/ScreenView';
import { ToastAlert } from './components/ToastAlert';

export default function App() {
  const {
    currentScreen,
    selectedThemes,
    selectedTopic,
    toastMessage,
    topics,
    showToast,
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
  } = useAppFlow();

  return (
    <ViewportContainer>
      <ToastAlert
        message={toastMessage}
        onDismiss={() => showToast('')}
      />
      <ScreenView
        currentScreen={currentScreen}
        selectedThemes={selectedThemes}
        selectedTopic={selectedTopic}
        topics={topics}
        onOpenStateSelector={handleOpenStateSelector}
        onSelectState={handleSelectState}
        onContinueFromState={handleContinueFromState}
        onToggleTheme={handleToggleTheme}
        onContinueFromThemes={handleContinueFromThemes}
        onSelectTopic={handleSelectTopic}
        onOpenDriveLink={handleOpenDriveLink}
        onBackToTopics={handleBackToTopics}
        onContinueToClosing={handleContinueToClosing}
        onRestart={handleRestart}
      />
    </ViewportContainer>
  );
}
