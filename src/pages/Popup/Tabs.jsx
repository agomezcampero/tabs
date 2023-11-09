import React, { useState } from 'react';

const Tabs = ({ ruleSets, selectedRuleSet, setSelectedColor, updateRuleSet }) => (
  <div className='Tabs'>
    {ruleSets.map((ruleSet) => (
      <Tab
        key={ruleSet.color}
        onClick={() => setSelectedColor(ruleSet.color)}
        ruleSet={ruleSet}
        isHighlighted={!selectedRuleSet || selectedRuleSet.color === ruleSet.color}
        onSave={(title) => updateRuleSet({ ...ruleSet, title })}
      />
    ))}
  </div>
);

const Tab = ({ ruleSet, onClick, isHighlighted, onSave }) => {
  const { color } = ruleSet;

  const handleChange = (e) => {
    onSave(e.target.value);
  }

  return (
    <div
      className={`Tab bg-${color} ${isHighlighted ? 'isHighlighted' : ''}`}
      onClick={onClick}
    >
      <input
        type="text"
        value={ruleSet?.title || ''}
        onChange={handleChange}
      />
    </div>
  )
}

export default Tabs;