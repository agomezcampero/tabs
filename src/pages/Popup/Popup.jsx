import React, { useEffect, useState } from 'react';
import COLORS from '../Utils/Colors';
import './Popup.scss';
import Tabs from './Tabs';
import PatternSelector from './PatternSelector';


const Popup = () => {
  const [ruleSets, setRuleSets] = useState([]);
  const isLoadingRuleSets = !ruleSets.length;

  const [currentUrl, setCurrentUrl] = useState(null);
  const currentHost = currentUrl && new URL(currentUrl).host;
  const [isCurrentUrlMissingLabel, setIsCurrentUrlMissingLabel] = useState(true);
  const isLoadingCurrentUrl = !currentUrl;

  const isLoading = isLoadingRuleSets || isLoadingCurrentUrl;

  const [selectedColor, setSelectedColor] = useState(null);
  const selectedRuleSet = ruleSets.find((ruleSet) => ruleSet.color === selectedColor);

  const setColorAndAddToHost = (color) => {
    setSelectedColor(color);
    const ruleSet = ruleSets.find((ruleSet) => ruleSet.color === color);
    const newRuleSet = { ...ruleSet, patterns: [...ruleSet.patterns, currentHost] };
    updateRuleSet(newRuleSet);
    setIsCurrentUrlMissingLabel(false);
  }

  useEffect(() => {
    chrome.storage.sync.get(COLORS, (result) => {
      const loadedRuleSets = Object.entries(result).map(([color, data]) => ({
        color,
        ...data
      }));
      const remainingColors = COLORS.filter((color) => !loadedRuleSets.some((ruleSet) => ruleSet.color === color));
      setRuleSets([
        ...loadedRuleSets,
        ...remainingColors.map((color) => ({ color, title: '', patterns: [] }))
      ]);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const currentUrlRuleSet = ruleSets.find((ruleSet) => ruleSet.patterns.some((pattern) => currentUrl.includes(pattern)));
      if (currentUrlRuleSet) {
        setIsCurrentUrlMissingLabel(false);
        setSelectedColor(currentUrlRuleSet.color);
      }
    }
  }, [isLoading])

  const updateRuleSet = (newRuleSet) => {
    const newRuleSets = ruleSets.map((ruleSet) => {
      if (ruleSet.color === newRuleSet.color) {
        return newRuleSet;
      }
      return ruleSet;
    });
    chrome.storage.sync.set({ [newRuleSet.color]: { title: newRuleSet.title, patterns: newRuleSet.patterns } });
    setRuleSets(newRuleSets);
  }

  if (isLoading) {
    return null
  }

  return (
    <div className='App'>
      <Tabs
        ruleSets={ruleSets}
        selectedRuleSet={selectedRuleSet}
        setSelectedColor={isCurrentUrlMissingLabel && currentHost ? setColorAndAddToHost : setSelectedColor}
        updateRuleSet={updateRuleSet}
      />
      {selectedRuleSet && (
        <PatternSelector
          key={selectedRuleSet.color}
          currentUrl={currentUrl}
          ruleSet={selectedRuleSet}
          onSave={(patterns) => updateRuleSet({ ...selectedRuleSet, patterns })}
        />
      )}
      {!selectedRuleSet && isCurrentUrlMissingLabel && (
        <>
          <div className='Title'>
            Select label for <span className='Host'>{currentHost}</span>
          </div>
          <div className='Subtitle' onClick={() => setIsCurrentUrlMissingLabel(false)}>
            or click here to not add this site to a label
          </div>
        </>
      )}
      {!selectedRuleSet && !isCurrentUrlMissingLabel && (
        <div className='Subtitle'>
          Click any label to change the title and configure the urls it applies to
        </div>
      )}
    </div>
  );
};

export default Popup;
