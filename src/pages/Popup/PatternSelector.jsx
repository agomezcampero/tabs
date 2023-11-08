import React, { useState } from 'react';

const PatternSelector = ({ ruleSet, onSave, currentUrl }) => {
  const [patterns, setPatterns] = useState(ruleSet?.patterns || []);

  if (!ruleSet) return null

  return (
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
              onSave(newPatterns.filter(Boolean));
            }}
            onBlur={() => onSave(patterns.filter(Boolean))}
            placeholder='Enter a URL domain'
          />
        </div>
      ))}
    </div>
  )
}

export default PatternSelector;
