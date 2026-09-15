import { useAppFlow } from './state/useAppFlow';
import { ViewportContainer } from './components/ViewportContainer';
import { ScreenView } from './components/ScreenView';
import { ToastAlert } from './components/ToastAlert';

export default function App() {
  const {
    currentScreen,
    selectedState,
    selectedThemes,
    selectedTopic,
    toastMessage,
    topics,
    isProtecaoSocial,
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
        selectedState={selectedState}
        selectedThemes={selectedThemes}
        selectedTopic={selectedTopic}
        topics={topics}
        isProtecaoSocial={isProtecaoSocial}
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
