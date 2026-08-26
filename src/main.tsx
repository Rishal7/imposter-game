import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';
import { initAndroidInstallPromptCapture } from './lib/androidInstallPrompt';
import { disablePinchZoomInStandalone } from './lib/pwaDisplay';

disablePinchZoomInStandalone();
initAndroidInstallPromptCapture();

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root was not found.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
