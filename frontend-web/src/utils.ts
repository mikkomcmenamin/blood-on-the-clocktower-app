const makeRandomString = (length: number) =>
  Math.random()
    .toString(36)
    .substring(2, length + 2);

const urlPathPart = window.location.pathname.split("/")[1];

// The url should always have a six-character gameId in it, but if it doesn't, we'll
// generate a random one and redirect to it.
if (!urlPathPart || urlPathPart.length < 6) {
  const gameId = makeRandomString(6);
  window.location.replace(`/${gameId}`);
}

export default urlPathPart;
