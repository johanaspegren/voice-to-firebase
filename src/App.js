// src/App.js
import React from 'react';
import './App.css';

import AppHeaderBar from './components/AppHeaderBar';

import VoiceRecorder from './components/VoiceRecorder';

function App() {
  return (
    <div className="App">
        <AppHeaderBar />
        <VoiceRecorder />
    </div>
  );
}

export default App;
