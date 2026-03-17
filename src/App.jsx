import React, { useState, useEffect, useMemo } from 'react';
import Fretboard from './components/Fretboard';
import './App.css';

// --- Pattern generation ---

const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const modeNames = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];

// Index of the starting mode for each scale (0 = Ionian, 5 = Aeolian, etc.)
const scaleStartingMode = {
  'C Major': 0,
  'G Major': 0,
  'A Minor': 5,
  'F Lydian': 3,
  'G Mixolydian': 4,
};

function generate3NPSPatterns(scale, tuning, startingMode = 0) {
  const chromIdx = (note) => chromatic.indexOf(note);

  const findFret = (stringIdx, note, minFret) => {
    const openIdx = chromIdx(tuning[stringIdx]);
    const noteIdx = chromIdx(note);
    let fret = (noteIdx - openIdx + 12) % 12;
    while (fret < minFret) fret += 12;
    return fret;
  };

  const patterns = {};

  scale.forEach((modeRoot, i) => {
    const modeName = modeNames[(startingMode + i) % 7];
    const key = `3NPS - ${modeName} (Root ${modeRoot})`;
    const pattern = [];

    // Start on Low E (string 5); avoid open string — use fret 12 if result is 0
    let minFret = (() => {
      const f = findFret(5, modeRoot, 0);
      return f === 0 ? 12 : f;
    })();

    let seqPos = i;

    for (let stringIdx = 5; stringIdx >= 0; stringIdx--) {
      const f0 = findFret(stringIdx, scale[seqPos % 7], minFret);
      const f1 = findFret(stringIdx, scale[(seqPos + 1) % 7], f0);
      const f2 = findFret(stringIdx, scale[(seqPos + 2) % 7], f1);
      pattern.push([stringIdx, f0], [stringIdx, f1], [stringIdx, f2]);
      seqPos = (seqPos + 3) % 7;
      minFret = f0 - 2;
    }

    patterns[key] = pattern;
  });

  return patterns;
}

// CAGED shapes hardcoded for C Major (standard tuning)
// Reused for scales that share the same notes as C Major (A Minor, F Lydian, G Mixolydian)
const cMajorCAGED = {
  'CAGED - C Shape': [
    [5, 3], [5, 5], [5, 7], [5, 8],
    [4, 2], [4, 3], [4, 5],
    [3, 2], [3, 4], [3, 5],
    [2, 3], [2, 5],
    [1, 3], [1, 5],
    [0, 3], [0, 5],
  ],
  'CAGED - A Shape': [
    [5, 7], [5, 8], [5, 10],
    [4, 7], [4, 8], [4, 10],
    [3, 7], [3, 9], [3, 10],
    [2, 7], [2, 9], [2, 10],
    [1, 8], [1, 10],
    [0, 8], [0, 10],
  ],
  'CAGED - G Shape': [
    [5, 10], [5, 12], [5, 13],
    [4, 10], [4, 12],
    [3, 9], [3, 10], [3, 12],
    [2, 10], [2, 12],
    [1, 10], [1, 12], [1, 13],
    [0, 10], [0, 12], [0, 13],
  ],
  'CAGED - E Shape': [
    [5, 12], [5, 13], [5, 15],
    [4, 14], [4, 15], [4, 17],
    [3, 14], [3, 15], [3, 17],
    [2, 14], [2, 16], [2, 17],
    [1, 15], [1, 17],
    [0, 15], [0, 17],
  ],
  'CAGED - D Shape': [
    [5, 15], [5, 17], [5, 19], [5, 20],
    [4, 17], [4, 19], [4, 20],
    [3, 17], [3, 19], [3, 21],
    [2, 17], [2, 19], [2, 21],
    [1, 17], [1, 18], [1, 20],
    [0, 17], [0, 19], [0, 20],
  ],
};

// Scales that share the same notes as C Major — reuse CAGED positions
const cMajorFamilyScales = new Set(['C Major', 'A Minor', 'F Lydian', 'G Mixolydian']);

