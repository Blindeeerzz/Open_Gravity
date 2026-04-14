import { useState } from 'react';
import Landing from './Landing';
import Chat from './Chat';

function App() {
  const [view, setView] = useState<'landing' | 'chat'>('landing');

  return (
    <div className="app-container">
      {view === 'landing' ? (
        <Landing onEnterChat={() => setView('chat')} />
      ) : (
        <Chat onBack={() => setView('landing')} />
      )}
    </div>
  );
}

export default App;
