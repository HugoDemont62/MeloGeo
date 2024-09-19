import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import styles from './WaveBar.module.css';

const WaveBarComponent = ({ synth }) => {
  const canvasRef = useRef(null);
  const waveFormRef = useRef(new Tone.Waveform(2048));

  useEffect(() => {
    const waveForm = waveFormRef.current;

    if (synth) {
      synth.connect(waveForm);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.moveTo(0, height / 2);

      waveForm.getValue().forEach((value, index) => {
        const x = (index / waveForm.size) * width;
        const y = ((value + 1) / 2) * height;
        ctx.lineTo(x, y);
      });

      ctx.stroke();
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (synth) {
        synth.disconnect(waveForm);
      }
    };
  }, [synth]);

  return <canvas ref={canvasRef} className={styles.waveBar}></canvas>;
};

export default WaveBarComponent;