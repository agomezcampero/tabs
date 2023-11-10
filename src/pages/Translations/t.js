import en from './en.json'
import es from './es.json'

const LANGUAGE = chrome.i18n.getUILanguage()
const TRANSLATIONS_JSON = LANGUAGE.startsWith('es') ? es : en

const t = (key) => TRANSLATIONS_JSON[key] || key

export default t
