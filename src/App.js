import React, { useState, useRef, useEffect } from 'react';
import Selector from './components/Selector';
import Content from './components/Content';
import './App.css';

const App = () => {
  const [screen, setScreen] = useState('Home');
  const [proyectionMode, setProyectionMode] = useState(null);
  const displayWindowRef = useRef(null);
  const [verseText, setVerseText] = useState('');

  const handleVerseClick = (book, chapter, verseNumber, verseText) => {
    if (displayWindowRef.current && !displayWindowRef.current.closed) {
      displayWindowRef.current.postMessage(
        {
          type: 'updateVerse',
          verseText: `${book} ${chapter}:${verseNumber} - ${verseText}`,
          quote: `${book} - ${chapter}:${verseNumber}`,
        },
        '*'
      );
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'closeDisplayWindow') {
        handleGoBack();
      } else if (event.data.type === 'changeProjectionMode') {
        setProyectionMode(event.data.mode);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleGoBack = () => {
    setProyectionMode(null);
    if (displayWindowRef.current && !displayWindowRef.current.closed) {
      displayWindowRef.current.close();
    }
  };

  const handleScreenChange = (screenName, displayWindow) => {
    setScreen(screenName);
    if (displayWindow) {
      displayWindowRef.current = displayWindow;
    } else if (displayWindowRef.current && !displayWindowRef.current.closed) {
      displayWindowRef.current.close();
    }
  };

  const handleProjectionModeChange = (mode) => {
    setProyectionMode(mode);
  };

  const getContent = () => {
    if (screen === 'Selector') {
      return (
        <Selector
          handleScreenChange={handleScreenChange}
          handleProjectionModeChange={handleProjectionModeChange}
          handleGoBack={handleGoBack}
        />
      );
    } else if (screen === 'Content') {
      return (
        <Content
          handleScreenChange={handleScreenChange}
          proyectionMode={proyectionMode}
          displayWindowRef={displayWindowRef}
          handleGoBack={handleGoBack}
          handleVerseClick={handleVerseClick}
          verseText={verseText}
        />
      );
    }
  };

  return (
    <div>
      {screen === 'Home' && (
        <div className='Home'>
          <h1>Bienvenido</h1>
          <button onClick={() => {handleGoBack(); handleScreenChange('Selector');}}>SIGUIENTE</button>
        </div>
      )}
      {getContent()}
    </div>
  );
};

export default App;