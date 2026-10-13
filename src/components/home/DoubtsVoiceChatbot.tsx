import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  ShieldAlert, 
  RefreshCw,
  Copy,
  Radio,
  AudioWaveform,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DoubtChatMessage, UserProfile } from '../../types/health';
import { processVoiceAssistantQuery, synthesizeSpeechAudio } from '../../services/geminiService';

interface DoubtsVoiceChatbotProps {
  userProfile: UserProfile;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const DoubtsVoiceChatbot: React.FC<DoubtsVoiceChatbotProps> = ({
  userProfile,
  initialQuery,
  onClearInitialQuery,
}) => {
  const [messages, setMessages] = useState<DoubtChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: userProfile.name?.trim()
        ? `Hello ${userProfile.name.split(' ')[0]}! I am your AI Health Doubts & Voice Copilot. You can speak into your microphone or type any question regarding your lab markers, symptoms, nutrition, or medications. I will analyze your inquiry and reply with evidence-based medical clarity and spoken voice.`
        : `Hello! I am your AI Health Doubts & Voice Copilot. You can speak into your microphone or type any question regarding your lab reports, symptoms, nutrition, or daily wellness. I will analyze your inquiry and reply with evidence-based clinical clarity and spoken voice.`,
      timestamp: 'Just now',
      suggestedQuestions: [
        'Why did my HbA1c drop to 5.7%?',
        'What does high LDL with normal triglycerides mean?',
        'How much water should I drink for my weight?',
        'Can neck tension trigger headaches?'
      ],
      sources: ['AuraHealth Clinical Guidelines', 'AHA 2026 Standards'],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [autoPlayVoice, setAutoPlayVoice] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [activeAudioSource, setActiveAudioSource] = useState<string>('Gemini 3.8 Flash Voice Engine');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Initialize browser Web Speech Recognition for live text preview
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          if (transcript) {
            setInputMessage(transcript);
          }
        };

