import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import ReinaValera1960 from './data/ReinaValera1960.json';
import LBLA from './data/LBLA.json';

const Bible = (props) => {
  const [selectedVersion, setSelectedVersion] = useState(ReinaValera1960);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredOldTestamentBooks, setFilteredOldTestamentBooks] = useState(selectedVersion.slice(0, 39));
  const [filteredNewTestamentBooks, setFilteredNewTestamentBooks] = useState(selectedVersion.slice(39));
  const [selectedVerse, setSelectedVerse] = useState(null);
  const iframeRef = useRef(null);
  
  useEffect(() => {
    if (props.handleProjectionModeChange) {
      props.handleProjectionModeChange(props.proyectionMode);
    }
  }, [props.proyectionMode, props.handleProjectionModeChange]);

  useEffect(() => {
    setFilteredOldTestamentBooks(selectedVersion.slice(0, 39));
    setFilteredNewTestamentBooks(selectedVersion.slice(39));
  }, [selectedVersion]);

  const clearSearch = () => {
    setSearchValue('');
    setFilteredOldTestamentBooks(selectedVersion.slice(0, 39));
    setFilteredNewTestamentBooks(selectedVersion.slice(39));
  };

  const selectVerse = (book, chapter, verseNumber, verseText) => {
    setSelectedVerse({ book, chapter, verseNumber, verseText });
    props.handleVerseClick(book, chapter, verseNumber, verseText);

    // Envía un mensaje a la ventana emergente (mantén este código)
    if (props.displayWindow && !props.displayWindow.closed) {
      props.displayWindow.postMessage(
        {
          type: 'updateVerse',
          verseText: `${book} ${chapter}:${verseNumber} - ${verseText}`,
          quote: `${book} ${chapter}:${verseNumber}`,
        },
        '*'
      );
    }

    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'updateVerse',
          verseText: `${book} ${chapter}:${verseNumber} - ${verseText}`,
          quote: `${book} ${chapter}:${verseNumber}`,
        },
        '*'
      );
    }
  };
  
  const removeDiacritics = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    const filteredOT = selectedVersion.slice(0, 39).filter((book) =>
      removeDiacritics(book.nombre.toLowerCase()).includes(removeDiacritics(event.target.value.toLowerCase()))
    );
    setFilteredOldTestamentBooks(filteredOT);
    const filteredNT = selectedVersion.slice(39).filter((book) =>
      removeDiacritics(book.nombre.toLowerCase()).includes(removeDiacritics(event.target.value.toLowerCase()))
    );
    setFilteredNewTestamentBooks(filteredNT);
  };

  const handleBookSelect = (bookName) => {
    setSelectedBook(bookName);
    setSelectedChapter(null);
  };

  const handleChapterSelect = (chapterNumber) => {
    setSelectedChapter(chapterNumber);
  };

  return (
    <div className='contentBible'>
      <div className='versionControl'>
        <button
          onClick={() => {
            setSelectedVersion(ReinaValera1960);
            setSelectedBook(null);
            setSelectedChapter(null);
          }}
          >
          Reina Valera 1960
        </button>
        <button
          onClick={() => {
            setSelectedVersion(LBLA);
            setSelectedBook(null);
            setSelectedChapter(null);
          }}
          >
          LBLA
        </button>
      </div>
      <div className='blockOne'>
        <div className='Books'>
          <div className='searchBar'>
            <div className="searchInputContainer">
              {!searchValue && <FiSearch className="searchIcon" />}
              <input
                type="text"
                placeholder="Buscar libro"
                value={searchValue}
                onChange={handleSearchChange}
              />
              {searchValue && <FiX className="clearSearchIcon" onClick={clearSearch} />}
            </div>
          </div>
          <div className='booksToShow'>
            <div className='oldTestament'>
              <div><h3>Antiguo Testamento</h3></div>
                {filteredOldTestamentBooks.map((book) => (
                  <div className='atBook' key={book.abreviatura} onClick={() => handleBookSelect(book.nombre)}>
                    {book.nombre}
                  </div>
                ))}
            </div>
            <div className='newTestament'>
              <div><h3>Nuevo Testamento</h3></div>
                {filteredNewTestamentBooks.map((book) => (
                <div className='ntBook' key={book.abreviatura} onClick={() => handleBookSelect(book.nombre)}>
                  {book.nombre}
              </div>
              ))}
            </div>
          </div>
        </div>
        <div className='windowPreview'>
          <iframe
            ref={iframeRef}
            title="Preview"
            src="/displayWindow.html"
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe>
        </div>
      </div>
      <div className='Chapters'>
        {selectedBook && (
          <div className='cContent'>
            <div className='bookHeader'>
              <h3>{selectedBook}</h3>
            </div>
            <div className='chapterList'>
              {selectedVersion.find((book) => book.nombre === selectedBook).capitulos.map((chapter) => (
                <div className='c-number' key={chapter.numero} onClick={() => handleChapterSelect(chapter.numero)}>
                  {chapter.numero}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='onRecord'>
          <h4>HISTORIAL</h4>
        </div>
      </div>
      <div className='Verses'>
        {selectedChapter && (
          <div className='vContent'>
            <h3>Capítulo {selectedChapter} - Versículos:</h3>
            {selectedVersion
              .find((book) => book.nombre === selectedBook)
              .capitulos.find((chapter) => chapter.numero === selectedChapter)
              .versiculos.map((verse) => (
                <div
                  className={`verseBox${selectedVerse && selectedVerse.book === selectedBook && selectedVerse.chapter === selectedChapter && selectedVerse.verseNumber === verse.numero ? ' selectedVerse' : ''}`}
                  key={verse.numero}
                  onClick={() => selectVerse(selectedBook, selectedChapter, verse.numero, verse.texto)}
                  >
                  <span>{verse.numero}</span>
                  <p>{verse.texto}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bible;