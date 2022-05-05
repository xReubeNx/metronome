import './App.css';
import useSound from 'use-sound';
import tick from '../src/sound.mp3';
import { useEffect, useState } from 'react';

function App() {
  const [ play ] = useSound(tick);

  const [tickDelay, setTickDelay] = useState(1000); // base delay 1000ms = 1 sec
  const [ticking, setTicking] = useState(false); // start/stop the metronome
  const [prevClick, setPrevClick] = useState(null); // time of clicked button (for setting tempo)
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(playTick, tickDelay);

    return function clear() {
      clearInterval(interval);
    }
  }, [ticking, tickDelay]);

  function playTick() {
    if (ticking) {
      setFlash(true);
      play.call();
      setTimeout(flashHandler, tickDelay/5);
    }
  }

  function flashHandler() {
    setFlash(false);
  }

  function tempoHandler() {
    if (prevClick === null) {
      setPrevClick(Date.now());
    } else {
      let timeDiff = Date.now() - prevClick;
      setTickDelay(timeDiff); // sets the ticking delay to the time difference in clicks
      setPrevClick(Date.now());
    }
  }

  return (
    <div className="wrapper">
      <div className={`container ${flash && 'flash'}`}>

        <div className="top">
          <h1>Metronome</h1>
          <p>{ticking ? 'started' : 'stopped'}</p>
        </div>

        <div className="middle">
          <div>
            <p>Delay: {tickDelay}ms</p>
            <p>BPM: {Math.round(6000000/tickDelay)/100}</p> {/* rounding to 2 sig.fig */}
          </div>
          <input type="range" min="100" max="5000" value={tickDelay} onChange={(e) => {setTickDelay(e.target.value)}}/>
        </div>

        <div className="bottom">
          <button onClick={() => {setTicking(true)}} >Start!</button>
          <button onClick={() => {tempoHandler()}} id="tempo" >Set Tempo!</button>
          <button onClick={() => {setTicking(false)}} >Stop!</button>
        </div>

      </div>
    </div>
  );
}

export default App;
