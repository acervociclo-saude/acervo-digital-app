import React from 'react';

interface ViewportContainerProps {
  children: React.ReactNode;
}

export const ViewportContainer: React.FC<ViewportContainerProps> = ({ children }) => {
  return (
    <main className="app-viewport-wrapper">
      <div className="app-screen-container">
        {children}
      </div>
    </main>
  );
};
