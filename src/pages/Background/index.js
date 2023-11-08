// ruleSet => title: string, color: string, patterns: string[]

import COLORS from '../Utils/Colors'

let ruleSets = []

const onUrlChange = async (tabId, changeInfo) => {
  const url = changeInfo.url

  if (!url) return

  const ruleSet = ruleSets.find(ruleSet => ruleSet.patterns.some(pattern => url.includes(pattern)))
  if (ruleSet) {
    const { color, title } = ruleSet

    const group = await chrome.tabGroups.query({ color })

    if (group.length) {
      chrome.tabs.group({ groupId: group[0].id, tabIds: [tabId] })
    } else {
      chrome.tabs.group({ tabIds: [tabId] }, groupId => {
        chrome.tabGroups.update(groupId, { color, title })
      })
    }
  } else {
    chrome.tabs.ungroup(tabId)
  }
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

chrome.storage.sync.onChanged.addListener(() => {
  chrome.tabs.onUpdated.removeListener(onUrlChange)
  syncAndListen()
})

syncAndListen()
