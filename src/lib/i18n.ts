import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      login: {
        title: 'Smart Civic Intelligence System',
        subtitle: 'Admin Portal Access',
        adminCode: 'Admin Code',
        adminCodePlaceholder: 'Enter your admin code (e.g., s001, d1, d1m1)',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        signIn: 'Sign In',
        codeHint: 'State: s001 | District: d1-d4 | Mandal: d1m1, d2m2, etc.',
        demoAccounts: 'Demo Accounts'
      },
      ai: {
        inputPlaceholder: 'Ask me about complaints, schemes, traffic, or admin tasks...'
      }
    }
  },
  hi: {
    translation: {
      login: {
        title: 'स्मार्ट नागरिक बुद्धिमत्ता प्रणाली',
        subtitle: 'प्रशासक पोर्टल पहुंच',
        adminCode: 'प्रशासक कोड',
        adminCodePlaceholder: 'अपना प्रशासक कोड दर्ज करें (जैसे s001, d1, d1m1)',
        password: 'पासवर्ड',
        passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
        signIn: 'साइन इन करें',
        codeHint: 'राज्य: s001 | जिला: d1-d4 | मंडल: d1m1, d2m2, आदि।',
        demoAccounts: 'डेमो खाते'
      },
      ai: {
        inputPlaceholder: 'शिकायतों, योजनाओं, ट्रैफिक या प्रशासनिक कार्यों के बारे में पूछें...'
      }
    }
  },
  te: {
    translation: {
      login: {
        title: 'స్మార్ట్ సివిక్ ఇంటెలిజెన్స్ సిస్టమ్',
        subtitle: 'అడ్మిన్ పోర్టల్ యాక్సెస్',
        adminCode: 'అడ్మిన్ కోడ్',
        adminCodePlaceholder: 'మీ అడ్మిన్ కోడ్ ఎంటర్ చేయండి (ఉదా: s001, d1, d1m1)',
        password: 'పాస్‌వర్డ్',
        passwordPlaceholder: 'మీ పాస్‌వర్డ్ ఎంటర్ చేయండి',
        signIn: 'సైన్ ఇన్',
        codeHint: 'రాష్ట్రం: s001 | జిల్లా: d1-d4 | మండలం: d1m1, d2m2, మొదలైనవి।',
        demoAccounts: 'డెమో ఖాతాలు'
      },
      ai: {
        inputPlaceholder: 'ఫిర్యాదులు, పథకాలు, ట్రాఫిక్ లేదా అడ్మిన్ పనుల గురించి అడగండి...'
      }
    }
  },
  ur: {
    translation: {
      login: {
        title: 'سمارٹ سوک انٹیلیجنس سسٹم',
        subtitle: 'ایڈمن پورٹل رسائی',
        adminCode: 'ایڈمن کوڈ',
        adminCodePlaceholder: 'اپنا ایڈمن کوڈ داخل کریں (جیسے s001, d1, d1m1)',
        password: 'پاس ورڈ',
        passwordPlaceholder: 'اپنا پاس ورڈ داخل کریں',
        signIn: 'سائن ان',
        codeHint: 'ریاست: s001 | ضلع: d1-d4 | منڈل: d1m1, d2m2, وغیرہ۔',
        demoAccounts: 'ڈیمو اکاؤنٹس'
      },
      ai: {
        inputPlaceholder: 'شکایات، اسکیمز، ٹریفک یا ایڈمن کاموں کے بارے میں پوچھیں...'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;