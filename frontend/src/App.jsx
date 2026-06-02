import './App.css';
import AppRoutes from './routes/Approutes';
import UserContextProvider from '../src/components/userContext'; 
function App() {
  return (
    <UserContextProvider> 
      <AppRoutes />
    </UserContextProvider>
  );
}

export default App;