// --- App ---

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

  const scalePhonetics = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'];

  const getScaleDegreePhonetic = (note, scale, rootNote) => {
    if (!scale || scale.length === 0 || !rootNote) return '';
    const rootIndex = scale.indexOf(rootNote);
    if (rootIndex === -1) return '';
    const noteIndexInScale = scale.indexOf(note);
    if (noteIndexInScale === -1) return '';
    const degree = (noteIndexInScale - rootIndex + scale.length) % scale.length;
    return scalePhonetics[degree];
  };

  const [scale, setScale] = useState(scales['C Major']);
  const [activeScale, setActiveScale] = useState('C Major');
  const [currentScaleRootNote, setCurrentScaleRootNote] = useState('C');
  const [tuningName, setTuningName] = useState('Standard');
  const [tuning, setTuning] = useState(tunings['Standard'].slice().reverse());
  const [noteDisplayMode, setNoteDisplayMode] = useState('all');
  const [activePatternName, setActivePatternName] = useState('All Notes');
  const [showAllNotes, setShowAllNotes] = useState(false);

  useEffect(() => {
    setCurrentScaleRootNote(scales[activeScale][0]);
  }, [activeScale]);

  // Build all patterns dynamically whenever tuning changes
  const scalePatterns = useMemo(() => {
    const result = {};
    for (const scaleName of Object.keys(scales)) {
      const startingMode = scaleStartingMode[scaleName] ?? 0;
      const threeNPS = generate3NPSPatterns(scales[scaleName], tuning, startingMode);
      const caged = cMajorFamilyScales.has(scaleName) ? cMajorCAGED : {};
      result[scaleName] = { 'All Notes': [], ...threeNPS, ...caged };
    }
    return result;
  }, [tuning]);

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
    setActivePatternName('All Notes');
  };

  const handleNoteDisplayModeChange = (e) => {
    setNoteDisplayMode(e.target.value);
  };

  const handlePatternChange = (e) => {
    setActivePatternName(e.target.value);
    setShowAllNotes(false);
  };

  const activePatternNotes = scalePatterns[activeScale]?.[activePatternName] ?? [];

  const getPatternsByCategory = () => {
    if (!scalePatterns[activeScale]) return { allNotes: [], threeNPS: [], caged: [] };
    const patternNames = Object.keys(scalePatterns[activeScale]);
    return {
      allNotes: patternNames.filter(name => name === 'All Notes'),
      threeNPS: patternNames.filter(name => name.startsWith('3NPS')),
      caged: patternNames.filter(name => name.startsWith('CAGED')),
    };
  };

  const patternCategories = getPatternsByCategory();

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

        {scalePatterns[activeScale] && Object.keys(scalePatterns[activeScale]).length > 1 && (
          <div className="pattern-control">
            <label className="pattern-main-label">Pattern:</label>

            {patternCategories.allNotes.length > 0 && (
              <div className="pattern-category">
                {patternCategories.allNotes.map(patternName => (
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

            {patternCategories.threeNPS.length > 0 && (
              <div className="pattern-category">
                <div className="pattern-category-title">3NPS:</div>
                {patternCategories.threeNPS.map(patternName => (
                  <label key={patternName}>
                    <input
                      type="radio"
                      name="pattern"
                      value={patternName}
                      checked={activePatternName === patternName}
                      onChange={handlePatternChange}
                    />
                    {patternName.replace('3NPS - ', '')}
                  </label>
                ))}
              </div>
            )}

            {patternCategories.caged.length > 0 && (
              <div className="pattern-category">
                <div className="pattern-category-title">CAGED:</div>
                {patternCategories.caged.map(patternName => (
                  <label key={patternName}>
                    <input
                      type="radio"
                      name="pattern"
                      value={patternName}
                      checked={activePatternName === patternName}
                      onChange={handlePatternChange}
                    />
                    {patternName.replace('CAGED - ', '')}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {activePatternName !== 'All Notes' && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button
            className={`show-all-toggle${showAllNotes ? ' active' : ''}`}
            onClick={() => setShowAllNotes(v => !v)}
          >
            {showAllNotes ? 'Hide All Notes' : 'Show All Notes'}
          </button>
        </div>
      )}
      <Fretboard
        scale={scale}
        tuning={tuning}
        noteDisplayMode={noteDisplayMode}
        getScaleDegreePhonetic={getScaleDegreePhonetic}
        currentScaleRootNote={currentScaleRootNote}
        activePatternNotes={activePatternNotes}
        showAllNotes={showAllNotes}
      />
    </div>
  );
}

export default App;
