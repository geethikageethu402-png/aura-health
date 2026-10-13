import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable large payloads for base64 audio and medical report images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Helper to obtain initialized GoogleGenAI client if API key exists
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// 1. Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    timestamp: new Date().toISOString(),
    service: 'AuraHealth Voice & Clinical Copilot Backend',
  });
});

// 2. Full-pipeline Voice Assistant Endpoint (Audio/Text In -> Transcription -> Clinical Diagnosis -> TTS Speech Out)
app.post('/api/ai/voice-assistant', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', text, history = [], userContext, includeAudio = true } = req.body;
    const ai = getGenAIClient();

    let recognizedSpeech = (text || '').trim();

    if (!ai) {
      // High-fidelity fallback when API key is not yet configured
      const query = recognizedSpeech || 'How do I maintain healthy metabolic levels?';
      const fallbackReply = `I received your voice inquiry regarding "${query}". Based on your health profile, maintain balanced hydration, consistent daily movement, and balanced sleep. If you ever experience acute chest discomfort or severe shortness of breath, contact emergency services immediately.`;
      
      res.json({
        hasApiKey: false,
        transcript: recognizedSpeech || 'Sample voice query received',
        reply: fallbackReply,
        audioBase64: null,
        suggestedQuestions: [
          'What foods improve my glycemic stability?',
          'How does hydration affect daily blood pressure?',
          'What are ideal heart rate zones for recovery?'
        ],
        source: 'AuraHealth Clinical Heuristics'
      });
      return;
    }

    // Step A: If voice audio is supplied, transcribe using Gemini audio intelligence
    if (audioBase64) {
      const cleanAudio = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');
      try {
        const transcribeRes = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'audio/webm',
                  data: cleanAudio,
                },
              },
              {
                text: 'Transcribe the spoken words from this user audio recording. Return ONLY the exact transcribed text without quotes or preamble.',
              },
            ],
          },
        });
        const transcribed = transcribeRes.text?.trim();
        if (transcribed) {
          recognizedSpeech = transcribed;
        }
      } catch (transcribeError) {
        console.warn('gemini-3.5-transcribe fallback to gemini-3.8-flash:', transcribeError);
        try {
          const fallbackTranscribe = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              {
                inlineData: {
                  mimeType: mimeType || 'audio/webm',
                  data: cleanAudio,
                },
              },
              {
                text: 'Listen to this patient voice clip and extract the transcribed question or doubt. Return only the transcription.',
              },
            ],
          });
          const transcribed = fallbackTranscribe.text?.trim();
          if (transcribed) {
            recognizedSpeech = transcribed;
          }
        } catch (e2) {
          console.warn('Audio transcription failed:', e2);
        }
      }
    }

    // If still no speech detected, prompt user
    if (!recognizedSpeech) {
      res.json({
        hasApiKey: true,
        transcript: '',
        reply: "I couldn't clearly detect your voice in that recording. Please speak clearly into your microphone, or choose one of the suggested health questions below.",
        audioBase64: null,
        suggestedQuestions: [
          'Explain my latest HbA1c results',
          'How can I lower LDL cholesterol naturally?',
          'What is the ideal daily water intake for my profile?'
        ],
        source: 'AuraHealth Voice Assistant'
      });
      return;
    }

    // Step B: Generate conversational clinical answer with Gemini 3.8 Flash
    const systemInstruction = `You are AuraHealth Copilot, an empathetic, evidence-based AI Personal Health & Wellness Copilot.
You are speaking directly to a patient as their voice health assistant.
Guidelines:
- Provide educational, navigational, and reassuring health clarity.
- Keep the response concise, natural for spoken voice playback (2 to 4 clear, impactful sentences), avoiding overly dense walls of text.
- If alarming symptoms are mentioned (e.g. crushing chest pressure, sudden numbness, severe difficulty breathing), immediately advise calling 911/112.
- Patient context: ${userContext && userContext.name ? `${userContext.name}, Age ${userContext.age || 'N/A'}, Blood Group ${userContext.bloodGroup || 'N/A'}, Allergies: ${userContext.allergies?.join(', ') || 'None reported'}` : 'Patient asking a health question.'}
Patient spoke: "${recognizedSpeech}"`;

    const contents = [
      ...history.slice(-4).map((h: any) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: systemInstruction }] },
    ];

    const answerResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
    });

    const reply = answerResponse.text?.trim() || 'I have analyzed your health query. Please consult your physician for personalized clinical prescriptions.';

    // Step C: Generate Studio Voice Audio via Gemini 3.8 Flash Lite TTS
    let generatedAudioBase64: string | null = null;
    if (includeAudio) {
      try {
        // Clean markdown punctuation (asterisks, hashtags) to make voice playback sound silky smooth
        const voiceText = reply
          .replace(/[*_#`~>]/g, '')
          .replace(/\n+/g, ' ')
          .slice(0, 500)
          .trim();

        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: voiceText,
                  speechMetadata: {
                    style: 'Empathetic, clear, and reassuring personal health assistant',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });

        const audioData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (audioData) {
          generatedAudioBase64 = audioData;
        }
      } catch (ttsErr) {
        console.warn('Gemini TTS audio generation notice:', ttsErr);
      }
    }

    res.json({
      hasApiKey: true,
      transcript: recognizedSpeech,
      reply,
      audioBase64: generatedAudioBase64,
      mimeType: 'audio/wav',
      suggestedQuestions: [
        'How does this relate to my long-term cardiovascular health?',
        'What daily habits support healthy recovery?',
        'Should I follow up with my primary doctor about this?'
      ],
      source: 'Gemini 3.8 Flash Voice Intelligence',
    });
  } catch (err: any) {
    console.error('Voice Assistant Error:', err);
    res.status(500).json({ error: err.message || 'Error processing voice assistant request' });
  }
});

