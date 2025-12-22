import React, { useState } from 'react';
import './Fretboard.css';

const Fretboard = ({ scale = [], tuning = ['E', 'A', 'D', 'G', 'B', 'E'].reverse(), leftHanded = false, noteDisplayMode = 'all', getScaleDegreePhonetic, currentScaleRootNote, activePatternNotes }) => {
  const [hoveredData, setHoveredData] = useState(null);

  const strings = 6;
  const frets = 24;

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const getNote = (string, fret) => {
    const openNote = tuning[string];
    const openNoteIndex = notes.indexOf(openNote);
    const noteIndex = (openNoteIndex + fret) % 12;
    return notes[noteIndex];
  };

  const handleMouseOver = (e) => {
    const { note, string, fret } = e.currentTarget.dataset;
    setHoveredData({ note, string, fret });
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  const renderFrets = () => {
    let fretElements = [];
    const singleMarkers = [3, 5, 7, 9, 15, 17, 19, 21];
    const doubleMarkers = [12, 24];
    const rootNote = scale[0];

    for (let i = 0; i < strings; i++) {
      for (let j = 0; j <= frets; j++) {
        const noteName = getNote(i, j);
        const isScaleNote = scale.includes(noteName);
        
        // Check if the current note is part of the active pattern
        const isInActivePattern = activePatternNotes.length === 0 || activePatternNotes.some(
          (patternNote) => patternNote[0] === i && patternNote[1] === j
        );

        // Only highlight if it's a scale note AND (no specific pattern selected OR it's in the active pattern)
        const shouldHighlight = isScaleNote && isInActivePattern;
        const isRootNote = shouldHighlight && noteName === rootNote;


        let fretClassName = 'fret';
        if (shouldHighlight) { // Apply scale-note class only if it should be highlighted
          fretClassName += ' scale-note';
          // Add pattern-note class when a specific pattern is selected (not 'All Notes')
          if (activePatternNotes.length > 0) {
            fretClassName += ' pattern-note';
          }
        }
        if (isRootNote) {
          fretClassName += ' root-note';
        }

        let marker = null;
        if (i === 3 && singleMarkers.includes(j)) {
          marker = <div className="fret-marker"></div>;
        }
        if ((i === 2 || i === 3) && doubleMarkers.includes(j)) {
          marker = <div className="fret-marker"></div>;
        }

        let noteDisplay;
        if (shouldHighlight) { // Only display notes if they should be highlighted
          if (noteDisplayMode === 'all') {
            noteDisplay = noteName;
          } else if (noteDisplayMode === 'scale' || noteDisplayMode === 'phonetic-scale-degree') {
            if (noteDisplayMode === 'phonetic-scale-degree') {
              noteDisplay = getScaleDegreePhonetic(noteName, scale, currentScaleRootNote);
            } else { // 'scale' mode
              noteDisplay = noteName;
            }
          } else {
            noteDisplay = ''; // Fallback for other modes if not in a pattern
          }
        } else {
          noteDisplay = ''; // Don't display if not highlighted by pattern/scale
        }
        

        fretElements.push(
          <div
            key={`${i}-${j}`}
            className={fretClassName}
            data-string={i + 1}
            data-fret={j}
            data-note={noteName}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
          >
            <div className="note-display">{noteDisplay}</div>
            {marker}
          </div>
        );
      }
    }
    return fretElements;
  };

  const renderFretNumbers = () => {
    const fretNumbers = [];
    for (let i = 0; i <= frets; i++) {
      fretNumbers.push(<div key={`fret-num-${i}`} className="fret-number">{i}</div>);
    }
    return fretNumbers;
  };

  const renderStringNumbers = () => {
    const stringNumbers = [];
    for (let i = 0; i < strings; i++) {
      stringNumbers.push(<div key={`string-num-${i}`} className="string-number">{i + 1}</div>);
    }
    return stringNumbers;
  };

  return (
    <div>
      <div className="note-info">
        {hoveredData && (
          <h2>
            Note: {hoveredData.note} | String: {hoveredData.string} | Fret: {hoveredData.fret}
          </h2>
        )}
      </div>
      <div className={`fretboard-container ${leftHanded ? 'left-handed' : ''}`}>
        <div className="string-numbers-container">{renderStringNumbers()}</div>
        <div className="fretboard">
          {renderFrets()}
        </div>
      </div>
    </div>
  );
};

export default Fretboard;
