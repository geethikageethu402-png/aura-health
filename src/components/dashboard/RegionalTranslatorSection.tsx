import React, { useState } from 'react';
import { 
  Languages, 
  Volume2, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  RefreshCw,
  Globe,
  ArrowRight
} from 'lucide-react';
import { translateMedicalContent, REGIONAL_TRANSLATIONS } from '../../services/geminiService';

export const RegionalTranslatorSection: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Hindi');
  const [inputText, setInputText] = useState<string>(
    'Medical Summary: Fasting blood glucose is 98 mg/dL and HbA1c has dropped to 5.7%, indicating normal glycemic health. Triglycerides have reduced by 43%. Drink at least 2.5L water daily and maintain 30 minutes of aerobic walking.'
  );
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const availableLanguages = [
    { name: 'Hindi', script: 'हिन्दी', region: 'India (North / Central)' },
    { name: 'Tamil', script: 'தமிழ்', region: 'India (Tamil Nadu / Global)' },
    { name: 'Telugu', script: 'తెలుగు', region: 'India (Andhra / Telangana)' },
    { name: 'Kannada', script: 'ಕನ್ನಡ', region: 'India (Karnataka)' },
    { name: 'Bengali', script: 'বাংলা', region: 'India / Bangladesh' },
    { name: 'Marathi', script: 'मराठी', region: 'India (Maharashtra)' },
    { name: 'Spanish', script: 'Español', region: 'Spain / Latin America' },
    { name: 'French', script: 'Français', region: 'Europe / Canada' },
  ];

  // Run initial translation on mount or language switch
  const handleTranslate = async (lang = selectedLanguage, text = inputText) => {
    setIsTranslating(true);
    try {
      const result = await translateMedicalContent(text, lang);
      setTranslatedText(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    handleTranslate(lang, inputText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText || inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = translatedText || inputText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Pick appropriate voice language if available
    const langCodeMap: Record<string, string> = {
      Hindi: 'hi-IN',
      Tamil: 'ta-IN',
      Telugu: 'te-IN',
      Kannada: 'kn-IN',
      Bengali: 'bn-IN',
      Marathi: 'mr-IN',
      Spanish: 'es-ES',
      French: 'fr-FR',
    };

    utterance.lang = langCodeMap[selectedLanguage] || 'en-US';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="section-regional-translator" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
      {/* Section Header with Step Badge (06. Regional Language Translator) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
            06
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Regional Language Medical Translator
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                Linguistic Accessibility
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Demystify clinical jargon into mother-tongue dialects for patients, elders, and family caregivers
            </p>
          </div>
        </div>

        <button
          onClick={() => handleTranslate()}
          disabled={isTranslating}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
          <span>{isTranslating ? 'Translating...' : 'Translate Summary'}</span>
        </button>
      </div>

      {/* Language Selection Badges */}
      <div className="my-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center">
          <Globe className="w-3.5 h-3.5 mr-1 text-teal-600" />
          Select Target Regional Language:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {availableLanguages.map((l) => (
            <button
              key={l.name}
              onClick={() => handleLanguageSelect(l.name)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedLanguage === l.name
                  ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm">{l.name}</span>
                <span className={`text-xs font-bold ${selectedLanguage === l.name ? 'text-teal-200' : 'text-teal-700'}`}>
                  {l.script}
                </span>
              </div>
              <p className={`text-[10px] mt-0.5 truncate ${selectedLanguage === l.name ? 'text-teal-100' : 'text-slate-500'}`}>
                {l.region}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Translation Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Source Text Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Source Medical Text (English)</span>
              <span className="text-[10px] text-slate-400">Editable input</span>
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed focus:outline-teal-600"
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                const sample = 'Prescription Protocol: Take Cholecalciferol (Vitamin D3) 5000 IU once daily with breakfast. Take Magnesium Glycinate 300mg before bedtime. Avoid refined sugars to sustain your 5.7% HbA1c.';
                setInputText(sample);
                handleTranslate(selectedLanguage, sample);
              }}
              className="text-[11px] text-teal-700 hover:underline cursor-pointer"
            >
              Load Sample Prescription Text
            </button>
          </div>
        </div>

        {/* Regional Translated Output Box */}
        <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-900 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 mr-1" />
                {selectedLanguage} Translation Output
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Patient-Friendly Clinical AI
              </span>
            </div>

            <div className="w-full p-3 bg-white border border-purple-200/80 rounded-lg text-xs text-slate-800 leading-relaxed min-h-[148px] whitespace-pre-line">
              {isTranslating ? (
                <div className="flex items-center space-x-2 text-purple-700 py-6">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Translating into {selectedLanguage}...</span>
                </div>
              ) : (
                translatedText || REGIONAL_TRANSLATIONS[selectedLanguage]?.healthyStatus || 'Click "Translate Summary" to generate regional translation.'
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mt-3 pt-2 border-t border-purple-200/60 flex items-center justify-between">
            <button
              onClick={handleSpeak}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-purple-200 text-purple-900'
                  : 'bg-white hover:bg-purple-100 text-purple-800 border border-purple-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-600" />
              <span>{isSpeaking ? 'Stop Audio' : 'Listen Aloud'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
