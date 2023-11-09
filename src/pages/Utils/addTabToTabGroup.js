const addTabToTabGroup = async (tabId, ruleSet) => {
  if (!ruleSet) {
    chrome.tabs.ungroup(tabId)
    return
  }

  const { color, title } = ruleSet
  const group = await chrome.tabGroups.query({ color })

  if (group.length) {
    chrome.tabs.group({ groupId: group[0].id, tabIds: [tabId] })
  } else {
    chrome.tabs.group({ tabIds: [tabId] }, groupId => {
      chrome.tabGroups.update(groupId, { color, title })
    })
  }
}

export default addTabToTabGroup