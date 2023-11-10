import React, { useState } from 'react';
import t from '../Translations/t';

const PatternSelector = ({ ruleSet, onSave, currentUrl, hasOthersRuleSet }) => {
  const [patterns, setPatterns] = useState(ruleSet?.patterns || []);

  if (!ruleSet) return null

  return (
    <>
      {ruleSet.matchAllOthers ? (
        <div>
          <div className='Title'>{t('use_for_others_description')}</div>
          <div className='Subtitle' onClick={() => onSave({ matchAllOthers: false })}>
            {t('remove_as_others')}
          </div>
        </div>
      ) : (
        <div className='Patterns'>
          {[...patterns, ''].map((pattern, index) => (
            <div key={index} className='Pattern'>
              {pattern ? (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${pattern}&sz=16`}
                  alt={pattern}
                />
              ) : (
                <span className='PatternIcon'>+</span>
              )}
              <input
                className={pattern && currentUrl.includes(pattern) ? 'matchesCurrentUrl' : ''}
                value={pattern}
                onChange={(e) => {
                  const newPatterns = [...patterns];
                  newPatterns[index] = e.target.value;
                  setPatterns(newPatterns);
                  onSave({ patterns: newPatterns.filter(Boolean) });
                }}
                placeholder={t('pattern_placeholder')}
              />
            </div>
          ))}
        </div>
      )}

      {!hasOthersRuleSet && (
        <span
          className='OthersBtn'
          onClick={() => {
            setPatterns([]);
            onSave({ matchAllOthers: true, patterns: [], title: ruleSet.title || t('others') });
          }}
        >
          {t('use_for_others')}
        </span>
      )}
      {!hasOthersRuleSet && patterns.length > 0 && (
        <span className='BtnSeparator'>&nbsp;|&nbsp;</span>
      )}
      {patterns.length > 0 && (
        <span
          className='DeleteAllBtn'
          onClick={() => {
            setPatterns([]);
            onSave({ patterns: [] });
          }}
        >
          {t('delete_all_patterns')}
        </span>
      )}
    </>
  )
}

export default PatternSelector;
