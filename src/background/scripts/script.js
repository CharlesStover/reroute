const beforeWebRequestFilter = {
  urls: [
    'http://*/*',
    'https://*/*',
  ],
};

const beforeWebRequestExtraInfoSpec = [ 'blocking' ];

const handleBeforeWebRequest = ({ url }) => {
};


chrome.runtime.onInstalled.addListener(function handleAddInstalledListener() {
  chrome.declarativeContent.onPageChanged.removeRules(
    undefined,
    function handleRemovePageChangedRules() {
      chrome.declarativeContent.onPageChanged.addRules([{
        actions: [
          new chrome.declarativeContent.ShowPageAction(),
        ],
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              schemes: [ 'http', 'https' ],
            },
          }),
        ],
      }]);
    }
  );
});

chrome.webRequest.onBeforeRequest.addListener(
  handleBeforeWebRequest,
  beforeWebRequestFilter,
  beforeWebRequestExtraInfoSpec,
);
