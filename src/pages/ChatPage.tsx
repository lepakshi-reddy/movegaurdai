import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { dbService } from '../services/db';
import { ChatMessage } from '../types/database';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bot, HeartPulse, Send, ShieldAlert, Sparkles, User } from 'lucide-react';

const WELLNESS_KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['squat', 'depth', 'knees'],
    answer:
      'To achieve optimal squat depth in MoveGuard AI, descend until your thighs are parallel to the floor (knee angle below 95°). Keep your chest upright, spine neutral, and drive your knees outward in line with your toes. Push through your mid-foot to return to full extension.',
  },
  {
    keywords: ['warm up', 'warmup', 'prepare'],
    answer:
      'A thorough 5-minute dynamic warm-up primes your nervous system and joint capsules. Recommended routine: 10 arm circles, 10 bodyweight air squats, 10 cat-cow spinal flexions, and 10 dynamic walking lunges to activate your glutes and core.',
  },
  {
    keywords: ['posture', 'desk', 'neck', 'slouch'],
    answer:
      'For healthy desk posture, adjust your monitor so the top third is at eye level. Keep ears vertically stacked above shoulders and feet flat on the floor. Use MoveGuard’s Posture check every 45–60 minutes to combat anterior head carriage.',
  },
  {
    keywords: ['form score', 'calculated', 'scoring', 'why low'],
    answer:
      'MoveGuard Form Score (0–100) measures range of motion completeness, eccentric/concentric tempo stability, and spine alignment. A low score usually indicates shallow depth (e.g. not reaching 95° in squats) or excessive torso forward tilt.',
  },
  {
    keywords: ['how often', 'frequency', 'schedule'],
    answer:
      'For general health and musculoskeletal conditioning, 3 to 4 movement sessions per week with at least 1 day of recovery between intense strength days is ideal. Daily 2-minute posture resets can be done throughout the workday.',
  },
  {
    keywords: ['pushup', 'push-up', 'elbow', 'back'],
    answer:
      'In a push-up, ensure your elbows flare at roughly 45 degrees rather than straight out at 90 degrees to protect the rotator cuff. Maintain a rigid line from shoulders through hips to ankles without sagging or piking.',
  },
];

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      user_id: user?.id || 'usr-demo-001',
      sender: 'assistant',
      content:
        'Hello! I am your MoveGuard AI Wellness Assistant. I can help you with exercise form questions, warm-up strategies, and ergonomic posture guidance. How can I assist your movement today?',
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      user_id: user?.id || 'usr-demo-001',
      sender: 'user',
      content: query,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate smart local wellness inference
    setTimeout(() => {
      const lower = query.toLowerCase();
      let bestMatch = WELLNESS_KNOWLEDGE_BASE.find((k) =>
        k.keywords.some((kw) => lower.includes(kw))
      );

      const reply =
        bestMatch?.answer ||
        `Great question about movement! Proper biomechanics focus on controlled tempo, neutral spine alignment, and breathing through the full range of motion. You can practice in the MoveGuard Analyze room to get live visual joint angle cues.`;

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        user_id: user?.id || 'usr-demo-001',
        sender: 'assistant',
        content: reply,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts = [
    'How can I improve my squat depth?',
    'What are easy desk exercises for neck stiffness?',
    'How do I maintain a straight back during push-ups?',
    'Why is my form score low?',
  ];

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black shadow-glow-cyan">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              MoveGuard Assistant
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                AI Wellness
              </span>
            </h1>
            <p className="text-xs text-slate-400">Biomechanics & Movement Coach</p>
          </div>
        </div>
      </div>

      {/* Wellness Medical Disclaimer Notice */}
      <div className="my-3 px-3.5 py-2 rounded-xl bg-navy-900/80 border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Educational guidance only. MoveGuard Assistant is not a physician and does not diagnose injuries or medical conditions.
        </span>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-xl rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${m.sender === 'user'
                  ? 'bg-white text-black rounded-tr-none'
                  : 'bg-navy-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-glass'
                }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-navy-900/90 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex flex-wrap gap-1.5 py-2">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask MoveGuard Assistant a fitness or posture question..."
          className="flex-1 bg-navy-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <Button type="submit" disabled={!input.trim()} className="gap-2 text-xs">
          <Send className="w-4 h-4" /> Send
        </Button>
      </form>
    </div>
  );
};
