import React, { useState, useEffect, useRef } from 'react';
import Bible from './Bible';
import Songs from './songs';
import Images from './images';
import Advertisements from './advertisements';

const Content = (props) => {
  const [contentToShow, setContentToShow] = useState('Bible');
  const displayWindowRef = useRef(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [proyectionMode, setProyectionMode] = useState('proyector');
  const [searchValue, setSearchValue] = useState('');
  
  const handleGoBack = () => {
    setProyectionMode(null);
    setSearchValue('');
  };

  useEffect(() => {
    // Carga inicial de la versión de la Biblia seleccionada
    const loadInitialBibleVersion = async () => {
      const response = await fetch('./ReinaValera1960.json'); // Reemplazar 'path/to/' con la ruta real del archivo JSON
      const data = await response.json();
      setSelectedVersion(data);
    };

    loadInitialBibleVersion();
  }, []);

  useEffect(() => {
    // Cerrar ventana emergente al cambiar de modo de proyección o al presionar el botón "Inicio"
    if ((proyectionMode === null || handleGoBack) && displayWindowRef.current && !displayWindowRef.current.closed) {
      displayWindowRef.current.close();
    }
  }, [proyectionMode, handleGoBack]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'displayWindowRef') {
        displayWindowRef.current = event.source;
      }
      if (event.data.type === 'displayWindowProyectionMode') {
        setProyectionMode(event.data.mode);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleVersionChange = async (versionName) => {
    const response = await fetch(`path/to/${versionName}.json`); // Reemplazar 'path/to/' con la ruta real del archivo JSON
    const data = await response.json();
    setSelectedVersion(data);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleShowContent = (contentType) => {
    setContentToShow(contentType);
  };

  const openDisplayWindow = (mode) => {
    if (displayWindowRef.current && !displayWindowRef.current.closed) {
      return; // Si la ventana ya está abierta, no hacer nada
    }
  
    displayWindowRef.current = window.open('displayWindow.html', 'DisplayWindow', 'width=1280,height=720');
    displayWindowRef.current.onload = () => {
      displayWindowRef.current.postMessage({ type: 'changeProjectionMode', mode: mode }, '*'); // Cambia proyectionMode a mode
      displayWindowRef.current.addEventListener('beforeunload', handleGoBack);
      if (mode === 'proyector') {
        displayWindowRef.current.document.getElementById('proyector').disabled = false;
        displayWindowRef.current.document.getElementById('streaming').disabled = true;
      } else if (mode === 'streaming') {
        displayWindowRef.current.document.getElementById('proyector').disabled = true;
        displayWindowRef.current.document.getElementById('streaming').disabled = false;
      }
    };
  };

  const handleFocusDisplayWindow = () => {
    if (displayWindowRef.current && !displayWindowRef.current.closed) {
      displayWindowRef.current.focus();
    }
  };

  const handleProjectionRelaunch = () => {
    if (displayWindowRef.current && !displayWindowRef.current.closed) {
      displayWindowRef.current.postMessage({ type: 'changeProjectionMode', mode: proyectionMode }, '*');
    }
    openDisplayWindow(proyectionMode);
    handleFocusDisplayWindow(); // Agrega esta línea
  };

  const renderContent = () => {
    switch (contentToShow) {
      case 'Bible':
        return (
          <Bible
            handleVersionChange={handleVersionChange}
            handleVerseClick={props.handleVerseClick}
            selectedVersion={selectedVersion}
            searchValue={searchValue}
            handleSearchChange={handleSearchChange}
            displayWindowRef={displayWindowRef}
            projectionMode={proyectionMode}
            handleProjectionModeChange={props.handleProjectionModeChange}
          />
        );
      case 'Songs':
        return <Songs />;
      case 'Images':
        return <Images />;
      case 'Advertisements':
        return <Advertisements />;
      default:
        return null;
    }
  };

  return (
    <div className='contentMaster'>
      <div className='header'>
        <div className='proyectionMode'>
          {proyectionMode === 'streaming' && <p className='Streaming'>STREAMING</p>}
          {proyectionMode === 'proyector' && <p className='Proyector'>PROYECTOR</p>}
        </div>
        <div className='contentLogo'>
          LOGO
        </div>
      </div>
      <div className='contentMenu'>
        <div className='contentToProyect'>
          <button onClick={() => handleShowContent('Bible')}>BIBLIAS</button>
          <button onClick={() => handleShowContent('Songs')}>CANCIONES</button>
          <button onClick={() => handleShowContent('Images')}>IMÁGENES</button>
          <button onClick={() => handleShowContent('Advertisements')}>ANUNCIOS</button>
        </div>
        <div className='aditionals'>
          <div className='proyectionRelaunch'>
            <button onClick={handleProjectionRelaunch}>PROYECTAR</button>
          </div>
          <div className='returnhome' onClick={() => {
            props.handleScreenChange('Selector');
            if (displayWindowRef.current !== null) {
              displayWindowRef.current.postMessage({ type: 'closeDisplayWindow' }, '*');
            }
          }}>
            <img src='https://i.postimg.cc/zGc4xntm/home.png' width='20px' alt='Return to Selector' />
          </div>
        </div>
      </div>
      <div className='contentProyectionSelect'>
        {renderContent()}
      </div>
      {displayWindowRef.current && displayWindowRef.current.closed && (
        <div className='DisplayWindowClosed'>
          <h2>La ventana de proyección ha sido cerrada.</h2>
          <button onClick={() => handleGoBack()}>Regresar</button>
        </div>
      )}
    </div>
  );
};

export default Content;