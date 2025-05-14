import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';

// Set up routes
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat/:id',
    
    element: (
      <ProtectedRoute>
    <Chat />
    </ProtectedRoute>
  )
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Register />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
