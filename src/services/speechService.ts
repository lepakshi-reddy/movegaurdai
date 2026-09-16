export class SpeechService {
  private enabled: boolean = true;
  private synth: SpeechSynthesis | null = null;
  private lastSpokenText: string = '';
  private lastSpokenTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.synth) {
      this.synth.cancel();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public speak(text: string, priority: boolean = false) {
    if (!this.enabled || !this.synth) return;

    const now = Date.now();
    // Prevent saying identical feedback cues within 2.5 seconds
    if (!priority && text === this.lastSpokenText && now - this.lastSpokenTime < 2500) {
      return;
    }

    if (priority) {
      this.synth.cancel();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1; // Slightly punchy for athletic coaching
      utterance.pitch = 1.0;
      this.synth.speak(utterance);
      this.lastSpokenText = text;
      this.lastSpokenTime = now;
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

export const speechService = new SpeechService();
