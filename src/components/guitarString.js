import React, { Component } from 'react';
import './guitarString.styl';

class GuitarString extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scales: [{
        fret: Math.floor(Math.random() * 15),
        note: props.emptyNote
      }]
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    this.props.onStringClick(i)
  }

  componentWillReceiveProps({ emptyNote }) {
    let index = Math.floor(emptyNote) - 1;
    const scales = [emptyNote];
    const NOTE_DIFFS = [0.5, 0.5, 1, 0.5, 0.5, 0.5, 1];
    for (let i = 1; i <= 15; i++) {
      scales.push(scales[i - 1] + NOTE_DIFFS[index]);
      if (Math.floor(scales[i]) > Math.floor(scales[i - 1])) {
        index++;
      }
      if (index > 6) {
        index -= 7;
      }
    }
    this.setState({
      scales: scales.reduce((accumulator, curr, i) => {
        if (Math.floor(curr) === curr) {
          while (curr > 7 || curr < 1) {
            curr += curr > 7 ? -7 : 7;
          }
          accumulator.push({
            fret: i,
            note: curr
          })
        }
        return accumulator;
      }, [])
    })
  }

  render() {
    const segments = [];
    for (let i = 0; i <= 15; i++) {
      const scale = this.state.scales.find(scale => scale.fret === i);
      segments.push(
        <div className="string-segment" key={i} onClick={e => this.handleClick(i, e)}>
          {
            scale
              ? <span
                  className={`string-segment-note${scale.note === 1 ? ' is-do' : ''}`}>
                  {scale.note}
                </span>
              : null
          }
        </div>
      )
    }
    return (
      <div className={`string${this.props.isSixth ? ' is-sixth' : ''}`}>
        {segments}
      </div>
    );
  }
}

GuitarString.defaultProps = {
  emptyNote: 1,
  isSixth: false,
  onStringClick() {}
};

export default GuitarString;