// 3. Audio Transcription Endpoint
app.post('/api/ai/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      res.json({
        hasApiKey: false,
        transcript: 'Sample speech recognized (fallback mode)',
      });
      return;
    }

    if (!audioBase64) {
      res.status(400).json({ error: 'Missing audio data' });
      return;
    }

    const cleanAudio = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanAudio,
            },
          },
          { text: 'Transcribe this audio. Return only the plain transcribed text.' },
        ],
      },
    });

    res.json({
      hasApiKey: true,
      transcript: response.text?.trim() || '',
    });
  } catch (err: any) {
    console.error('Transcribe error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Dedicated Text-to-Speech (TTS) Endpoint
app.post('/api/ai/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      res.json({
        hasApiKey: false,
        audioBase64: null,
        message: 'No GEMINI_API_KEY configured for studio TTS.',
      });
      return;
    }

    const cleanText = (text || '')
      .replace(/[*_#`~>]/g, '')
      .replace(/\n+/g, ' ')
      .slice(0, 600)
      .trim();

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Empathetic and clear medical health assistant',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice as any },
          },
        },
      },
    });

    const audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    res.json({
      hasApiKey: true,
      audioBase64: audioBase64 || null,
      mimeType: 'audio/wav',
    });
  } catch (err: any) {
    console.error('TTS error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Standard AI Chat Route
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], userContext } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      res.json({
        hasApiKey: false,
        message: 'No GEMINI_API_KEY configured.',
      });
      return;
    }

    const systemInstruction = `You are AuraHealth Copilot, an empathetic, evidence-based AI Personal Health Copilot.
You assist users by explaining medical concepts, lab markers, wellness strategies, and lifestyle interventions.
Safety boundaries:
- Always emphasize that you provide educational & navigational guidance, not definitive diagnostic prescriptions.
- If alarming symptoms occur (e.g. crushing chest pain, sudden numbness, severe breathing difficulty), advise immediate emergency care (911/112).
- Keep answers structured, conversational, reassuring, and concise with bullet points when helpful.
- User Context: ${userContext && userContext.name ? `${userContext.name}, Age ${userContext.age || 'N/A'}, Blood Group ${userContext.bloodGroup || 'N/A'}, Allergies: ${userContext.allergies?.join(', ') || 'None reported'}` : 'New patient with fresh profile.'}
User asked: "${message}".`;

    const contents = [
      ...history.slice(-6).map((h: any) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: systemInstruction }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
    });

    res.json({
      hasApiKey: true,
      reply: response.text || 'I analyzed your query. Please let me know if you would like me to unpack this further.',
      suggestedQuestions: [
        'What foods help maintain my normal HbA1c?',
        'How does hydration impact blood pressure readings?',
        'What are optimal sleep stages for recovery?',
      ],
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Medical Report Image Multimodal Analysis Route
app.post('/api/ai/analyze-report-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', previousImageBase64 } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      res.json({ hasApiKey: false });
      return;
    }

    const contents: any[] = [];

    if (previousImageBase64) {
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: previousImageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
      contents.push({ text: 'The above image is the PREVIOUS / BASELINE medical laboratory report.' });
    }

    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
      contents.push({ text: 'The above image is the PRESENT / CURRENT medical laboratory report.' });
    }

    contents.push({
      text: `You are an expert clinical pathologist and medical AI vision specialist.
Analyze the uploaded medical report image(s). Do not require the user to type any values.
Extract the patient laboratory test results and compare them if multiple images exist, or provide full clinical interpretation.
Return ONLY valid JSON matching this schema:
{
  "reportTitle": string,
  "detectedDate": string,
  "overallTrajectory": "Positive" | "Mixed" | "Worsened",
  "executiveSummary": string (2-3 sentences explaining findings and shifts),
  "biomarkers": [
    {
      "name": string,
      "category": string,
      "unit": string,
      "previousValue": number,
      "previousDate": string,
      "presentValue": number,
      "presentDate": string,
      "referenceRange": string,
      "status": "Improved" | "Stable" | "Elevated" | "Attention",
      "clinicalInterpretation": string
    }
  ],
  "aiPhysicianTakeaways": string[] (3-4 bullet points for discussion with doctor)
}`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: { responseMimeType: 'application/json' },
    });

    res.json({
      hasApiKey: true,
      result: JSON.parse(response.text || '{}'),
    });
  } catch (err: any) {
    console.error('Report Image Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Medical Reports Comparison Route
app.post('/api/ai/compare-reports', async (req: Request, res: Response) => {
  try {
    const { previousReport, presentReport } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      res.json({ hasApiKey: false });
      return;
    }

    const prompt = `Act as an expert clinical pathologist and preventive medicine physician.
Compare these two temporal health reports for the patient:
PREVIOUS REPORT (${previousReport.date || 'Baseline'}):
${JSON.stringify(previousReport)}

PRESENT REPORT (${presentReport.date || 'Current'}):
${JSON.stringify(presentReport)}

Provide a concise, patient-empowering comparative report in JSON format with:
1. "overallTrajectory": "Positive" | "Mixed" | "Worsened"
2. "executiveSummary": string (2-3 sentences explaining overarching shift)
3. "keyImprovements": string[] (3 bullet points)
4. "areasToWatch": string[] (2 bullet points)
5. "doctorDiscussionQuestions": string[] (3 proactive questions for next doctor visit)
Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json({
      hasApiKey: true,
      result: JSON.parse(response.text || '{}'),
    });
  } catch (err: any) {
    console.error('Compare Reports error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8. Regional Medical Translation Route
app.post('/api/ai/translate', async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      res.json({ hasApiKey: false });
      return;
    }

    const prompt = `Translate the following medical health summary or instruction into ${targetLanguage}.
Make sure medical terms are clear, simple, compassionate, and accurate for a patient and their family.
Original Text: "${text}"
Target Language: ${targetLanguage}
Provide only the translated text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      hasApiKey: true,
      translation: response.text?.trim() || '',
    });
  } catch (err: any) {
    console.error('Translation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 9. AI Executive Health Summary Route
app.post('/api/ai/health-summary', async (req: Request, res: Response) => {
  try {
    const { profile, vitals, records } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      res.json({ hasApiKey: false });
      return;
    }

    const prompt = `Generate a concise 1-page Executive AI Health Summary for:
Patient: ${profile?.name || 'Patient'}, Age: ${profile?.age || 'N/A'}, BMI: ${profile?.bmi || 'N/A'}
Vitals: ${JSON.stringify(vitals || {})}
Key Records: ${JSON.stringify(records || [])}
Format as JSON with:
1. "vitalityScore": number (0-100)
2. "headline": string
3. "currentStatus": string
4. "actionPlan": string[] (4 bullet points)
5. "nextMilestone": string
Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json({
      hasApiKey: true,
      summary: JSON.parse(response.text || '{}'),
    });
  } catch (err: any) {
    console.error('Health summary error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Server setup: dev uses Vite middleware, prod serves static files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AuraHealth Copilot backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
