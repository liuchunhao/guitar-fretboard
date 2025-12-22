import React, { useState, useEffect } from 'react';
import Fretboard from './components/Fretboard';
import './App.css';

function App() {
  const scales = {
    'C Major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'F Lydian': ['F', 'G', 'A', 'B', 'C', 'D', 'E'],
    'G Mixolydian': ['G', 'A', 'B', 'C', 'D', 'E', 'F'],
    'A Minor': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    'G Major': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  };

  const scaleLabels = {
    'C Major': 'C Major (Do Re Mi Fa Sol La Xi)',
    'F Lydian': 'F Lydian (Fa Sol La Xi Do Re Mi)',
    'G Mixolydian': 'G Mixolydian (Sol La Xi Do Re Mi Fa)',
    'A Minor': 'A Minor (La Xi Do Re Mi Fa Sol)',
    'G Major': 'G Major (Do Re Mi Fa Sol La Xi)',
  };

  const tunings = {
    'Standard': ['E', 'A', 'D', 'G', 'B', 'E'],
    'Drop D': ['D', 'A', 'D', 'G', 'B', 'E'],
    'DADGAD': ['D', 'A', 'D', 'G', 'A', 'D'],
    'Open G': ['G', 'G', 'D', 'G', 'B', 'D'],
  };

  const scalePhonetics = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti']; // Using 'Ti' for 7th degree

  const getScaleDegreePhonetic = (note, scale, rootNote) => {
    if (!scale || scale.length === 0 || !rootNote) return '';
    const rootIndex = scale.indexOf(rootNote);
    if (rootIndex === -1) return '';

    const noteIndexInScale = scale.indexOf(note);
    if (noteIndexInScale === -1) return ''; // Note is not in the scale

    const degree = (noteIndexInScale - rootIndex + scale.length) % scale.length;
    return scalePhonetics[degree];
  };

  // Define scale patterns with absolute string and fret positions for 3NPS
  // stringIndex: 0 = High E, 5 = Low E
  const scalePatterns = {
    'C Major': {
      'All Notes': [], // Represents all notes of the scale
      // C Major 3NPS patterns, Modes of the Major Scale
      // stringIndex: 0 = High E, 5 = Low E

      // Ionian (Root C, starting at 8th fret Low E)
      '3NPS - Ionian (Root C)': [
        [5, 8], [5, 10], [5, 12], // Low E: C, D, E
        [4, 8], [4, 10], [4, 12], // A: F, G, A
        [3, 9], [3, 10], [3, 12], // D: B, C, D
        [2, 9], [2, 10], [2, 12], // G: E, F, G
        [1, 10], [1, 12], [1, 13], // B: A, B, C
        [0, 10], [0, 12], [0, 13]  // High E: D, E, F
      ],

      // D Dorian (Root D, starting at 10th fret Low E)
      '3NPS - Dorian (Root D)': [
        [5, 10], [5, 12], [5, 13], // Low E: D, E, F
        [4, 10], [4, 12], [4, 14], // A: G, A, B
        [3, 10], [3, 12], [3, 14], // D: C, D, E
        [2, 10], [2, 12], [2, 14], // G: F, G, A
        [1, 12], [1, 13], [1, 15], // B: B, C, D
        [0, 12], [0, 13], [0, 15]  // High E: E, F, G
      ],

      // E Phrygian (Root E, starting at 12th fret Low E)
      '3NPS - Phrygian (Root E)': [
        [5, 12], [5, 13], [5, 15], // Low E: E, F, G
        [4, 12], [4, 14], [4, 15], // A: A, B, C
        [3, 12], [3, 14], [3, 15], // D: D, E, F
        [2, 12], [2, 14], [2, 16], // G: G, A, B
        [1, 13], [1, 15], [1, 17], // B: C, D, E
        [0, 13], [0, 15], [0, 17]  // High E: F, G, A
      ],

      // F Lydian (Root F, starting at 1st fret Low E - wrapped around)
      '3NPS - Lydian (Root F)': [
        [5, 1], [5, 3], [5, 5], // Low E: F, G, A
        [4, 2], [4, 3], [4, 5], // A: B, C, D
        [3, 2], [3, 3], [3, 5], // D: E, F, G
        [2, 2], [2, 4], [2, 5], // G: A, B, C
        [1, 3], [1, 5], [1, 6], // B: D, E, F
        [0, 3], [0, 5], [0, 7]  // High E: G, A, B
      ],

      // G Mixolydian (Root G, starting at 3rd fret Low E)
      '3NPS - Mixolydian (Root G)': [
        [5, 3], [5, 5], [5, 7], // Low E: G, A, B
        [4, 3], [4, 5], [4, 7], // A: C, D, E
        [3, 3], [3, 5], [3, 7], // D: F, G, A
        [2, 4], [2, 5], [2, 7], // G: B, C, D
        [1, 5], [1, 6], [1, 8], // B: E, F, G
        [0, 5], [0, 7], [0, 8] // High E: A, B, C
      ],

      // A Aeolian (Root A, starting at 5th fret Low E)
      '3NPS - Aeolian (Root A)': [
        [5, 5], [5, 7], [5, 8], // Low E: A, B, C
        [4, 5], [4, 7], [4, 8], // A: D, E, F
        [3, 5], [3, 7], [3, 9], // D: G, A, B
        [2, 5], [2, 7], [2, 9], // G: C, D, E
        [1, 6], [1, 8], [1, 10], // B: F, G, A
        [0, 7], [0, 8], [0, 10]  // High E: C, D, E -> B, C, D
      ],

      // B Locrian (Root B, starting at 7th fret Low E)
      '3NPS - Locrian (Root B)': [
        [5, 7], [5, 8], [5, 10], // Low E: B, C, D
        [4, 7], [4, 8], [4, 10], // A: E, F, G
        [3, 7], [3, 9], [3, 10], // D: A, B, C
        [2, 7], [2, 9], [2, 10], // G: D, E, F
        [1, 8], [1, 10], [1, 12], // B: G, A, B
        [0, 8], [0, 10], [0, 12]  // High E: D, E, F -> C, D, E
      ],

      // CAGED System for C Major
      // Each shape is moveable, shown here in C Major position

      // C Shape (Root C at 3rd fret A string)
      'CAGED - C Shape': [
        [5, 3], [5, 5], [5, 7], [5, 8], // Low E: G, A, B, C
        [4, 2], [4, 3], [4, 5], // A: B, C, D
        [3, 2], [3, 4], [3, 5], // D: E, F, G
        [2, 3], [2, 5], // G: B, C
        [1, 3], [1, 5], // B: D, E
        [0, 3], [0, 5]  // High E: G, A
      ],

      // A Shape (Root C at 8th fret Low E)
      'CAGED - A Shape': [
        [5, 7], [5, 8], [5, 10], // Low E: B, C, D
        [4, 7], [4, 8], [4, 10], // A: E, F, G
        [3, 7], [3, 9], [3, 10], // D: A, B, C
        [2, 7], [2, 9], [2, 10], // G: D, E, F
        [1, 8], [1, 10], // B: G, A
        [0, 8], [0, 10]  // High E: C, D
      ],

      // G Shape (Root C at 10th fret A string)
      'CAGED - G Shape': [
        [5, 10], [5, 12], [5, 13], // Low E: D, E, F
        [4, 10], [4, 12], // A: G, A
        [3, 9], [3, 10], [3, 12], // D: B, C, D
        [2, 10], [2, 12], // G: F, G
        [1, 10], [1, 12], [1, 13], // B: A, B, C
        [0, 10], [0, 12], [0, 13]  // High E: D, E, F
      ],

      // E Shape (Root C at 15th fret A string)
      'CAGED - E Shape': [
        [5, 12], [5, 13], [5, 15], // Low E: E, F, G
        [4, 14], [4, 15], [4, 17], // A: C, D, E
        [3, 14], [3, 15], [3, 17], // D: F, G, A
        [2, 14], [2, 16], [2, 17], // G: B, C, D
        [1, 15], [1, 17], // B: D, E
        [0, 15], [0, 17]  // High E: G, A
      ],

      // D Shape (Root C at 17th fret A string)
      'CAGED - D Shape': [
        [5, 15], [5, 17], [5, 19], [5, 20], // Low E: G, A, B, C
        [4, 17], [4, 19], [4, 20], // A: D, E, F
        [3, 17], [3, 19], [3, 21], // D: A, B, C
        [2, 17], [2, 19], [2, 21], // G: D, E, F
        [1, 17], [1, 18], [1, 20], // B: F, G, A
        [0, 17], [0, 19], [0, 20]  // High E: B, C, D
      ]
    },
    // Other scales will only have 'All Notes' for now
    'G Major': { 'All Notes': [] },
    'A Minor': { 'All Notes': [] },
    'F Lydian': { 'All Notes': [] },
    'G Mixolydian': { 'All Notes': [] },
  };

  const [scale, setScale] = useState(scales['C Major']);
  const [activeScale, setActiveScale] = useState('C Major');
  const [currentScaleRootNote, setCurrentScaleRootNote] = useState('C');
  const [tuningName, setTuningName] = useState('Standard');
  const [tuning, setTuning] = useState(tunings['Standard'].reverse());
  const [noteDisplayMode, setNoteDisplayMode] = useState('all');
  const [activePatternName, setActivePatternName] = useState('All Notes'); // New state for active pattern

  useEffect(() => { // Using useEffect here as well
    setCurrentScaleRootNote(scales[activeScale][0]);
  }, [activeScale]); // Dependency on activeScale to update root note when scale changes


  const handleTuningChange = (e) => {
    const newTuningName = e.target.value;
    setTuningName(newTuningName);
    setTuning(tunings[newTuningName].slice().reverse());
  };

  const handleScaleClick = (scaleName) => {
    const selectedScale = scales[scaleName];
    setScale(selectedScale);
    setActiveScale(scaleName);
    setCurrentScaleRootNote(selectedScale[0]);
    setActivePatternName('All Notes'); // Reset pattern selection when scale changes
  };

  const handleNoteDisplayModeChange = (e) => {
    setNoteDisplayMode(e.target.value);
  };

  const handlePatternChange = (e) => {
    setActivePatternName(e.target.value);
  };
  
  // Get notes for the active pattern
  const activePatternNotes = scalePatterns[activeScale] ? scalePatterns[activeScale][activePatternName] : [];


  return (
    <div className="App">
      <h1>Guitar Fretboard</h1>
      <div className="controls-container">
        <div className="tuning-control">
          <label htmlFor="tuning-select">Tuning:</label>
          <select id="tuning-select" value={tuningName} onChange={handleTuningChange}>
            {Object.keys(tunings).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="note-display-control">
          <label htmlFor="note-display-select">Display:</label>
          <select id="note-display-select" value={noteDisplayMode} onChange={handleNoteDisplayModeChange}>
            <option value="all">Show All Notes</option>
            <option value="scale">Show Scale Notes Only</option>
            <option value="phonetic-scale-degree">Show Phonetic Scale Degree</option>
            <option value="none">Hide All Notes</option>
          </select>
        </div>
        <div className="scale-buttons">
          {Object.keys(scales).map(scaleName => (
            <button
              key={scaleName}
              className={activeScale === scaleName ? 'active' : ''}
              onClick={() => handleScaleClick(scaleName)}
            >
              {scaleLabels[scaleName] || scaleName}
            </button>
          ))}
        </div>

        {/* New pattern selection controls */}
        {scalePatterns[activeScale] && Object.keys(scalePatterns[activeScale]).length > 1 && (
          <div className="pattern-control">
            <label>Pattern:</label>
            {Object.keys(scalePatterns[activeScale]).map(patternName => (
              <label key={patternName}>
                <input
                  type="radio"
                  name="pattern"
                  value={patternName}
                  checked={activePatternName === patternName}
                  onChange={handlePatternChange}
                />
                {patternName}
              </label>
            ))}
          </div>
        )}
      </div>
      <Fretboard 
        scale={scale} 
        tuning={tuning} 
        noteDisplayMode={noteDisplayMode} 
        getScaleDegreePhonetic={getScaleDegreePhonetic} 
        currentScaleRootNote={currentScaleRootNote}
        activePatternNotes={activePatternNotes} // Pass active pattern notes
      />
    </div>
  );
}

export default App;