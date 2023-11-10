const addTabToTabGroup = async (tab, ruleSet) => {
  if (!ruleSet) {
    chrome.tabs.ungroup(tab.id)
    return
  }

  const { color, title } = ruleSet
  const group = await chrome.tabGroups.query({ color, windowId: tab.windowId })

  if (group.length) {
    chrome.tabs.group({ groupId: group[0].id, tabIds: [tab.id] })
  } else {
    chrome.tabs.group({ tabIds: [tab.id] }, groupId => {
      chrome.tabGroups.update(groupId, { color, title })
    })
  }
}

export default addTabToTabGroup
