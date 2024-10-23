import i18nhu from '../i18n/hu.i18n';

let currentLang = 'hu';

interface I18n {
  [key: string]: { [key: string]: string };
}

interface I18nParams {
  [key: string]: string;
}

let i18n: I18n = {
  hu: i18nhu
};

function storeMissingLangKeys(key: string, lang: string) {
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

let l = (key: string, params?: I18nParams) => {
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

export default function useI18n(lang: string) {
  currentLang = lang || 'hu';

  return {
    l
  }
}