// Copyright (c) 2016 debstep. All rights reserved.
// Merge selected tabs into new window.

// merge selected tabs
function mergeSelectedTabs() {
    var selected_tabIds = [];
    $('input[type="checkbox"]:checked').each(function () {
        selected_tabIds.push(parseInt($(this).val()));
    });
    if (selected_tabIds.length > 1) {
        chrome.windows.create({tabId: selected_tabIds[0]}, function (window) {
            chrome.tabs.move(selected_tabIds.slice(1), { windowId: window.id, index: -1 }, function (selected_tabIds) {
                // console.log(selected_tabIds);
            });
        });
    }
    else if (selected_tabIds.length == 1) {
        chrome.windows.create({ tabId: selected_tabIds[0] }, function (window) {
            //console.log(selected_tabIds); 
        });
    }
}

// select window and all tabs within the window
function selectAllTabsInWindow() {
    var window_ids = [];
    $('input[type="checkbox"]:checked').each(function () {
        window_ids.push($(this).val());
    });

    for (var i = 0; i < window_ids.length; i++) {
        $('input[type="checkbox"]').each(function () {
            if (($(this).attr('name')).localeCompare(window_ids[i])) {
                var checkbox = 'input[name="' + window_ids[i] + '"]'
                $(checkbox).prop('checked', true);
            }
        });
    }
}

// clear selected windows and tabs
function clearWindows() {
    var window_ids = [];
    $('input[type="checkbox"]:checked').each(function () {
        window_ids.push($(this).val());
    });

    for (var i = 0; i < window_ids.length; i++) {
        $('input[type="checkbox"]').each(function () {
            console.log($(this));
            if (($(this).attr('name')).localeCompare(window_ids[i])) {
                var checkbox = 'input[name="' + window_ids[i] + '"]'
                $(checkbox).prop('checked', false);
            }
        });
    }
    $('input[name="window"').prop('checked', false);
}

// clears all selected windows and tabs
function clear() {
    $('input:checkbox').removeAttr('checked');
}
// dump all tabs
function dumpTabs() {
    var tabs = chrome.windows.getAll({populate: true},
      function (windows) {
          var window_id = 0;
          for (var i = 0; i < windows.length; i++) {
              window_id = windows[i].id;
              // appends tab titles to tabs list
              chrome.tabs.query({windowId: window_id }, 
                  function (window_tabs) {

                      if (window_tabs.length > 0) {
                          $('#tabs').append(windowIdentifier(window_tabs[0]));
                      }
                      for (var j = 0; j < window_tabs.length; j++) {
                          $('#tabs').append(tabTitle(window_tabs[j]));
                      }
                      $('#tabs').append('<p><br><\p>'); 

                  });
          }
      });
}

// helper function -- returns window checkbox
function windowIdentifier(tab) {
    var window_id = String(tab.windowId);
    var select_all = '<input type="checkbox" name="window"' + ' value="' + window_id + '"><b>Select all tabs in window ' + window_id + '<br><br>';
    return select_all;
}

// helper function -- returns tab checkbox
function tabTitle(tab) {
    var window_id = String(tab.windowId);
    var tab_id = String(tab.id);
    var tab_title = String(tab.title);
    var li = '<input type="checkbox" name="' + window_id + '" value="' + tab_id + '">' + tab_title + '<br>';
    return li;
}

document.addEventListener('DOMContentLoaded', function () {
    dumpTabs();
});

window.onload = function () { 

    var select = document.getElementById('select');
    if (select) {
        select.addEventListener('click', selectAllTabsInWindow);
    }

    var clear_windows = document.getElementById("clear-windows");
    if (clear_windows) {
        clear_windows.addEventListener('click', clearWindows);
    }

    var clear_tabs = document.getElementById("clear-all");
    if (clear_tabs) {
        clear_tabs.addEventListener('click', clear);
    }

    var merge = document.getElementById('merge');
    if (merge) {
        merge.addEventListener('click', mergeSelectedTabs);
    }
}

