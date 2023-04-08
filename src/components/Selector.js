import React from 'react';

const Selector = (props) => {
  const { handleScreenChange, handleProjectionModeChange } = props;

  const openDisplayWindow = (mode) => {
    props.handleGoBack();
    const displayWindow = window.open('displayWindow.html', 'DisplayWindow', 'width=1280,height=720');
    displayWindow.onload = () => {
      displayWindow.postMessage({ type: 'changeProjectionMode', mode: mode }, '*');
      handleProjectionModeChange(mode);
      if (mode === 'proyector') {
        displayWindow.document.getElementById('proyector').disabled = false;
        displayWindow.document.getElementById('streaming').disabled = true;
      } else if (mode === 'streaming') {
        displayWindow.document.getElementById('proyector').disabled = true;
        displayWindow.document.getElementById('streaming').disabled = false;
      }
    };
    handleScreenChange('Content', displayWindow);
  };

  return (
    <div className='Selector'>
      <div>
        <h3>LOGO</h3>
      </div>
      <div className='selectorButtons'>
        <button onClick={() => openDisplayWindow('proyector')}>PROYECTOR</button>
        <button onClick={() => openDisplayWindow('streaming')}>STREAMING</button>
      </div>
    </div>
  );
};

export default Selector;