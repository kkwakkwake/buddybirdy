import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import SignupPage from './pages/SignupPage';
import ChatProvider from './context/ChatProvider';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <div className="App">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/chats' element={<Chat />} />
          </Routes>
        </div>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
