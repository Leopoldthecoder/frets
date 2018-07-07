import React, { Component } from 'react';
import GuitarString from './components/guitarString';
import './App.styl';

const EMPTY_SCALES = ['E', 'B', 'G', 'D', 'A', 'E'];
const STRING_DIFFS = [5, 4, 5, 5, 5];
const NOTE_DIFFS = [2, 2, 1, 2, 2, 2, 1];
const getValidNote = note => {
  while (note < 1 || note > 7) {
    note += note < 1 ? 7 : -7;
  }
  return note;
};

const getNote = (note, distance) => {
  let fretCount = 0;
  let index = distance > 0 ? note - 1 : note - 2;
  let diff = 0;

  while (fretCount < Math.abs(distance)) {
    if (Math.floor(index) === index) {
      while (index < 0 || index > 6) {
        index += index < 0 ? 7 : -7;
      }
      fretCount += NOTE_DIFFS[index];
      diff += distance > 0 ? 1 : -1;
      index += distance > 0 ? 1 : -1;
    } else {
      fretCount += 1;
      diff += distance > 0 ? 0.5 : -0.5;
      index += distance > 0 ? 0.5 : -0.5;
    }
  }
  if (fretCount !== Math.abs(distance)) {
    diff += distance > 0 ? -0.5 : 0.5;
  }
  return getValidNote(note + diff);
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyNotes: [3, 7, 5, 2, 6, 3]
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
      emptyNotes: emptyNotes.map(note => {
        while(note < 1 || note > 7) {
          note += note < 1 ? 7 : -7;
        }
        return note;
      })
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
    for (let i = 1; i <= 15; i++) {
      frets.push(<span key={i}>{i}</span>);
    }
    return (
      <div className="App">
        {strings}
        <div className="fret-index">
          {frets}
        </div>
      </div>
    );
  }
}

export default App;
