const getHost = (url) => {
  if (!url) return null;

  const urlObj = new URL(url);
  const host = urlObj.host;
  const firstPath = urlObj.pathname.split('/')[1];

  if (host === 'docs.google.com') {
    return `${host}/${firstPath}`
  } else {
    return host;
  }
}

export default getHost;
