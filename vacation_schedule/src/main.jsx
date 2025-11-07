import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import App from './App.jsx';
import './index.css';

// Устанавливаем русскую локализацию для dayjs
dayjs.locale('ru');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
