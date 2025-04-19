import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Router from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <Router />
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
