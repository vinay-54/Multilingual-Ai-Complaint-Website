import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "Complaint Portal",
      "sidebar_home": "Home",
      "sidebar_chat": "File Complaint",
      "sidebar_form": "Complaint Form",
      "sidebar_history": "History",
      "sidebar_fir": "FIR Viewer",
      "sidebar_admin": "Admin Dashboard",
      "sidebar_settings": "Settings",
      "user_profile": "User Profile",
      "language": "Language",
      "chat_welcome": "Hello! How can I assist you with filing a complaint today?",
      "chat_input_placeholder": "Type your complaint...",
      "form_incident_type": "Incident Type",
      "form_date": "Date",
      "form_location": "Location",
      "form_description": "Description",
      "form_suspect": "Suspect Details",
      "form_evidence": "Upload Evidence",
      "button_submit": "Submit Complaint",
      "history_title": "Complaint History",
      "admin_dashboard_title": "Admin Dashboard",
      "logout": "Logout",
      "eng_label": "English 🇬🇧",
      "hin_label": "Hindi 🇮🇳",
      "tel_label": "Telugu 🇮🇳",
      "settings_public_profile": "Public Profile",
      "settings_full_name": "Full Name",
      "settings_email": "Email Address",
      "settings_save": "Save Changes",
      "settings_regional": "Regional Settings",
      "settings_app_language": "Application Language",
      "settings_notifications_pref": "Notification Preferences",
      "settings_security_auth": "Security & Authentication"
    }
  },
  hi: {
    translation: {
      "app_name": "शिकायत पोर्टल",
      "sidebar_home": "होम",
      "sidebar_chat": "शिकायत दर्ज करें (चैट)",
      "sidebar_form": "शिकायत फॉर्म",
      "sidebar_history": "इतिहास",
      "sidebar_fir": "प्राथमिकी दर्शक",
      "sidebar_admin": "एडमिन डैशबोर्ड",
      "sidebar_settings": "सेटिंग्स",
      "user_profile": "यूजर प्रोफाइल",
      "language": "भाषा",
      "chat_welcome": "नमस्ते! आज मैं आपकी शिकायत में कैसे मदद कर सकता हूँ?",
      "chat_input_placeholder": "अपनी शिकायत टाइप करें...",
      "form_incident_type": "घटना का प्रकार",
      "form_date": "तारीख",
      "form_location": "स्थान",
      "form_description": "विवरण",
      "form_suspect": "संदिग्ध का विवरण",
      "form_evidence": "सबूत अपलोड करें",
      "button_submit": "शिकायत जमा करें",
      "history_title": "शिकायत इतिहास",
      "admin_dashboard_title": "एडमिन डैशबोर्ड",
      "logout": "लॉग आउट",
      "eng_label": "English 🇬🇧",
      "hin_label": "Hindi 🇮🇳",
      "tel_label": "Telugu 🇮🇳",
      "settings_public_profile": "सार्वजनिक प्रोफाइल",
      "settings_full_name": "पूरा नाम",
      "settings_email": "ईमेल पता",
      "settings_save": "परिवर्तन सहेजें",
      "settings_regional": "क्षेत्रीय स्थितियां",
      "settings_app_language": "एप्लिकेशन भाषा",
      "settings_notifications_pref": "अधिसूचना प्राथमिकताएँ",
      "settings_security_auth": "सुरक्षा और प्रमाणीकरण"
    }
  },
  te: {
    translation: {
      "app_name": "ఫిర్యాదు పోర్టల్",
      "sidebar_home": "హోమ్",
      "sidebar_chat": "ఫిర్యాదు ఫైల్ చేయండి",
      "sidebar_form": "ఫిర్యాదు ఫారం",
      "sidebar_history": "చరిత్ర",
      "sidebar_fir": "ఎఫ్ఐఆర్ వీక్షకుడు",
      "sidebar_admin": "అడ్మిన్ డాష్బోర్డ్",
      "sidebar_settings": "సెట్టింగులు",
      "user_profile": "వినియోగదారు ప్రొఫైల్",
      "language": "భాష",
      "chat_welcome": "నమస్కారం! మీ ఫిర్యాదు నమోదు చేయడంలో నేను మీకు ఎలా సహాయపడగలను?",
      "chat_input_placeholder": "మీ ఫిర్యాదును టైప్ చేయండి...",
      "form_incident_type": "సంఘటన రకం",
      "form_date": "తేదీ",
      "form_location": "స్థానం",
      "form_description": "వివరణ",
      "form_suspect": "అనుమానితుని వివరాలు",
      "form_evidence": "సాక్ష్యాధారాలు అప్లోడ్ చేయండి",
      "button_submit": "ఫిర్యాదు సమర్పించండి",
      "history_title": "ఫిర్యాదు చరిత్ర",
      "admin_dashboard_title": "అడ్మిన్ డాష్బోర్డ్",
      "logout": "లాగ్అవుట్",
      "eng_label": "English 🇬🇧",
      "hin_label": "Hindi 🇮🇳",
      "tel_label": "Telugu 🇮🇳",
      "settings_public_profile": "పబ్లిక్ ప్రొఫైల్",
      "settings_full_name": "పూర్తి పేరు",
      "settings_email": "ఇమెయిల్ చిరునామా",
      "settings_save": "మార్పులను సేవ్ చేయండి",
      "settings_regional": "ప్రాంతీయ సెట్టింగ్‌లు",
      "settings_app_language": "అప్లికేషన్ భాష",
      "settings_notifications_pref": "నోటిఫికేషన్ ప్రాధాన్యతలు",
      "settings_security_auth": "సెక్యూరిటీ మరియు ధృవీకరణ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
