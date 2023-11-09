import { BrowserRouter } from 'react-router-dom';

import { ScrollToTop } from '@quacker/ui';

import { EnhancedApolloProvider } from './utils/apollo';
import { Routes } from './Routes';
import { AuthProvider } from './auth/context-ui';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EnhancedApolloProvider>
          <ScrollToTop />
          <Routes />
        </EnhancedApolloProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
