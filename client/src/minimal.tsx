import { createRoot } from 'react-dom/client';
import { SimpleApp } from './SimpleApp';

// DOM'a bağlan ve SimpleApp'i render et
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<SimpleApp />);
}