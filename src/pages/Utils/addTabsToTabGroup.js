const addTabsToTabGroup = async (tabs, ruleSet) => {
  if (!tabs.length) return

  if (!ruleSet) {
    tabs.forEach(tab => chrome.tabs.ungroup(tab.id))
    return
  }

  const { color, title } = ruleSet
  const group = await chrome.tabGroups.query({ color, windowId: tabs[0].windowId })

  if (group.length) {
    chrome.tabs.group({ groupId: group[0].id, tabIds: tabs.map(tab => tab.id) })
  } else {
    chrome.tabs.group({ tabIds: tabs.map(tab => tab.id) }, groupId => {
      chrome.tabGroups.update(groupId, { color, title })
    })
  }
}

export default addTabsToTabGroup
