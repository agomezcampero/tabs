import React, { useEffect, useState } from 'react';
import COLORS from '../Utils/Colors';
import './Popup.scss';
import Tabs from './Tabs';
import PatternSelector from './PatternSelector';
import addTabToTabGroup from '../Utils/addTabToTabGroup';
import debounce from '../Utils/debounce';

const debouncedStorageSet = debounce((key, data) => {
  chrome.storage.sync.set({ [key]: data });
}, 500);


const Popup = () => {
  const [ruleSets, setRuleSets] = useState([]);
  const isLoadingRuleSets = !ruleSets.length;

  const [currentTab, setCurrentTab] = useState(null);
  const currentUrl = currentTab?.url;
  const currentHost = currentUrl && new URL(currentTab.url).host;
  const [isCurrentTabMissingLabel, setIsCurrentTabMissingLabel] = useState(true);
  const isLoadingCurrentTab = !currentTab;

  const isLoading = isLoadingRuleSets || isLoadingCurrentTab;

  const [selectedColor, setSelectedColor] = useState(null);
  const selectedRuleSet = ruleSets.find((ruleSet) => ruleSet.color === selectedColor);

  const selectAndAddCurrentTabToColor = (color) => {
    setSelectedColor(color);
    const ruleSet = ruleSets.find((ruleSet) => ruleSet.color === color);
    const newRuleSet = { ...ruleSet, patterns: [...ruleSet.patterns, currentHost] };
    if (newRuleSet.patterns.length === 1 && !newRuleSet.title) {
      newRuleSet.title = currentTab.title;
    }
    updateRuleSet(newRuleSet);
    setIsCurrentTabMissingLabel(false);
    addTabToTabGroup(currentTab.id, newRuleSet);
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
        setCurrentTab(tabs[0]);
      }
    });
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const currentUrlRuleSet = ruleSets.find((ruleSet) => ruleSet.patterns.some((pattern) => currentUrl.includes(pattern)));
      if (currentUrlRuleSet) {
        setIsCurrentTabMissingLabel(false);
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
    debouncedStorageSet(newRuleSet.color, { title: newRuleSet.title, patterns: newRuleSet.patterns })
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
        setSelectedColor={isCurrentTabMissingLabel && currentHost ? selectAndAddCurrentTabToColor : setSelectedColor}
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
      {!selectedRuleSet && isCurrentTabMissingLabel && (
        <>
          <div className='Title'>
            Select label for <span className='Host'>{currentHost}</span>
          </div>
          <div className='Subtitle' onClick={() => setIsCurrentTabMissingLabel(false)}>
            or click here to not add this site to a label
          </div>
        </>
      )}
      {!selectedRuleSet && !isCurrentTabMissingLabel && (
        <div className='Subtitle'>
          Click any label to change the title and configure the urls it applies to
        </div>
      )}
    </div>
  );
};

export default Popup;
