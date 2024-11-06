import ReactDOM from 'react-dom/client';
import App from './App';
import { MessageProvider } from './modules/MessageContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <MessageProvider>
    <App />
  </MessageProvider>

)