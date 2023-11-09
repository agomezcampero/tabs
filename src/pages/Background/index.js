// ruleSet => title: string, color: string, patterns: string[]

import COLORS from '../Utils/Colors'
import addTabToTabGroup from '../Utils/addTabToTabGroup'

let ruleSets = []

const onUrlChange = async (tabId, changeInfo) => {
  const url = changeInfo.url

  if (!url) return

  const ruleSet = ruleSets.find(ruleSet => ruleSet.patterns.some(pattern => url.includes(pattern)))
  addTabToTabGroup(tabId, ruleSet)
}

const syncAndListen = () => {
  chrome.storage.sync.get(COLORS, (result) => {
    if (!result) return

    ruleSets = Object.entries(result).map(([color, data]) => ({
      color,
      ...data
    }));

    chrome.tabs.onUpdated.addListener(onUrlChange)
  });
}

chrome.storage.sync.onChanged.addListener((changes) => {
  Object.entries(changes).forEach(([key, { newValue, oldValue }]) => {
    if (COLORS.includes(key) && newValue?.title !== oldValue?.title) {
      chrome.tabGroups.query({ color: key }, (groups) => {
        groups.forEach((group) => {
          chrome.tabGroups.update(group.id, { title: newValue.title })
        })
      })
    }
  })

  chrome.tabs.onUpdated.removeListener(onUrlChange)
  syncAndListen()
})

syncAndListen()
