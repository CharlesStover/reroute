const clearAll = document.getElementById('clear-all');
const tbody = document.getElementsByTagName('tbody').item(0);

chrome.storage.sync.get('reroutes', data => {
  if (data.reroutes) {
    for (const reroute of data.reroutes) {
      const row = document.createElement('tr');
      const oldRoute = document.createElement('td');
      oldRoute.appendChild(document.createTextNode(reroute.route));
      row.appendChild(oldRoute);
      const newRoute = document.createElement('td');
      newRoute.appendChild(document.createTextNode(reroute.reroute));
      row.appendChild(newRoute);
      const deleteReroute = document.createElement('td');
      deleteReroute.appendChild(document.createTextNode('🗑'));
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
    enabled: true,
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
