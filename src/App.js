import React, { Component, StrictMode } from 'react';
import GuitarString from './components/guitarString';
import { EMPTY_SCALES, NOTE_DIFFS, STRING_DIFFS } from './consts';
import { getValidValue } from './utils';
import './App.styl';

const getNote = (note, distance) => {
  let fretCount = 0;
  let index = distance > 0 ? note - 1 : note - 2;
  let diff = 0;

  while (fretCount < Math.abs(distance)) {
    if (Math.floor(index) === index) {
      index = getValidValue(0, 6, index);
      fretCount += NOTE_DIFFS[index];
      const increment = distance > 0 ? 1 : -1;
      diff += increment;
      index += increment;
    } else {
      fretCount += 1;
      const increment = distance > 0 ? 0.5 : -0.5;
      diff += increment;
      index += increment;
    }
  }
  if (fretCount !== Math.abs(distance)) {
    diff += distance > 0 ? -0.5 : 0.5;
  }
  return getValidValue(1, 7, note + diff);
};

const getMajor = (stringNum, fretNum) => {
  const code = EMPTY_SCALES[stringNum].charCodeAt(0);
  let fretCount = 0;
  let index = getValidValue(0, 6, code - 'C'.charCodeAt(0));
  let diff = 0;
  while (fretCount < fretNum) {
    index = getValidValue(0, 6, index);
    fretCount += NOTE_DIFFS[index];
    index++;
    diff++;
  }
  const isSharp = fretCount > fretNum;
  const major = String.fromCharCode(getValidValue(65, 71, code + diff - (isSharp ? 1 : 0)));
  return (isSharp ? '<sup>#</sup>' : '') + major;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyNotes: [3, 7, 5, 2, 6, 3],
      major: 'C'
    };
  }

  handleClick = (stringNum, fretNum) => {
    const emptyNotes = [];
    emptyNotes[stringNum] = getNote(1, -fretNum);

    for (let i = stringNum - 1; i >= 0; i--) {
      emptyNotes[i] = getNote(emptyNotes[i + 1], STRING_DIFFS[i]);
    }
    for (let i = stringNum + 1; i <= 5; i++) {
      emptyNotes[i] = getNote(emptyNotes[i - 1], -STRING_DIFFS[i - 1]);
    }

    this.setState({
      emptyNotes: emptyNotes.map(note => getValidValue(1, 7, note)),
      major: getMajor(stringNum, fretNum)
    });
  };

  componentDidMount() {
    this.handleClick(4, 3);
  }

  render() {
    const strings = EMPTY_SCALES.map((scale, index) => (
      <div key={index} className="string-container">
        <span className="string-note">{scale}</span>
        <GuitarString
          emptyNote={this.state.emptyNotes[index]}
          isSixth={index === 5}
          onStringClick={i => this.handleClick(index, i)}>
        </GuitarString>
      </div>
    ));
    const frets = [];
    for (let i = 0; i <= 15; i++) {
      frets.push(<span key={i}>{i}</span>);
    }
    return (
      <StrictMode>
        <div className="App">
          {strings}
          <div className="fret-index">
            {frets}
          </div>
          <span
            className="major"
            dangerouslySetInnerHTML={{ __html: `1 = ${this.state.major}`}}>
        </span>
        </div>
      </StrictMode>
    );
  }
}

export default App;
