import sounddevice as sd
import numpy as np
import librosa
import time

class AudioDetector:
    def __init__(self, duration=3, threshold_db=-35):
        """
        duration: seconds per audio check
        threshold_db: noise threshold in decibels (higher = more sensitive)
        """
        self.duration = duration
        self.threshold_db = threshold_db

    def _record_audio(self):
        """Record short audio snippet from mic."""
        fs = 16000  # Sample rate
        print("[INFO] Listening...")
        audio = sd.rec(int(self.duration * fs), samplerate=fs, channels=1, dtype='float32')
        sd.wait()
        return audio.flatten(), fs

    def _analyze_audio(self, audio, fs):
        """Return average volume (dB) and number of voice segments."""
        # Compute RMS energy
        rms = np.sqrt(np.mean(audio**2))
        db = 20 * np.log10(rms + 1e-6)

        # Voice activity detection using librosa
        energy = librosa.feature.rms(y=audio)
        voiced_frames = np.sum(energy > np.median(energy) * 1.3)

        return db, voiced_frames

    def detect_live_audio(self):
        """Continuously monitor audio input for unusual patterns."""
        flags = []

        try:
            while True:
                audio, fs = self._record_audio()
                db, voiced = self._analyze_audio(audio, fs)

                if db < self.threshold_db:
                    print("[FLAG] Too quiet — possibly muted or disconnected mic.")
                    flags.append({"type": "no_audio", "db": db})

                elif voiced > 5:
                    print("[FLAG] Multiple voices or background noise detected!")
                    flags.append({"type": "multi_voice", "segments": int(voiced)})

                else:
                    print("[OK] Normal voice detected.")

                time.sleep(1)

        except KeyboardInterrupt:
            print("[INFO] Stopped audio monitoring.")
            return flags
