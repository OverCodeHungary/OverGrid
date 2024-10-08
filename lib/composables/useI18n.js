import i18nhu from '../i18n/hu.i18n.js';

let currentLang = 'hu';
let i18n = {
  hu: i18nhu
};

function storeMissingLangKeys(key, lang) {
  let cVal = localStorage.getItem('missing-lang-keys-' + lang);
  if(!cVal) {
    cVal = "";
  }

  let cArray = cVal.split(",");
  if(!cArray.includes(key)) {
    cArray.push(key)
  }
  localStorage.setItem('missing-lang-keys-' + lang, cArray.join(","));
}

let l = (key, params = null) => {
  if(!i18n[currentLang][key]) {
    storeMissingLangKeys(key, currentLang);
  }

  if(params) {
    let tempStr = i18n[currentLang][key];
    if(!tempStr) return key;
    
    for(let i in params) {
      tempStr = tempStr.replace("{" + i + "}", params[i]);
    }

    return tempStr;
  }
  else {
    return i18n[currentLang][key] || key;
  }
}

export default function useI18n(lang) {
  currentLang = lang || 'hu';

  return {
    l
  }
}