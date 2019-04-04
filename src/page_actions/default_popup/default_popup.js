const clearAll = document.getElementById('clear-all');
const tbody = document.getElementsByTagName('tbody').item(0);


const handleDelete = reroute => {
  if (confirm('Are you sure you want to delete this reroute?')) {
    chrome.storage.sync.get('reroutes', data => {
      if (data.reroutes) {
        chrome.storage.sync.set({
          reroutes: data.reroutes.filter(rr =>
            rr.route !== reroute.route ||
            rr.reroute !== reroute.reroute
          )
        });
        location.reload();
      }
      else {
        alert('Error 1: Could not find any existing reroutes.');
      }
    });
  }
};

const handleEnable = (reroute, enabled) => {
  chrome.storage.sync.get('reroutes', data => {
    if (data.reroutes) {
      chrome.storage.sync.set({
        reroutes: data.reroutes.map(rr =>
          rr.route === reroute.route &&
          rr.reroute === reroute.reroute ? {
            ...rr,
            enabled,
          } :
          rr
        )
      });
    }
    else {
      alert('Error 2: could not find any existing reroutes.');
    }
  });
};



chrome.storage.sync.get('formReroute', data => {
  if (data.formReroute) {
    document.forms[0].reroute.value = data.formReroute;
  }
});

chrome.storage.sync.get('formRoute', data => {
  if (data.formRoute) {
    document.forms[0].route.value = data.formRoute;
  }
});

chrome.storage.sync.get('reroutes', data => {
  if (data.reroutes) {
    for (const reroute of data.reroutes) {
      const row = document.createElement('tr');
      const enabled = document.createElement('td');
      enabled.className = 'enabled';
      const enabledCheckbox = document.createElement('input');
      enabledCheckbox.checked = reroute.enabled;
      enabledCheckbox.setAttribute('type', 'checkbox');
      enabledCheckbox.addEventListener('click', e => {
        handleEnable(reroute, e.target.checked);
      });
      enabled.appendChild(enabledCheckbox);
      row.appendChild(enabled);
      const oldRoute = document.createElement('td');
      oldRoute.className = 'old-route route-column';
      const oldRouteDiv = document.createElement('div');
      oldRouteDiv.appendChild(document.createTextNode(reroute.route));
      oldRoute.appendChild(oldRouteDiv);
      row.appendChild(oldRoute);
      const newRoute = document.createElement('td');
      newRoute.className = 'new-route route-column';
      const newRouteDiv = document.createElement('div');
      newRouteDiv.appendChild(document.createTextNode(reroute.reroute));
      newRoute.appendChild(newRouteDiv);
      row.appendChild(newRoute);
      const deleteReroute = document.createElement('td');
      deleteReroute.className = 'delete';
      const deleteRerouteSpan = document.createElement('span');
      deleteRerouteSpan.appendChild(document.createTextNode('🗑'));
      deleteRerouteSpan.addEventListener('click', () => {
        handleDelete(reroute);
      });
      deleteReroute.appendChild(deleteRerouteSpan);
      row.appendChild(deleteReroute);
      tbody.appendChild(row);
    }
  }
});



clearAll.addEventListener('click', () => {
  if (confirm('Are you sure you want to erase all of your rerouting rules?')) {
    chrome.storage.sync.clear();
    location.reload();
  }
});



document.forms[0].addEventListener('submit', e => {
  e.preventDefault();
  const reroute = {
    enabled: document.forms[0].enabledCheckbox.checked,
    reroute: document.forms[0].reroute.value,
    route: document.forms[0].route.value,
  };
  chrome.storage.sync.get('reroutes', data => {
    if (data.reroutes) {
      chrome.storage.sync.set({
        reroutes: data.reroutes.concat([ reroute ])
      });
    }
    else {
      chrome.storage.sync.set({
        reroutes: [ reroute ]
      });
    }
  });
  location.reload();
  return false;
});

let formRerouteDebounce = 0;
document.forms[0].reroute.addEventListener('keyup', e => {
  clearTimeout(formRerouteDebounce);
  formRerouteDebounce = setTimeout(() => {
    chrome.storage.sync.set({
      formReroute: e.target.value,
    });
  }, 20);
});

let formRouteDebounce = 0;
document.forms[0].route.addEventListener('keyup', e => {
  clearTimeout(formRouteDebounce);
  formRouteDebounce = setTimeout(() => {
    chrome.storage.sync.set({
      formRoute: e.target.value,
    });
  }, 20);
});