        recognition.onerror = () => {
          // Fallback silently to backend Gemini audio recording
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition initialization notice:', e);
      }
    }

    return () => {
      stopAllAudio();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  // Handle incoming initial queries from other components
  useEffect(() => {
    if (initialQuery) {
      handleSendText(initialQuery);
      onClearInitialQuery?.();
    }
  }, [initialQuery]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isProcessingVoice]);

  const stopAllAudio = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  };

  const playBase64Audio = (audioBase64: string, messageId: string) => {
    stopAllAudio();
    try {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      currentAudioElementRef.current = audio;
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);

      audio.onended = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        currentAudioElementRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        currentAudioElementRef.current = null;
      };

      audio.play().catch((playErr) => {
        console.warn('Audio auto-play permission blocked, click play icon to listen:', playErr);
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      });
    } catch (e) {
      console.error('Audio playback error:', e);
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  };

  const playFallbackSpeech = (text: string, messageId: string) => {
    if (!('speechSynthesis' in window)) return;
    stopAllAudio();

    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`~]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start Voice Assistant Recording
  const startRecording = async () => {
    setMicError(null);
    stopAllAudio();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('Audio recording is not supported in this browser environment. You can use the sample voice buttons or type.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine best supported mime type
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await handleProcessVoiceAudio(audioBlob, mimeType);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start elapsed timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Start live text recognition if browser supports it
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // Recognition might already be running or not allowed
      }
    } catch (err: any) {
      console.warn('Microphone access notice:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError('Microphone permission was denied. Please allow microphone access in your browser address bar or click a sample query below.');
      } else {
        setMicError('Unable to start microphone. Please check your audio input settings.');
      }
      setIsRecording(false);
    }
  };

  // Stop Recording & Send Audio to Backend
  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    try {
      recognitionRef.current?.stop();
    } catch (e) {
      // Ignore
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Send raw recorded audio Blob to backend Voice Assistant
  const handleProcessVoiceAudio = async (blob: Blob, mimeType: string) => {
    setIsProcessingVoice(true);
    setMicError(null);

    // Convert Blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      const preliminaryText = inputMessage.trim();

      // Temporary user message indicator while transcribing
      const tempId = `usr-${Date.now()}`;
      const userMsg: DoubtChatMessage = {
        id: tempId,
        sender: 'user',
        text: preliminaryText || '🎤 [Processing voice audio with Gemini...]',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVoiceInput: true,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputMessage('');

      try {
        const result = await processVoiceAssistantQuery({
          audioBase64: base64data,
          mimeType,
          text: preliminaryText || undefined,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          userProfile,
          includeAudio: true,
        });

        // Update user message with the precise transcribed text
        const actualTranscript = result.transcript || preliminaryText || 'Spoken health question';
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, text: actualTranscript } : m))
        );

        // Add assistant response
        const assistantMsgId = `ast-${Date.now()}`;
        const assistantMsg: DoubtChatMessage = {
          id: assistantMsgId,
          sender: 'assistant',
          text: result.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: result.suggestedQuestions,
          sources: [result.source || 'AuraHealth Clinical Voice Intelligence'],
          audioBase64: result.audioBase64,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setActiveAudioSource(result.source || 'Gemini 3.8 Flash Voice Engine');

        // Auto-play voice audio
        if (autoPlayVoice) {
          if (result.audioBase64) {
            playBase64Audio(result.audioBase64, assistantMsgId);
          } else {
            playFallbackSpeech(result.reply, assistantMsgId);
          }
        }
      } catch (err: any) {
        console.error('Voice Assistant backend failed:', err);
        const fallbackMsg: DoubtChatMessage = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          text: 'I received your voice recording. Please consult your physician for individualized clinical care. If you are experiencing sudden acute symptoms, seek immediate emergency care.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsProcessingVoice(false);
      }
    };
  };

  // Text send handler
  const handleSendText = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    if (isRecording) {
      stopRecording();
    }

    const userMsg: DoubtChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const result = await processVoiceAssistantQuery({
        text,
        history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        userProfile,
        includeAudio: true,
      });

      const assistantMsgId = `ast-${Date.now()}`;
      const assistantMsg: DoubtChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: result.suggestedQuestions,
        sources: [result.source || 'Gemini 3.8 Flash Reasoning'],
        audioBase64: result.audioBase64,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveAudioSource(result.source || 'Gemini 3.8 Flash Voice Engine');

      // Auto-play voice response if enabled
      if (autoPlayVoice) {
        if (result.audioBase64) {
          playBase64Audio(result.audioBase64, assistantMsgId);
        } else {
          playFallbackSpeech(result.reply, assistantMsgId);
        }
      }
    } catch (e) {
      const fallbackMsg: DoubtChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: 'I processed your question. If you are experiencing unexpected pain, tightness, or severe discomfort, please consult your healthcare provider promptly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleSpeakMessage = async (msg: DoubtChatMessage) => {
    if (isSpeaking && speakingMessageId === msg.id) {
      stopAllAudio();
      return;
    }

    if (msg.audioBase64) {
      playBase64Audio(msg.audioBase64, msg.id);
      return;
    }

    // Try backend studio TTS on demand
    try {
      const studioAudio = await synthesizeSpeechAudio(msg.text, 'Kore');
      if (studioAudio) {
        msg.audioBase64 = studioAudio;
        playBase64Audio(studioAudio, msg.id);
        return;
      }
    } catch (e) {
      // Fallback
    }

    playFallbackSpeech(msg.text, msg.id);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="doubts-chatbot" className="py-12 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-100/80 border border-cyan-200 text-cyan-900 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-700 animate-pulse" />
            <span>AI Voice & Doubts Assistant (Full-Stack Backend)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Have Doubts? Speak or Chat with Your Health Copilot
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Equipped with a dedicated server-side voice backend. Tap the microphone to speak your doubts naturally; 
            Gemini transcribes your speech, evaluates your clinical context, and answers aloud with studio audio.
          </p>
        </div>

        {/* Chatbot Interface Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[660px]">
          
          {/* Header Bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-teal-800 via-slate-900 to-cyan-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center space-x-1.5">
                  <span>AuraHealth Voice & Doubts Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                  <span>Backend Audio Engine:</span>
                  <span className="font-semibold text-teal-300">{activeAudioSource}</span>
                </p>
              </div>
            </div>

            {/* Voice Controls: Auto-play toggle & Reset */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setAutoPlayVoice(!autoPlayVoice)}
                className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  autoPlayVoice
                    ? 'bg-teal-500/20 border-teal-400/40 text-teal-200'
                    : 'bg-white/10 border-white/20 text-slate-400 hover:text-white'
                }`}
                title="Toggle automatic spoken voice replies"
              >
                {autoPlayVoice ? <Volume2 className="w-3.5 h-3.5 text-teal-300" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>Voice Auto-Play: {autoPlayVoice ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => {
                  stopAllAudio();
                  setMessages([messages[0]]);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/20"
                title="Reset conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {/* Quick Voice Health Prompts Bar */}
          <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center">
              <AudioWaveform className="w-3.5 h-3.5 text-teal-600 mr-1" />
              Try Voice Questions:
            </span>
            <div className="flex items-center space-x-1.5 shrink-0">
              {[
                'Explain my HbA1c of 5.7%',
                'How to reduce LDL cholesterol naturally?',
                'Is 120/80 healthy blood pressure?',
                'Hydration advice for 64 kg weight'
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendText(query)}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-[11px] font-medium border border-slate-200 hover:border-teal-300 shadow-2xs transition-colors shrink-0 cursor-pointer flex items-center space-x-1"
                >
                  <Mic className="w-2.5 h-2.5 text-teal-600" />
                  <span>{query}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Microphone Permission / Warning Alert */}
          {micError && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{micError}</span>
              </div>
              <button
                onClick={() => setMicError(null)}
                className="text-amber-700 font-bold hover:text-amber-900 cursor-pointer ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-teal-600 text-white shadow-xs'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Assistant Footer Actions (TTS, Copy, Sources) */}
                  {msg.sender === 'assistant' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <div className="flex items-center space-x-3">
                        {/* Listen Aloud Button */}
                        <button
                          onClick={() => handleToggleSpeakMessage(msg)}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                            isSpeaking && speakingMessageId === msg.id
                              ? 'bg-teal-100 text-teal-900 ring-1 ring-teal-400 animate-pulse'
                              : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800'
                          }`}
                          title="Listen with AI voice"
                        >
                          {isSpeaking && speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-teal-700" />
                              <span>Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                              <span>Play Voice</span>
                            </>
                          )}
                        </button>

                        {/* Copy text */}
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.text)}
                          className="flex items-center space-x-1 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        {msg.audioBase64 && (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            <span>Studio Audio Ready</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-up Questions Chips */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center">
                        <Sparkles className="w-3 h-3 text-teal-600 mr-1" />
                        Suggested doubts to ask:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedQuestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendText(sug)}
                            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-[11px] font-medium border border-slate-200 transition-colors cursor-pointer text-left"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {/* AI Typing or Voice Processing Indicator */}
            {(isTyping || isProcessingVoice) && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none p-3.5 border border-slate-200 shadow-xs text-xs text-slate-600 flex items-center space-x-2.5">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="font-semibold text-slate-700">
                    {isProcessingVoice
                      ? 'Transcribing speech & synthesizing clinical voice audio...'
                      : 'Analyzing medical clinical reasoning...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Active Voice Recording Waveform Bar */}
          {isRecording && (
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-900 text-white px-6 py-3 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute" />
                  <span className="w-3 h-3 rounded-full bg-red-500 relative" />
                </div>
                <div>
                  <span className="font-bold text-white">Listening to your voice...</span>
                  <span className="text-teal-300 ml-2">
                    ({recordingSeconds}s) Speak clearly or click Stop to send
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-lg">
                  <div className="w-1 h-3 bg-teal-300 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-1 h-6 bg-teal-100 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-4 bg-cyan-300 rounded-full animate-bounce [animation-delay:0.3s]" />
                  <div className="w-1 h-7 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                  <div className="w-1 h-3 bg-teal-200 rounded-full animate-bounce [animation-delay:0.5s]" />
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Done / Send
                </button>
              </div>
            </div>
          )}

          {/* Input & Voice Controls Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendText();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Microphone Toggle Button */}
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isProcessingVoice}
                className={`p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/40 ring-4 ring-red-200 scale-105'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                }`}
                title={isRecording ? 'Click to stop recording and send' : 'Click to start voice recording'}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5 animate-pulse" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isRecording
                    ? 'Recording live voice speech...'
                    : 'Ask any medical doubt or tap microphone to speak...'
                }
                className="flex-1 px-4 py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-300 focus:outline-teal-600 text-xs sm:text-sm transition-all"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isRecording || isProcessingVoice}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
                title="Send inquiry"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Backend Voice Assistant: Gemini 3.5 Transcribe & Gemini 3.8 Flash TTS</span>
              </span>
              <span className="flex items-center text-amber-600 font-medium">
                <ShieldAlert className="w-3 h-3 mr-1" />
                Educational Guidance • Emergency SOS 911/112
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
