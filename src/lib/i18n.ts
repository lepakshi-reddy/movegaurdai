import { Language } from '../types/database';

export interface Translations {
  brand: string;
  tagline: string;
  nav: {
    dashboard: string;
    analyze: string;
    posture: string;
    exercises: string;
    reports: string;
    history: string;
    chat: string;
    profile: string;
    settings: string;
    admin: string;
    login: string;
    signup: string;
    logout: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    lead: string;
    startFree: string;
    tryDemo: string;
    trust1: string;
    trust2: string;
    trust3: string;
  };
  analyze: {
    title: string;
    subtitle: string;
    localPrivacy: string;
    demoModeAlert: string;
    startCamera: string;
    stopCamera: string;
    runDemo: string;
    finishWorkout: string;
    liveFormScore: string;
    repetitions: string;
    correct: string;
    issues: string;
    repProgress: string;
    currentAngle: string;
    movementState: string;
    postureMode: string;
    squatMode: string;
    pushupMode: string;
    situpMode: string;
    lungeMode: string;
    cameraError: string;
    noPerson: string;
    lowConfidence: string;
  };
  posture: {
    title: string;
    subtitle: string;
    overallScore: string;
    neckAlignment: string;
    shoulderAlignment: string;
    backAlignment: string;
    startCheck: string;
    stopCheck: string;
    tips: string;
    disclaimer: string;
  };
  chat: {
    title: string;
    placeholder: string;
    disclaimer: string;
    quickQuestions: string[];
  };
  dashboard: {
    movementScore: string;
    todayReps: string;
    workoutSessions: string;
    averageForm: string;
    activeMinutes: string;
    movementBreaks: string;
    weeklyProgress: string;
    recentSessions: string;
    streak: string;
    emptyTitle: string;
    emptySubtitle: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    brand: 'MoveGuard AI',
    tagline: 'Move better. Train smarter.',
    nav: {
      dashboard: 'Dashboard',
      analyze: 'Analyze',
      posture: 'Posture',
      exercises: 'Exercises',
      reports: 'Reports',
      history: 'History',
      chat: 'AI Assistant',
      profile: 'Profile',
      settings: 'Settings',
      admin: 'Admin',
      login: 'Log In',
      signup: 'Sign Up',
      logout: 'Log Out',
    },
    hero: {
      badge: '● Track 03 · HealthTech Hackathon',
      title1: 'Move better.',
      title2: 'Train smarter.',
      lead: 'AI-powered movement and posture guidance that helps you understand how you move through your camera with real-time on-device feedback.',
      startFree: 'Start Free',
      tryDemo: 'Try Demo',
      trust1: '🔒 100% On-Device Privacy',
      trust2: '⚡ Real-time Joint Analysis',
      trust3: '📷 No Wearables Needed',
    },
    analyze: {
      title: 'AI Movement Coach',
      subtitle: 'Real-time biomechanics & repetition tracker',
      localPrivacy: '🔒 Local-first processing',
      demoModeAlert: 'DEMO MODE — SIMULATED: Running simulated biomechanical data for presentation.',
      startCamera: 'Start Camera',
      stopCamera: 'Stop Camera',
      runDemo: 'Run Demo Mode',
      finishWorkout: 'Complete & Save Workout',
      liveFormScore: 'LIVE FORM SCORE',
      repetitions: 'REPETITIONS',
      correct: 'GOOD REPS',
      issues: 'FORM CUES',
      repProgress: 'Rep Progress',
      currentAngle: 'Joint Angle',
      movementState: 'State',
      postureMode: '🧍 Posture Check',
      squatMode: '🏋️ Squat',
      pushupMode: '💪 Push-up',
      situpMode: '🧘 Sit-up',
      lungeMode: '🦵 Lunge',
      cameraError: 'Camera inaccessible or denied. Demo mode is ready.',
      noPerson: 'Position yourself clearly in frame',
      lowConfidence: 'Adjust lighting or step back for better tracking',
    },
    posture: {
      title: 'Ergonomic Posture Analysis',
      subtitle: 'Real-time assessment of neck, shoulder, and spinal alignment',
      overallScore: 'Posture Score',
      neckAlignment: 'Neck Alignment',
      shoulderAlignment: 'Shoulder Alignment',
      backAlignment: 'Spine Alignment',
      startCheck: 'Start Posture Check',
      stopCheck: 'Stop Check',
      tips: 'Ergonomic Cues',
      disclaimer: 'For wellness and posture awareness only. Not a medical diagnostic tool.',
    },
    chat: {
      title: 'MoveGuard AI Wellness Assistant',
      placeholder: 'Ask about exercise form, posture tips, or workout routines...',
      disclaimer: 'MoveGuard Assistant offers educational wellness guidance and does not provide medical diagnoses.',
      quickQuestions: [
        'How can I improve my squat depth?',
        'What are easy desk exercises for neck stiffness?',
        'How do I maintain a straight back during push-ups?',
        'How is the Form Score calculated?',
      ],
    },
    dashboard: {
      movementScore: 'Movement Score',
      todayReps: "Today's Reps",
      workoutSessions: 'Workout Sessions',
      averageForm: 'Average Form',
      activeMinutes: 'Active Minutes',
      movementBreaks: 'Movement Breaks',
      weeklyProgress: 'Weekly Progress',
      recentSessions: 'Recent Sessions',
      streak: '🔥 6 day streak',
      emptyTitle: 'No workouts logged yet',
      emptySubtitle: 'Start an analysis session with your camera or try Demo Mode to see live stats.',
    },
  },
  te: {
    brand: 'మూవ్‌గార్డ్ AI',
    tagline: 'మంచిగా కదలండి. తెలివిగా శిక్షణ పొందండి.',
    nav: {
      dashboard: 'డాష్‌బోర్డ్',
      analyze: 'విశ్లేషణ',
      posture: 'భంగిమ (పోస్చర్)',
      exercises: 'వ్యాయామాలు',
      reports: 'నివేదికలు',
      history: 'చరిత్ర',
      chat: 'AI సహాయకుడు',
      profile: 'ప్రొఫైల్',
      settings: 'సెట్టింగ్‌లు',
      admin: 'అడ్మిన్',
      login: 'లాగిన్',
      signup: 'సైన్ అప్',
      logout: 'లాగౌట్',
    },
    hero: {
      badge: '● హెల్త్‌టెక్ హ్యాకథాన్',
      title1: 'మంచిగా కదలండి.',
      title2: 'తెలివిగా శిక్షణ పొందండి.',
      lead: 'కెమెరా ఆధారంగా మీ వ్యాయామ భంగిమ మరియు కదలికలను రియల్-టైమ్‌లో విశ్లేషించే ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ గైడ్.',
      startFree: 'ఉచితంగా ప్రారంభించండి',
      tryDemo: 'డెమో ప్రయత్నించండి',
      trust1: '🔒 100% గోప్యత రక్షణ',
      trust2: '⚡ రియల్-టైమ్ విశ్లేషణ',
      trust3: '📷 ధరించగల పరికరాలు అవసరం లేదు',
    },
    analyze: {
      title: 'AI మూవ్‌మెంట్ కోచ్',
      subtitle: 'రియల్-టైమ్ శరీర కదలికలు మరియు రెప్ కౌంటర్',
      localPrivacy: '🔒 సురక్షిత స్థానిక ప్రాసెసింగ్',
      demoModeAlert: 'డెమో మోడ్ — సిమ్యులేటెడ్: ప్రదర్శన కోసం సిమ్యులేట్ చేసిన డేటా నడుస్తోంది.',
      startCamera: 'కెమెరా ఆన్ చేయండి',
      stopCamera: 'కెమెరా ఆపండి',
      runDemo: 'డెమో మోడ్ అమలు చేయండి',
      finishWorkout: 'వ్యాయామం పూర్తి చేసి సేవ్ చేయండి',
      liveFormScore: 'లైవ్ ఫారమ్ స్కోరు',
      repetitions: 'రెప్స్ (కౌంట్)',
      correct: 'సరైన రెప్స్',
      issues: 'సవరణలు',
      repProgress: 'రెప్ పురోగతి',
      currentAngle: 'కీలు కోణం',
      movementState: 'స్థితి',
      postureMode: '🧍 పోస్చర్ తనిఖీ',
      squatMode: '🏋️ స్క్వాట్',
      pushupMode: '💪 పుష్-అప్',
      situpMode: '🧘 సిట్-అప్',
      lungeMode: '🦵 లంజ్',
      cameraError: 'కెమెరా అందుబాటులో లేదు. డెమో మోడ్ సిద్ధంగా ఉంది.',
      noPerson: 'కెమెరా ముందు స్పష్టంగా నిలబడండి',
      lowConfidence: 'సరైన వెలుతురు ఉండేలా చూసుకోండి',
    },
    posture: {
      title: 'ఎర్గోనామిక్ పోస్చర్ విశ్లేషణ',
      subtitle: 'మెడ, భుజాలు మరియు వెన్నుముక అమరిక తనిఖీ',
      overallScore: 'పోస్చర్ స్కోరు',
      neckAlignment: 'మెడ అమరిక',
      shoulderAlignment: 'భుజాల సమతుల్యత',
      backAlignment: 'వెన్నుముక నిటారుదనం',
      startCheck: 'పోస్చర్ తనిఖీ ప్రారంభించండి',
      stopCheck: 'ఆపండి',
      tips: 'ఎర్గోనామిక్ సూచనలు',
      disclaimer: 'ఇది కేవలం ఆరోగ్యం మరియు అవగాహన కోసం మాత్రమే. వైద్య నిర్ధారణ కాదు.',
    },
    chat: {
      title: 'మూవ్‌గార్డ్ AI వెల్‌నెస్ అసిస్టెంట్',
      placeholder: 'వ్యాయామ రూపం, పోస్చర్ లేదా ఫిట్‌నెస్ గురించి అడగండి...',
      disclaimer: 'మూవ్‌గార్డ్ అసిస్టెంట్ కేవలం ఫిట్‌నెస్ మార్గదర్శకత్వం అందిస్తుంది; వైద్య చికిత్స కాదు.',
      quickQuestions: [
        'స్క్వాట్ చేసేటప్పుడు లోతు ఎలా పెంచాలి?',
        'మెడ నొప్పి నివారించడానికి డెస్క్ వ్యాయామాలు ఏమిటి?',
        'పుష్-అప్స్ లో శరీరం నిటారుగా ఎలా ఉంచాలి?',
        'ఫారమ్ స్కోర్ ఎలా లెక్కిస్తారు?',
      ],
    },
    dashboard: {
      movementScore: 'మూవ్‌మెంట్ స్కోరు',
      todayReps: 'నేటి రెప్స్',
      workoutSessions: 'వర్కౌట్ సెషన్లు',
      averageForm: 'సగటు ఫారమ్',
      activeMinutes: 'యాక్టివ్ నిమిషాలు',
      movementBreaks: 'కదలిక విరామాలు',
      weeklyProgress: 'వారపు పురోగతి',
      recentSessions: 'ఇటీవలి సెషన్లు',
      streak: '🔥 6 రోజుల స్ట్రీక్',
      emptyTitle: 'ఇంకా వర్కౌట్లు నమోదు కాలేదు',
      emptySubtitle: 'లైవ్ గణాంకాలను చూడటానికి మీ కెమెరాతో సెషన్ ప్రారంభించండి లేదా డెమో మోడ్ ప్రయత్నించండి.',
    },
  },
  hi: {
    brand: 'मूवगार्ड AI',
    tagline: 'बेहतर चलें। स्मार्ट अभ्यास करें।',
    nav: {
      dashboard: 'डैशबोर्ड',
      analyze: 'विश्लेषण',
      posture: 'मुद्रा (पोस्चर)',
      exercises: 'व्यायाम',
      reports: 'रिपोर्ट्स',
      history: 'इतिहास',
      chat: 'AI सहायक',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      admin: 'व्यवस्थापक',
      login: 'लॉग इन',
      signup: 'साइन अप',
      logout: 'लॉग आउट',
    },
    hero: {
      badge: '● हेल्थटेक हैकथॉन',
      title1: 'बेहतर चलें।',
      title2: 'स्मार्ट अभ्यास करें।',
      lead: 'कैमरे के माध्यम से आपके व्यायाम और मुद्रा का विश्लेषण करने वाला उन्नत AI सहायक, जो तुरंत मार्गदर्शन देता है।',
      startFree: 'मुफ्त शुरू करें',
      tryDemo: 'डेमो आज़माएं',
      trust1: '🔒 100% ऑन-डिवाइस गोपनीयता',
      trust2: '⚡ रीयल-टाइम विश्लेषण',
      trust3: '📷 बिना किसी वियरेबल के',
    },
    analyze: {
      title: 'AI मूवमेंट कोच',
      subtitle: 'रीयल-टाइम बायोमैकेनिक्स और रेप ट्रैकर',
      localPrivacy: '🔒 सुरक्षित स्थानीय प्रसंस्करण',
      demoModeAlert: 'डेमो मोड — सिम्युलेटेड: प्रस्तुति के लिए सिम्युलेटेड डेटा चल रहा है।',
      startCamera: 'कैमरा शुरू करें',
      stopCamera: 'कैमरा बंद करें',
      runDemo: 'डेमो मोड चलाएं',
      finishWorkout: 'व्यायाम पूरा करें और सहेजें',
      liveFormScore: 'लाइव फॉर्म स्कोर',
      repetitions: 'रेप्स',
      correct: 'सही रेप्स',
      issues: 'सुधार सुझाव',
      repProgress: 'रेप प्रगति',
      currentAngle: 'जोड़ का कोण',
      movementState: 'स्थिति',
      postureMode: '🧍 मुद्रा जांच',
      squatMode: '🏋️ स्क्वाट',
      pushupMode: '💪 पुश-अप',
      situpMode: '🧘 सिट-अप',
      lungeMode: '🦵 लंज',
      cameraError: 'कैमरा अनुपलब्ध या अनुमति अस्वीकृत। डेमो मोड तैयार है।',
      noPerson: 'कृपया कैमरे के सामने स्पष्ट खड़े हों',
      lowConfidence: 'बेहतर ट्रैकिंग के लिए प्रकाश व्यवस्था ठीक करें',
    },
    posture: {
      title: 'एर्गोनोमिक मुद्रा विश्लेषण',
      subtitle: 'गर्दन, कंधों और रीढ़ की हड्डी के संरेखण का रीयल-टाइम मूल्यांकन',
      overallScore: 'मुद्रा स्कोर',
      neckAlignment: 'गर्दन संरेखण',
      shoulderAlignment: 'कंधे का संरेखण',
      backAlignment: 'रीढ़ संरेखण',
      startCheck: 'मुद्रा जांच शुरू करें',
      stopCheck: 'जांच रोकें',
      tips: 'एर्गोनोमिक सुझाव',
      disclaimer: 'यह केवल तंदुरुस्ती और जागरूकता के लिए है, चिकित्सीय निदान नहीं।',
    },
    chat: {
      title: 'मूवगार्ड AI वेलनेस सहायक',
      placeholder: 'व्यायाम के तरीके, मुद्रा या फिटनेस के बारे में पूछें...',
      disclaimer: 'मूवगार्ड सहायक केवल फिटनेस सलाह देता है, कोई चिकित्सीय निदान नहीं।',
      quickQuestions: [
        'स्क्वाट में सही गहराई कैसे प्राप्त करें?',
        'गर्दन के तनाव के लिए कौन से व्यायाम अच्छे हैं?',
        'पुश-अप के दौरान शरीर को सीधा कैसे रखें?',
        'फॉर्म स्कोर की गणना कैसे की जाती है?',
      ],
    },
    dashboard: {
      movementScore: 'मूवमेंट स्कोर',
      todayReps: 'आज के रेप्स',
      workoutSessions: 'वर्कआउट सत्र',
      averageForm: 'औसत फॉर्म',
      activeMinutes: 'सक्रिय मिनट',
      movementBreaks: 'मूवमेंट ब्रेक',
      weeklyProgress: 'साप्ताहिक प्रगति',
      recentSessions: 'हाल के सत्र',
      streak: '🔥 6 दिन की निरंतरता',
      emptyTitle: 'अभी तक कोई वर्कआउट दर्ज नहीं हुआ',
      emptySubtitle: 'लाइव आंकड़े देखने के लिए कैमरे के साथ सत्र शुरू करें या डेमो मोड आज़माएं।',
    },
  },
};

export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.en;
}
