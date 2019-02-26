const beforeWebRequestFilter = {
  urls: [
    'http://*/*',
    'https://*/*',
  ],
};

const beforeWebRequestExtraInfoSpec = [ 'blocking' ];

let reroutes = [ ];



const handleChange = changes => {
  if (Object.prototype.hasOwnProperty.call(changes, 'reroutes')) {
    if (!changes.reroutes.newValue) {
      reroutes = [ ];
      return;
    }
    reroutes = changes.reroutes.newValue
      .filter(reroute => reroute.enabled)
      .map(reroute => ({
        ...reroute,
        route: new RegExp(reroute.route)
      }));
    console.log(reroutes);
  }
};

const handleBeforeWebRequest = ({ url }) => {
  for (const reroute of reroutes) {
    if (reroute.route.test(url)) {
      return {
        redirectUrl: reroute.reroute
      };
    }
  }
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

chrome.storage.onChanged.addListener(handleChange);

chrome.storage.sync.get('reroutes', data => {
  if (data.reroutes) {
    reroutes = data.reroutes;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  handleBeforeWebRequest,
  beforeWebRequestFilter,
  beforeWebRequestExtraInfoSpec,
);
