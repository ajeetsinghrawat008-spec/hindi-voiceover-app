import { VoiceTone } from '../types';

export const VOICE_TONES: VoiceTone[] = [
  {
    id: 'dark-psychology',
    name: 'Dark Psychology',
    hindiLabel: 'डार्क साइकोलॉजी',
    description: 'Deep, mysterious, serious male voice',
    voiceId: 'hi-IN-Neural2-B',
    gender: 'MALE',
    basePitch: -2.5,
    baseSpeed: 0.92,
    badge: 'Deep & Mysterious',
    moodTag: 'Serious',
    samplePhrase: 'लोग जो सच छुपाते हैं, उनकी आँखें हमेशा कहानी बयां करती हैं। कभी भी किसी के चेहरे की मुस्कान पर तुरंत भरोसा मत करो।'
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    hindiLabel: 'कहानी वाचक',
    description: 'Warm, engaging, natural male voice',
    voiceId: 'hi-IN-Neural2-C',
    gender: 'MALE',
    basePitch: -0.5,
    baseSpeed: 0.96,
    badge: 'Warm & Engaging',
    moodTag: 'Narrative',
    samplePhrase: 'यह बात उस पुराने शहर की है, जहां शाम होते ही गलियों में एक अजीब सा सन्नाटा और रहस्य फैल जाता था।'
  },
  {
    id: 'motivational',
    name: 'Motivational/Self Improvement',
    hindiLabel: 'प्रेरणादायक / मोटिवेशनल',
    description: 'Confident, inspiring male voice',
    voiceId: 'hi-IN-Wavenet-B',
    gender: 'MALE',
    basePitch: 0.5,
    baseSpeed: 1.05,
    badge: 'Confident & Inspiring',
    moodTag: 'High Energy',
    samplePhrase: 'अगर तुम्हें सूरज की तरह चमकना है, तो पहले सूरज की तरह जलना सीखो। कोई भी मंज़िल तुम्हारी हिम्मत से बड़ी नहीं हो सकती!'
  },
  {
    id: 'documentary',
    name: 'Documentary Narrator',
    hindiLabel: 'डॉक्यूमेंट्री नैरेटर',
    description: 'Calm, authoritative, professional male voice',
    voiceId: 'hi-IN-Wavenet-C',
    gender: 'MALE',
    basePitch: -1.0,
    baseSpeed: 0.94,
    badge: 'Calm & Authoritative',
    moodTag: 'Professional',
    samplePhrase: 'हज़ारों साल पहले जब इंसान ने पहली बार पहिये का आविष्कार किया, तब सभ्यता के इतिहास में एक नया युग प्रारंभ हुआ था।'
  },
  {
    id: 'deep-attractive',
    name: 'Deep Attractive Male',
    hindiLabel: 'डीप अट्रैक्टिव वॉइस',
    description: 'Deep, rich, magnetic, cinematic male voice, slightly lower pitch and slower pace than the others, meant to sound charismatic and premium',
    voiceId: 'hi-IN-Neural2-B',
    gender: 'MALE',
    basePitch: -4.0,
    baseSpeed: 0.88,
    badge: 'Magnetic & Cinematic',
    moodTag: 'Premium Charisma',
    samplePhrase: 'जिंदगी में कुछ फैसले खामोशी से लिए जाते हैं, लेकिन उनका असर पूरी कायनात पर गूंजता है।'
  }
];

export const DEFAULT_SCRIPT = `सफलता सिर्फ सोचने से नहीं मिलती, बल्कि हर दिन लगातार अनुशासन और मेहनत से हासिल होती है। जब आप अपने डर का सामना करते हैं, तो कोई भी रुकावट आपको रोक नहीं सकती।`;
