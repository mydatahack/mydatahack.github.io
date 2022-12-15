Tone.Transport.bpm.value = 107;

// Setting Gain
const gainKick = new Tone.Gain(1);
const gainHiHat = new Tone.Gain(0.8);
const gainSnare = new Tone.Gain(2);
const gainBass = new Tone.Gain(2.5);
const gainPolySynth = new Tone.Gain(0.6);
const gainLeadSynth = new Tone.Gain(0.2);

// Effects
const distortion = new Tone.Distortion({
  distortion: 0.1,
  oversample: '4x', // none, 2x, 4x
});
const reverb = new Tone.Reverb(0.75, 1000);

const reverbLeadSynth = new Tone.Reverb({
  decay: 4,
  wet: 0.2,
  preDelay: 0.25,
});

const feedbackDelay = new Tone.FeedbackDelay('8n', 0.25);

// Compressor
const compressor = new Tone.Compressor({
  ratio: 5,
  threshold: -12,
  release: 0.25,
  attack: 0.02,
  knee: 10,
});

// Equalizer - 3 band frequencies (https://tonejs.github.io/docs/14.7.77/EQ3)
const hiHatEq = new Tone.EQ3(
  {
    lowLevel: 0.5,
    midLevel: 1,
    highLevel: 2.5
  }
);

// Filter - https://tonejs.github.io/docs/14.7.77/Filter
const lowPassfilterForKick = new Tone.Filter({
  frequency: 8000,
});

// Kick
gainKick.chain(lowPassfilterForKick, compressor, Tone.Master);
const kick = new Tone.MembraneSynth({
  pitchDecay:0.05,
  octaves: 4,
  oscillator : {
    type :'fmsine',
    phase: 140,
    modulationType: 'sine',
    modulationIndex:0.8,
    partials: [1] //1,0.1,0.01,0.01
  },
  envelope :{
    attack:0.01,
    decay :0.74,
    sustain: 0.71,
    release: 0.05,
    attackCurve :'exponential'
  }
}).connect(gainKick);

const kickNote = 'E1';
const kickSequence = new Tone.Sequence((time, note) => {
  kick.triggerAttackRelease(note, 0.1, time);
}, [kickNote, [ ,kickNote], kickNote, , , kickNote, , kickNote,])
  .start(0);

// Hi-Hat
gainHiHat.chain(hiHatEq, reverb, Tone.Master);
const hiHat = new Tone.MetalSynth({
  frequency  : 600,
  envelope  : {
    attack  : 0.001 ,
    decay  : 0.03 ,
    release  : 0.05
  }  ,
  harmonicity  : 5.1 ,
  modulationIndex  : 32 ,
  resonance  : 4000 ,
  octaves  : 1.5
}).connect(gainHiHat);

const hiHatLoop = new Tone.Loop(time => {
  hiHat.triggerAttackRelease('C6', '8n', time);
}, '8n').start(0);

// Snare
gainSnare.chain(Tone.Master);
const snareDrum = new Tone.NoiseSynth({
  volume: 2,
  noise: {
    type: 'pink',
    playbackRate: 3,
  },
  envelope: {
    attack: 0.001,
    decay: 0.13,
    sustain: 0,
    release: 0.03,
  },
}).connect(gainSnare);

const snareDrumLoop = new Tone.Loop(time => {
  snareDrum.triggerAttackRelease('2n', time);
}, '2n').start('4n');

gainBass.chain(Tone.Master);
const bass = new Tone.Synth({
  oscillator : {
    type : 'triangle'
  }
}).connect(gainBass);;

// Base sequence
const baseSequence = new Tone.Sequence((time, note) => {
  bass.triggerAttackRelease(note, '4n', time);
}, [['F#0', 'F#0'], [ ,'Bb0'], 'F0', , , 'B0', , 'D1',])
  .start(0);

// Synth Chords
gainPolySynth.chain(feedbackDelay, Tone.Master);
const highSynth = new Tone.PolySynth({
  volume: -16,
  count: 6,
  spread: 80,
  oscillator : {
    type : 'fatsawtooth'
  }
}).connect(gainPolySynth);

const Key1Sequence = new Tone.Sequence((time, note) => {
  highSynth.triggerAttackRelease(note, '4n', time);
}, [['F#5', ], 'Bb5',,,,,,,])
  .start(0);

const Key2Sequence = new Tone.Sequence((time, note) => {
  highSynth.triggerAttackRelease(note, '4n', time);
}, [['C#5', ], 'F#5',,,,,,,] )
  .start(0);

// Synth Hook
gainLeadSynth.chain(reverbLeadSynth, Tone.Master);
const synthLead = new Tone.Synth({
  oscillator : {
    type : 'sawtooth'
  }
}).connect(gainLeadSynth);;
const synthLeadSequence = new Tone.Sequence((time, note) => {
  synthLead.triggerAttackRelease(note, '16n', time);
}, [,,,,'Bb4','F#4','Eb4',,])
  .start(0);

const synthLeadSequence2 = new Tone.Sequence((time, note) => {
  synthLead.triggerAttackRelease(note, '16n', time);
}, [,,,,,,,,,,,,,,,'G#4',])
  .start(0);

const synthLeadSequence3 = new Tone.Sequence((time, note) => {
  synthLead.triggerAttackRelease(note, '16n', time);
}, ['F#4','F#4','F#4','F#4',,,,,,,,,,,,,])
  .start(0);

// Analyse
const waveSynth = new Tone.Waveform();

