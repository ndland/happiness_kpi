// *** HERE LIES PUNCHIT ON AJAX, R.I.P. ***

var dateFormat = function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d:    d,
        dd:   pad(d),
        ddd:  dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m:    m + 1,
        mm:   pad(m + 1),
        mmm:  dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy:   String(y).slice(2),
        yyyy: y,
        h:    H % 12 || 12,
        hh:   pad(H % 12 || 12),
        H:    H,
        HH:   pad(H),
        M:    M,
        MM:   pad(M),
        s:    s,
        ss:   pad(s),
        l:    pad(L, 3),
        L:    pad(L > 99 ? Math.round(L / 10) : L),
        t:    H < 12 ? "a"  : "p",
        tt:   H < 12 ? "am" : "pm",
        T:    H < 12 ? "A"  : "P",
        TT:   H < 12 ? "AM" : "PM",
        Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

// Some common format strings
dateFormat.masks = {
  "default":      "ddd mmm dd yyyy HH:MM:ss",
  shortDate:      "m/d/yy",
  mediumDate:     "mmm d, yyyy",
  longDate:       "mmmm d, yyyy",
  fullDate:       "dddd, mmmm d, yyyy",
  shortTime:      "h:MM TT",
  mediumTime:     "h:MM:ss TT",
  longTime:       "h:MM:ss TT Z",
  isoDate:        "yyyy-mm-dd",
  isoTime:        "HH:MM:ss",
  isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};
/* End Date Format code */

/* Add trim function */
String.prototype.trim = function () {
  var str = this.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
  while (ws.test(str.charAt(--i)));
  return str.slice(0, i + 1);
};

(function($) {    
  $.fn.disable = function () {
    this.attr('disabled', 'disabled');
    return this;
  };

  $.fn.enable = function () {
    this.removeAttr('disabled');
    return this;
  };

  var Utils = {};
  //var baseUrl = "http://punchitlocaldev/api";
  var baseUrl = "https://punchit.atomicobject.com/api";

  _.extend(Utils, {
    ajaxRequest: function(opts) {
      var deferred = $.Deferred();

      var jqXhr = $.ajax({
        url: opts.url,
        dataType: 'json',
        type: opts.method,
        headers: opts.headers,
        data: opts.data
      });

      if (opts.onload) {
        // Backwards compatible with pre-deferred style
        jqXhr.complete(function(xhr) {
          opts.onload(xhr)
        });
      }

      jqXhr.done(function(data) {
        deferred.resolve(data, jqXhr);
      });

      jqXhr.fail(function(xhr) {
          var data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
          deferred.reject(data, jqXhr);
      });

      return deferred.promise();
    },
    readLocal: function(key) {
      return localStorage[key];
    },
    saveLocal: function(key, value) {
      localStorage[key] = value;
    },
    deleteLocal: function(key) {
      localStorage.removeItem(key);
    },
    getElementData: function(elem, key) {
      return $(elem).data(key);
    },
    setElementData: function(elem, key, value) {
      $(elem).data(key, value);
    },
    log: function(msg) {
      console.log(msg);
    },
    getJSON: function(url, callback, headers) {
      var args = {method: 'GET', url: url, headers: headers};
      return this.ajaxRequest(args).pipe(callback);
    }
  });

  var log = Utils.log;
  log("Configured logging...");

  var ActionExecutor = (function() {
    var history = [];
    var redoHistory = [];

    var clearRedoHistory = function () {
      redoHistory = [];
    };

    var pushAction = function(entry) {
      history.push(entry);
      log("Undos available: " + history.length);
    };

    var popAction = function() {
      return history.pop();
    };

    var pushRedo = function(entry) {
      redoHistory.push(entry);
      log("Redos available: " + redoHistory.length);
    };

    var popRedo = function () {
      return redoHistory.pop();
    }

    return {
      execute: function(description, action, undoAction) {
        action(function() {
          clearRedoHistory();
          pushAction({description: description, action: action, undoAction: undoAction});
        });
      },
      undo: function() {
        var entry = popAction();
        if (entry) {
          entry.undoAction(function() {
            pushRedo(entry);
          });
        }
      },
      redo: function() {
        var entry = popRedo();
        if (entry) {
          entry.action(function() {
            pushAction(entry)
          });
        }
      }
    };
  }());

  function pad2(number) {
    number = parseInt(number, 10);
    return (number < 10 ? '0' : '') + number
  }

  var toInt = function(str) {
    return parseInt(str, 10);
  };

  DateTime = (function() {
    // YYYY-mm-dd, returns milliseconds
    var dateParse = function(dateStr) {
      var dateParts = dateStr.split("-");
      var year = parseInt(dateParts[0], 10);
      var month = parseInt(dateParts[1], 10);
      var day = parseInt(dateParts[2], 10);
      return new Date(year, month - 1, day);
    };

    var nextDay = function(date) {
      var result = new Date(date.getTime());
      result.setDate(date.getDate() + 1);
      return result;
    };

    var midnight = function(date) {
      date.setHours(0); // Ensure midnight
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    };

    return {
      daysToMilliseconds: function(days) {
        return days * 24 * 60 * 60 * 1000;
      },

      parse: dateParse,

      makeDate: function(yearStr, monthStr, dayStr) {
        var year = parseInt(yearStr, 10);
        var month = parseInt(monthStr, 10);
        var day = parseInt(dayStr, 10);
        return new Date(year, month - 1, day);
      },

      dateRangeForPeriod: function(self) {
        var EPOCH = dateParse('2000-01-10').getTime();

        var currentPeriod = function(daysInPeriod) {
          var secondsSinceAoEpoch = (new Date() / 1000) - (EPOCH / 1000);
          return Math.floor(secondsSinceAoEpoch / (daysInPeriod * 24 * 60 * 60));
        }

        return function(periodNumber, daysInPeriod) {
          if (!periodNumber) {
            periodNumber = currentPeriod(daysInPeriod);
          }
          var periodStartMillis = EPOCH + DateTime.daysToMilliseconds(periodNumber * daysInPeriod);
          var periodEndMillis = periodStartMillis + DateTime.daysToMilliseconds(daysInPeriod);
          var periodStart = new Date(periodStartMillis);
          midnight(periodStart)
          var periodEnd = new Date(periodEndMillis);
          midnight(periodEnd)
          return [periodStart, periodEnd];
        }
      }(),

      makeWeekRange: function(startOfPeriod, offset) {
        var SECONDS_IN_A_WEEK = 7 * 24 * 60 * 60;
        var startSeconds = (startOfPeriod / 1000) + (offset * SECONDS_IN_A_WEEK);
        var endSeconds = (startOfPeriod / 1000) +  ((offset + 1) * SECONDS_IN_A_WEEK);
        var weekStart = new Date(startSeconds * 1000);
        midnight(weekStart)
        if (weekStart.getDay() == 0) {
          // This can happen in the fall when daylight savings time ends and there is an extra hour in the week
          weekStart = nextDay(weekStart);
        }
        var weekEnd = new Date(endSeconds * 1000);
        midnight(weekEnd);
        if (weekEnd.getDay() == 0) {
          // This can happen in the fall when daylight savings time ends and there is an extra hour in the week
          weekEnd = nextDay(weekEnd);
        }

        return [weekStart, weekEnd];
      },

      daysInRange: function(dateRange) {
        var days = [];
        var day = dateRange[0];
        while (day < dateRange[1]) {
          days.push(day);
          day = nextDay(day);
        }
        return days;
      },

      getMonthName: function(date) {
        var m = ['January','February','March','April','May','June','July',
                 'August','September','October','November','December'];
        return m[date.getMonth()];
      },

      getDayAbbrev: function(date) {
        var day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        return day[date.getDay()];
      },

      midnightToday: function() {
        return midnight(new Date());
      },

      dateObjectToSlashString: function(date) {
        return pad2(date.getMonth() + 1) + "/" + pad2(date.getDate()) + "/" + (1900 + date.getYear());
      },

      dateObjectToDashString: function(date) {
        return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
      },

      backADay: function(date) {
        var result = new Date(date.getTime());
        result.setDate(date.getDate() - 1);
        return result;
      }
    };
  }());

  var lzma = new LZMA("js/lzma_worker.js");

  var urlParam = function(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) {
      return null;
    } else {
      return results[1] || null;
    }
  };

  var chainCallbacks = function() {
    var makeChain = function(func, callbacks) {
      return function () {
        if (callbacks && !_.isEmpty(callbacks)) {
          func(makeChain(_.first(callbacks), _.rest(callbacks)));
        } else {
          func();
        }
      };
    };
    var composedFunctions = makeChain(_.first(arguments), _.rest(arguments));
    composedFunctions();
  };

  var GAP = "cccccc";
  var BILLABLE = "008584";
  var PERSONAL = "d0d0d0";
  var NONBILLABLE = "66d0d0";


  // Initialize some global state
  var PunchIt = {
    employeeId: null,
    activeProjects: {},
    projectStories: {},
    activeProjectsReloaded: false,
    canDisplayWeeklyTotals: false,
    recentProjectIds: [],
    frequentlyUsedProjectIds: [],
    allOtherProjectIds: []
  };

  var PERIOD_DATE_RANGE = DateTime.dateRangeForPeriod(Math.floor(urlParam('week') / 2), 14);
  var WEEK_DATE_RANGE = DateTime.dateRangeForPeriod(urlParam('week'), 7);

  PunchIt.weekOne = {
    rowId: 'week-one',
    hours: {},
    range: DateTime.makeWeekRange(PERIOD_DATE_RANGE[0], 0),
  };

  PunchIt.weekTwo = {
    rowId: 'week-two',
    hours: {},
    range: DateTime.makeWeekRange(PERIOD_DATE_RANGE[0], 1)
  };
  PunchIt.currentWeek = {
    rowId: 'current-week',
    hours: {},
    range: DateTime.makeWeekRange(WEEK_DATE_RANGE[0], 0) // this is a little silly
  };

  var runMigrations = function(currentVersion) {
    var migrationKey = "punchit_on_ajax_migration";
    var oldVersion = Utils.readLocal(migrationKey) || 0.0;
    if (oldVersion < 1.0) {
      // Start over with the local cache of active projects
      Utils.deleteLocal("activeProjects");
    }

    Utils.saveLocal(migrationKey, currentVersion);
  };

  runMigrations(1.0);

  var onAuthenticated = function(callback) {
    $("<img id='punchitapi-blank-img' src='" + baseUrl + "/blank.png?" + Number(new Date()) + "'/>")
      .load(callback).error(function() {
        log("You are not authenticated @ punchitapi.atomicobject.com");
        window.location.href=window.location.href.replace('newpunch', 'punch');
      })
      .appendTo($('body'));
  };

  var onEmployeeIdLoaded = function(callback) {
    var loginContainer = $('td:contains("You are logged in as"):last b');
    if (loginContainer.length == 0) {
      // Probably got the dreaded "redirect to login page" message. No point continuing.
      return;
    }

    var setEmployeeId = function(employeeId) {
      PunchIt.employeeId = employeeId;
      loginContainer.append(" (" + PunchIt.employeeId + ")");
      callback();
    };

    var punchitIdVariable = "punchitid_" + loginContainer.text();
    var employeeId = Utils.readLocal(punchitIdVariable);
    if (employeeId) {
      setEmployeeId(employeeId);
    } else {
      Utils.ajaxRequest({
        method: 'GET',
        url: baseUrl + "/employees?login=" + loginContainer.text(),
        headers: {'range': 'properties=id'}
      }).done(function(employees) {
        var employee = _.first(employees);
        Utils.saveLocal(punchitIdVariable, employee.id);
        setEmployeeId(employee.id);
      }).fail(function() {
        alert('Unable to load employee ' + loginContainer.text());
      });
    }
  };

  chainCallbacks(onAuthenticated, onEmployeeIdLoaded, function() {

    var hideRates = (function() {
      var val = Utils.readLocal("hide_rates");
      return (val && JSON.parse(val));
    }());

    function parseDateFromText(text) {
      var regex = /(\d{2})\/(\d{2})\/(\d{4})/;
      var matches = regex.exec(text);
      return {month: matches[1], day: matches[2], year: matches[3]}
    }

    function retrieveDailyTotal(elem, callback) {
      var dateHeaderCell = $(elem).parents('.dateheader');
      var date = parseDateFromText(dateHeaderCell.text());
      updateGreenBar(dateHeaderCell.find('.greenbar'), date.year + "-" + date.month + "-" + date.day, callback);
    }

    function loadAllDailyTotals() {
      var finished = function() {
        // When hours for all days have been loaded, display the totals at the top of the week
        PunchIt.canDisplayWeeklyTotals = true;
        displayWeeklyTotals(PunchIt.currentWeek);
      };

      var elems = $(".daily-total.question");
      var callsRemaining = _.size(elems);

      _.each(elems, function (elem) {
        retrieveDailyTotal(elem, function() {
          callsRemaining -= 1;
          if (callsRemaining === 0) {
            finished();
          }
        })
      });
    }

    function punchesUrl() {
      if (PunchIt.employeeId == null) {
        alert('Employee id not loaded yet. You have to be more patient. Wait for the failure message.');
      }
      return baseUrl + "/employees/" + PunchIt.employeeId + '/punches';
    }

    function greenBarDiv(content) {
      return '<div class="greenbar" style="width: 100%; height: 40px;">' + content + '</div>';
    }

    var editIconDiv = '<div class="edit-button" style="width: 16px; height: 16px;"></div>';
    var deleteIconDiv = '<div class="delete-button" style="width: 16px; height: 16px;"></div>';


/*
    //addStyles 0.1
    // Ricardo Tomasi < ricardobeat at gmail com >
    // Licensed under the WTFPL - http://sam.zoy.org/wtfpl/
    function addStyles(rule){
      var sheet = document.styleSheets[0];
      var ln = (sheet.cssRules||sheet.rules).length;
      if (sheet.addRule) {
        rule = rule.match(/(.*){(.*)}/);
        sheet.addRule(rule[1],rule[2], ln);
      } else {
        sheet.insertRule(rule, ln);
      };
      return arguments.callee;
    };
*/
    var deletePunch = function(punchId) {
      var punchRow = $('#punch-row-' + punchId);
      if (confirm("Are you sure you want to delete this punch?")) {
        punchRow.find('.delete-button').removeClass("delete-button").addClass("loading");
        punchRow.find('.delete-link').removeClass("delete-link");

        Utils.ajaxRequest({
          method: "GET",
          url: punchesUrl() + "/" + punchId,
          headers: {'range': 'properties=date'},  // just need the date of the punch (and to make sure it is a real punch)
          onload: function(xhr) {
            if (xhr.status == 200) {
              var punchData = JSON.parse(xhr.responseText);

              var dateParts = punchData['date'].split("-");
              var year = dateParts[0];
              var month = dateParts[1];
              var day = dateParts[2];

              var dateStr = month + "/" + day + "/" + year;
              var dateHeaderCell = $('td.dateheader:contains(' + dateStr + ')');

              Utils.ajaxRequest({
                method: "DELETE",
                url: punchesUrl() + "/" + punchId,
                onload: function(xhr) {
                  if (xhr.status == 200) {

                    punchRow.fadeOut("regular", function() {
                      var previousRow = $(this).prev('tr');
                      $(this).remove();
                      restripe(previousRow);
                    });

                    updateGreenBar(dateHeaderCell.find(".greenbar"), punchData['date']);

                  } else {
                    var data = JSON.parse(xhr.responseText);
                    alert("Error deleting punch " + punchId + ": " + data["errors"]);
                  }
                }
              });
            } else {
              alert("Could not find punch to delete: " + punchId);
            }
          }
        });
      }
    };

    var punchForm = function() {
      return $('form#addpunch');
    };

    var projectDropdown = function() {
      return $('select#project', punchForm());
    };

    var storyDropdown = function() {
      return $('select#story', punchForm());
    };

    var startTextBox = function() {
      return $('input#start', punchForm());
    };

    var stopTextBox = function() {
      return $('input#stop', punchForm());
    };

    var notesTextBox = function() {
      return $('textarea#notes', punchForm());
    };

    var punchIdHiddenField = function() {
      return $('input#id', punchForm());
    };

    var yearDropdown = function() {
      return $('select[name="Punch_Year"]', punchForm());
    };

    var monthDropdown = function() {
      return $('select[name="Punch_Month"]', punchForm());
    };

    var dayDropdown = function() {
      return $('select[name="Punch_Day"]', punchForm());
    };

    var punchButton = function() {
      return $('input#punchit', punchForm());
    };

    var addStoryButton = function() {
      return $('input#add-story', punchForm());
    };

    var editStoriesButton = function() {
      return $('#editStories', punchForm());
    };

    var allProjectsButton = function() {
      return $("input#all-projects", punchForm());
    };

    var kpiAPIUrl = function() {
      //return 'http://punchitlocaldev/kpi'
      return 'https://punchit.atomicobject.com/kpi'
    }

    var setProjectAndStory = function(punch) {
      var $projectDropdown = projectDropdown();
      if (toInt($projectDropdown.val()) !== punch.project.id) {

        // Changing the project will refresh the stories
        PunchIt.pendingSelectedStory = punch.story ? punch.story.id : null;
        $projectDropdown.val(punch.project.id).change().trigger("liszt:updated");

      } else if (punch.story) {
        storyDropdown().val(punch.story.id).change().trigger("liszt:updated");
      }
    };

    var resetPunchForm = function resetPunchForm($form) {
      $form.find('input#id').val("");
      $form.find('input#start').val('');
      $form.find('input#stop').val('');
      $form.find('textarea#notes').val("");
    };

    var displayEditMode = function displayEditMode(flag) {
      var $form = punchForm();

      if (flag) {
        if (!$form.hasClass('editing')) {
          $form.addClass('editing');

          var $cancelButton =
            $('<input id="cancel-edit-button" class="half-button" value="Cancel" type="button"/>');

          punchButton().after($cancelButton);
          punchButton().addClass("half-button");

          $cancelButton.click(function (e) {
            e.preventDefault();
            resetPunchForm($form);
            punchButton().removeClass("half-button");
            displayEditMode(false);
            return false;
          });
        }
      } else {
        $form.removeClass('editing');
        $('#cancel-edit-button').remove();
      }
    };

    var checkForToday = function () {
      var formDate = DateTime.makeDate(yearDropdown().val(), monthDropdown().find("option:selected").attr("value"), dayDropdown().val());
      var today = new Date();
      if (formDate.getFullYear() != today.getFullYear() ||
          formDate.getMonth() != today.getMonth() ||
          formDate.getDate() != today.getDate()) {
        $('#not-today').attr("style", "display: inline;");
      } else {
        $('#not-today').hide();
      }

      // If today is in the current week and there is no row for today, add one
      if (today.getDay() > 0 && today.getDay() < 6 && today > PunchIt.currentWeek.range[0] && today < PunchIt.currentWeek.range[1]) {
        if (!findDateHeaderCell(today.getFullYear(), today.getMonth() + 1, today.getDate())) {
          var dateStringDashes = DateTime.dateObjectToDashString(today);
          // Add the new date for punches if not already there
          insertNewDateRow(dateStringDashes);
          var newDateHeaderCell = findDateHeaderCell(today.getFullYear(), today.getMonth() + 1, today.getDate());
          updateGreenBar(newDateHeaderCell.find('.greenbar'), dateStringDashes);
        }
      }
    };

    var populateDateInForm = function(dateWithDashes) {
      var dateParts = dateWithDashes.split("-");
      yearDropdown().val(toInt(dateParts[0]));
      var monthSelect = monthDropdown();
      monthSelect.val($('option', monthSelect).get(parseInt(dateParts[1], 10) - 1).value);
      dayDropdown().val(toInt(dateParts[2]));

      checkForToday();
    };


    var editExistingPunch = function(punchId, punchRow) {
      // alert("going to edit punch: " + punchId);
      scroll(0,0);
      punchButton().hide().after("<span id='punch-msg'><div class='loading'></div>Loading punch...</span>");
      punchRow.find('.edit-button').removeClass("edit-button").addClass("loading");
      punchRow.find('.edit-link').removeClass("edit-link").addClass('loading-edit-link');

      Utils.ajaxRequest({
        method: "GET",
        url: punchesUrl() + "/" + punchId,
        onload: function(xhr) {
          if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            if (data['lock_status'] != "unlocked") {
              alert('This punch is locked. No edit for you!');
            } else {
              // Populate the form
              punchIdHiddenField().val(punchId);

              if (!projectDropdown().find("option[value=" + data['project']['id'] + "]")) {
                alert("You are trying to edit a punch to a project that is not in the list. This should not happen. Refresh and try again.");
                return true;
              }

              setProjectAndStory(data);
              startTextBox().val(data['start']);
              stopTextBox().val(data['stop']);
              notesTextBox().val(data['notes']);

              populateDateInForm(data['date']);

              displayEditMode(true);
            }
          } else {
            alert("Could not find punch.");
          }
          punchButton().show();
          $('#punch-msg').remove();
          punchRow.find('.loading').removeClass("loading").addClass("edit-button");
          punchRow.find('.loading-edit-link').removeClass("loading-edit-link").addClass('edit-link');
        }
      });
    };

    $(document).on('click', 'input#add-story', function() {
      $('#name-new').val("").focus();
      $('#service-new').val("Software Development");
    });
    var jbody = $('body');
    jbody.delegate('#reload-stories', 'click', function(e) {
      e.preventDefault();
      $(this).addClass("loading");
      var projectId = projectDropdown().val();
      updateStoryDropdown(projectId, true);
      return false;
    });

    jbody.bind('punchit:latestStoriesLoaded', function(e, stories) {
      $('#reload-stories').removeClass("loading");
    });

    jbody.delegate('#reload-projects', 'click', function(e) {
      e.preventDefault();
      PunchIt.activeProjectsReloaded = false;
      projectDropdown().empty().append('<option value="">Loading...</option>').trigger("liszt:updated");
      $('#reload-projects').addClass("loading");
      reloadProjects(false);
      return false;
    });

    jbody.bind('punchit:latestProjectsLoaded', function(e, projects) {
      PunchIt.activeProjectsReloaded = true;
      $('#reload-projects').removeClass("loading");
    });

    jbody.delegate('#edit-story-submit', 'click', function(e) {
      e.preventDefault();
      var $updateButton = $(this);
      $updateButton.hide().after("<span id='update-msg' class='loading-left'>Updating...</span>");
      var $form = $updateButton.parents("form:first");
      var phase = $form.find('#phase-edit').val();
      var loEstimate = $form.find('#loEstimate-edit').val();
      var hiEstimate = $form.find('#hiEstimate-edit').val();
      var name = $form.find('#name-edit').val();
      var serviceId = $form.find('#service-edit option:selected').attr("value");
      var description = $form.find('#description-edit').val();
      var percentDone = $form.find('#percentDone-edit').val();
      var projectId = projectDropdown().val();
      var storyId = storyDropdown().val();

      var storyData = {
        'id': storyId,
        'name': name,
        'description': description,
        'hi_estimate': hiEstimate,
        'lo_estimate': loEstimate,
        'percent_done': percentDone,
        'phase_id': phase,
        'project_service_id': serviceId
      };

      Utils.ajaxRequest({
        method: "PUT",
        url: baseUrl + "/projects/" + projectId + "/stories/" + storyId,
        data: JSON.stringify(storyData),
        onload: function(xhr) {
          var data = JSON.parse(xhr.responseText);

          $updateButton.show();
          $('#update-msg').remove();

          if (xhr.status == 200) {

            $('#name-edit').val("");
            $('#description-edit').val("");
            $('#loEstimate-edit').val("0");
            $('#hiEstimate-edit').val("0");
            $('#percentDone-edit').val("0");

            $("#edit-story").hide();

            // Re-fetch the stories, re-selecting the story that was just edited
            PunchIt.pendingSelectedStory = storyId;
            updateStoryDropdown(projectId, true);

            // if (!Utils.isGreasy()) {
              $form.find('input#start').focus();
            // }
          } else {
            alert(data["errors"]);
          }
        }
      });

      return false
    });

    $(document).on('click', '#new-story-submit', function() {
      var addButton = this;

      $(addButton).hide().after("<span id='add-msg' class='loading-left'>Adding...</span>");

      var form = $(addButton).parents("form:first");
      var phase = $(form).find('#phase-new').val();
      var loEstimate = $(form).find('#loEstimate-new').val();
      var hiEstimate = $(form).find('#hiEstimate-new').val();
      var name = $(form).find('#name-new').val();
      var serviceId = $(form).find('#service-new option:selected').attr("value");
      var description = $(form).find('#description-new').val();
      var percentDone = $(form).find('#percentDone-new').val();
      var projectId = $(form).find('select#project option:selected').attr("value");

      var storyData = {
        'name': name,
        'description': description,
        'hi_estimate': hiEstimate,
        'lo_estimate': loEstimate,
        'percent_done': percentDone,
        'phase_id': phase,
        'project_service_id': serviceId
      };

      Utils.ajaxRequest({
        method: "POST",
        url: baseUrl + "/projects/" + projectId + "/stories",
        data: JSON.stringify(storyData),
        onload: function(xhr) {
          var data = JSON.parse(xhr.responseText);

          $(addButton).show();
          $('#add-msg').remove();

          if (xhr.status == 201) {

            $('#name-new').val("");
            $('#description-new').val("");
            $('#loEstimate-new').val("0");
            $('#hiEstimate-new').val("0");
            $('#percentDone-new').val("0");

            $("#new-story").hide();

            // Re-fetch the stories so the new story is included
            PunchIt.pendingSelectedStory = data.id;
            updateStoryDropdown(projectId, true);

            // if (!Utils.isGreasy()) {
            $(form).find('input#start').focus();
            // }
          } else {
            alert(data["errors"]);
          }
        }
      });
      return false;
    });

    var sortDropdown = function($dropdown) {
      // From here: http://sebastienayotte.wordpress.com/2009/08/04/sorting-drop-down-list-with-jquery/

      // Keep track of the selected option.
      var selectedValue = $dropdown.val();

      var finishedStoryRegex = /^\*\*/;

      // Sort all the options by text. I could easily sort these by val.
      $dropdown.html($("option", $dropdown).sort(function(a, b) {
        if (a.value == -1) {
          return -1;
        } else if (b.value == -1) {
          return 1;
        } else if (a.text.match(finishedStoryRegex) && !b.text.match(finishedStoryRegex)) {
          return 1;
        } else if (!a.text.match(finishedStoryRegex) && b.text.match(finishedStoryRegex)) {
          return -1;
        } else {
          return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
        }
      }));

      // Select one option.
      $dropdown.val(selectedValue);
    }

    function populateProjectService(storyRef, $punchRow) {
      if (storyRef) {
        var cell = $punchRow.find('.project-service');
        $(cell).addClass('loading');
        Utils.ajaxRequest({
          method: 'GET',
          url: baseUrl + storyRef,
          headers: {'range': 'properties=project_service'},
          onload: function(xhr) {
            if (xhr.status == 200) {
              var story = JSON.parse(xhr.responseText);
              Utils.ajaxRequest({
                method: 'GET',
                url: baseUrl + story['project_service']['$ref'],
                headers: {'range': 'properties=service,rate'},
                onload: function(xhr) {
                  if (xhr.status == 200) {
                    var projectService = JSON.parse(xhr.responseText);
                    Utils.ajaxRequest({
                      method: 'GET',
                      url: baseUrl + projectService['service']['$ref'],
                      headers: {'range': 'properties=description'},
                      onload: function(xhr) {
                        if (xhr.status == 200) {
                          var service = JSON.parse(xhr.responseText);
                          var output = service['description'];
                          if (!hideRates && projectService['rate'] > -1) {
                            output += "<br/>$" + projectService['rate'] + "/hr";
                          }
                          $(cell).html(output);
                          $(cell).removeClass('loading');
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }

    var makePunchRow = function(data) {
      var storyName = data['storyName'];
      if (storyName == "(no stories)") {
        storyName = "";
      }
      var $html = $("<tr id='punch-row-" + data['id'] + "'><td class='punch-start'>" + data['start'] + "</td><td class='punch-stop'>" + data['stop'] + "</td><td class='punch-project'>" + data['projectName'] + "</td><td class='project-service'></td><td class='punch-notes'><b>" + storyName + "</b><br/>" + data['notes'] + "</td><td><a href='#' punchid='" + data['id'] + "' class='edit-link'>"+editIconDiv+"</a></td><td><a class='delete-link' href='#' punchid='" + data['id'] + "'>"+deleteIconDiv+"</a></td></tr>");
      if (data['story']) {
        populateProjectService(data['story']['$ref'], $html);
      }
      return $html;
    }
    var BGCOLOR = "e0e0e000";

    var restripe = function(previousRow) {
      var nextRow = null;
      var punchRowRegex = /^punch-row-\d+/;
      var even = true;
      
      if (previousRow.attr("id") != undefined && previousRow.attr("id").match(punchRowRegex) &&
          (previousRow.hasClass('even') || previousRow.find('td[bgcolor="#'+BGCOLOR+'"]').length > 0)) {

        even = false;
      }

      while (nextRow = previousRow.next('tr')) {
        if (nextRow.length > 0 && nextRow.prop("id").match(punchRowRegex)) {
          // Remove old striping
          nextRow.find('td').removeAttr("bgcolor");
          if (even) {
            nextRow.removeClass('odd').addClass('even');
            even = false;
          } else {
            nextRow.removeClass('even').addClass('odd');
            even = true;
          }
          previousRow = nextRow;

        } else {
          return;
        }
      }
    }

    var findRowToInsertAfter = function(headerRow, punchStart) {
      var previousRow = headerRow;
      var row = null;
      var regex = /^punch-row-\d+/;

      // Since this is hack-ish, want to prevent infinite loop - quit after 100 tries
      for (var i = 0; i < 100; i++) {
        row = previousRow.next('tr');
        if (row.length > 0 && row.prop("id").match(regex)) {
          var stop = parseFloat(row.find("td.punch-stop").text());
          if (punchStart >= stop) {
            return previousRow;
          }
          previousRow = row;
        } else {
          // No more punches for this day, insert after the last punch
          return previousRow;
        }
      }
      return headerRow;
    }

    // dateStr is in format yyyy-mm-dd for text comparison
    var insertNewDate = function(dateStr, content) {
      var dateHeaders = $('td.dateheader');
      var results = $.grep(dateHeaders, function(item) {
        var date = parseDateFromText($(item).text());
        var currentDateStr = date.year + "-" + date.month + "-" + date.day;
        if (dateStr > currentDateStr) {
          return true;
        } else {
          return false;
        }
      });
      if (results && results.length > 0) {
        // Insert the row before the row that was found
        var row = $(results[0]).parent('tr');
        $(row).before(content);
      } else if (dateHeaders.length > 0) {
        // Did not find a row to insert before, but there are other dates, so needs to
        // go after the last punch-row
        $('tr[id^=punch-row]:last').after(content);
      } else {
        // No days on the page yet, find the right spot to put the first one
        var subTable = $('table#old-punches');
        $(subTable[0]).replaceWith("<table width='100%'>" + content + "</table>");
      }
    }

    // dateStr formatted like 2010-05-01
    function insertNewDateRow(dateStr, insertFunc) {
      if (!insertFunc) {
        insertFunc = insertNewDate;
      }
      var date = DateTime.parse(dateStr);
      var displayDateStr = DateTime.dateObjectToSlashString(date);
      insertFunc(dateStr, ' \
        <tr class="dateheader-row"> \
          <td colspan="7" class="dateheader"> \
            ' + "<span class='day-date'><span class='expanded'></span>" + DateTime.getDayAbbrev(date) + " " + displayDateStr + '</span><span class="punch-info">Content</span><span class="daily-total question"></span> \
            ' + greenBarDiv("<img/>") + ' \
          </td> \
        </tr> \
        <tr class="detailheader"> \
          <td>Start</td> \
          <td>Stop</td> \
          <td>Project</td> \
          <td>Service</td> \
          <td>Notes</td> \
          <td colspan="2">Ops</td> \
        </tr> \
      '
      );
    };

    function findDateHeaderCell(year, month, day) {
      var dateStr = pad2(month) + "/" + pad2(day) + "/" + year;
      var dateHeaderCell = $('td.dateheader:contains(' + dateStr + ')');
      if (dateHeaderCell.length == 0) {
        return null;
      } else {
        return dateHeaderCell;
      }
    }

    var getIdOfPunchBeingEdited = function() {
      return punchIdHiddenField().val();
    };

    var handlePunchClick = function() {
      var $punchButton = punchButton();

      var form = $punchButton.parents("form:first");
      var existingPunchId = getIdOfPunchBeingEdited();

      $punchButton.hide().after("<span id='punch-msg'><div class='loading'></div>Punching...</span>");

      var year = $(form).find('select[name="Punch_Year"] option:selected').attr("value");
      var month = $(form).find('select[name="Punch_Month"] option:selected').attr("value");
      var day = $(form).find('select[name="Punch_Day"] option:selected').attr("value")

      var projectId = $(form).find('select#project option:selected').attr("value");
      var storyId = $(form).find('select#story option:selected').attr("value");
      if (storyId == 'null') {
        storyId = 0;
      }
      var projectName = $(form).find('select#project option:selected').text();
      var storyName = $(form).find('select#story option:selected').text();
      var start = $(form).find('input#start').val();
      var stop = $(form).find('input#stop').val();
      var notes = $(form).find('textarea#notes').val();

      var formattedDate = year + "-" + pad2(month) + "-" + pad2(day);
      var aoPunchData = {
        'start': start,
        'stop': stop,
        'project_id': projectId,
        'story_id': storyId,
        'date':  formattedDate,
        'notes': notes
      };

      var dateHeaderCell = findDateHeaderCell(year, month, day);
      if (!dateHeaderCell) {
        // Add the new date for punches if not already there
        insertNewDateRow(formattedDate);
        dateHeaderCell = findDateHeaderCell(year, month, day);
      }
      var dateRow = dateHeaderCell.parent("tr");
      var headerRow = dateRow.next();
      PunchVisibility.show(dateRow);

      if (existingPunchId) {
        displayEditMode(false);
        Utils.ajaxRequest({
          method: "PUT",
          url: punchesUrl() + "/" + existingPunchId,
          data: JSON.stringify(aoPunchData),
          onload: function(xhr) {
            if (xhr.status == 404) {
              alert('Could not find the punch being edited. Exiting "edit" mode. The next punch will be a new one.');
              $('input#id').val('');
            }
            else {
              var data = JSON.parse(xhr.responseText);
              if (xhr.status == 200) {
                var punchId = data['id'];
                var punchRow = $('#punch-row-' + punchId);
                var oldDateHeaderCell = $(punchRow).prevAll('tr.detailheader:first').prev().find('td.dateheader');
                var oldDateObject = parseDateFromText(oldDateHeaderCell.text());

                $(punchRow).remove();

                var previousRow = findRowToInsertAfter(headerRow, data['start']);
                var $punchHtml = makePunchRow({id: punchId,
                                              start: data['start'],
                                              stop: data['stop'],
                                              projectName: projectName,
                                              storyName: storyName,
                                              notes: data['notes'],
                                              story: data['story']});
                var newRow = $punchHtml.insertAfter(previousRow).effect("highlight", {}, 1500);
                restripe(headerRow);

                // Reset the form
                resetPunchForm($(form));

                var newDateHeaderCell = headerRow.prev().find('td.dateheader');
                var formattedOldDate = oldDateObject.year + "-" + oldDateObject.month + "-" + oldDateObject.day;
                if (formattedOldDate != data['date']) {
                  updateGreenBar(oldDateHeaderCell.find('.greenbar'), formattedOldDate);
                }
                updateGreenBar(newDateHeaderCell.find('.greenbar'), data['date']);
                $('body').trigger("punchit:punched", data);
              } else {
                alert(data["errors"]);
                displayEditMode(true);
              }
            }
            $punchButton.show();
            $('#punch-msg').remove();
          }
        });
      } else {
        Utils.ajaxRequest({
          method: "POST",
          url: punchesUrl(),
          data: JSON.stringify(aoPunchData),
          onload: function(xhr) {
            var data = JSON.parse(xhr.responseText);

            if (xhr.status == 201) {
              var punchId = data['id'];

              var previousRow = findRowToInsertAfter(headerRow, data['start']);

              var $punchHtml = makePunchRow({id: punchId,
                                            start: data['start'],
                                            stop: data['stop'],
                                            projectName: projectName,
                                            storyName: storyName,
                                            notes: data['notes'],
                                            story: data['story']});
              var newRow = $punchHtml.insertAfter(previousRow).effect("highlight", {}, 1500);

              restripe(headerRow);

              // Reset the form
              $(form).find('input#start').val(data['stop']);
              $(form).find('input#stop').val('');
              $(form).find('textarea#notes').val("");

              updateGreenBar(dateHeaderCell.find(".greenbar"), aoPunchData['date']);
              $('body').trigger("punchit:punched", data);
            } else {
              alert(data["errors"]);
            }

            $punchButton.show();
            $('#punch-msg').remove();
          }
        });
      }
      return false;
    };
    $(document).on('click', 'input#punchit', handlePunchClick);

    PunchVisibility = (function() {
      var setHiddenFlag = function(dateHeaderRow, flag) {
        Utils.setElementData(dateHeaderRow, "hidden", flag);
      };
      var isHidden = function(dateHeaderRow) {
        return Utils.getElementData(dateHeaderRow, "hidden") === true;
      };

      var showElement = function(elem) {
        $(elem).show();
      }

      var hideElement = function(elem) {
        $(elem).hide();
      }

      var changePunchesVisibility = function(dateHeaderRow, hiddenFlag, visibilityChangeFunction) {
        if ($(dateHeaderRow).length == 0) {
          return;
        }

        setHiddenFlag(dateHeaderRow, hiddenFlag);
        var punchRowRegex = /^punch-row-\d+/;
        var detailHeaderRow = $(dateHeaderRow).next('tr.detailheader');
        visibilityChangeFunction(detailHeaderRow);

        var nextRow = $(detailHeaderRow).next();
        while (nextRow && nextRow.length == 1 && nextRow.prop("id").match(punchRowRegex)) {
          visibilityChangeFunction(nextRow);
          nextRow = nextRow.next();
        }
      }

      return {
        show: function(dateHeaderRow) {
          $(dateHeaderRow).find('.collapsed').removeClass('collapsed').addClass('expanded');
          changePunchesVisibility(dateHeaderRow, false, showElement);
        },

        hide: function(dateHeaderRow) {
          $(dateHeaderRow).find('.expanded').removeClass('expanded').addClass('collapsed');
          changePunchesVisibility(dateHeaderRow, true, hideElement);
        },

        toggle: function(dateHeaderRow) {
          if (isHidden(dateHeaderRow)) {
            this.show(dateHeaderRow);
          } else {
            this.hide(dateHeaderRow);
          };
        }
      }
    })();

    // Update all delete links to be better
    $("a[id^=punchDelete]").each(function() {
      var regex = /deletePunch\((\d+)\)/;
      var matches = regex.exec($(this).attr("href"));
      var punchId = matches[1];
      $(this).replaceWith("<a punchid='" + punchId + "' class='delete-link' href='#'>"+deleteIconDiv+"</a>");
    });


    $(document).on('click', ".delete-link", function() {
      var punchId = $(this).attr("punchId");
      deletePunch(punchId);
      return false;
    });

    // Fix up edit links, and add a decent id to each row while we're at it
    // TODO newpunch.php
    $("a[id^=punchEdit]").each(function() {
      var regex = /editPunch\((\d+)\)/;
      var matches = regex.exec($(this).attr("href"));
      var punchId = matches[1];
      $(this).parents("tr:first").attr("id", 'punch-row-' + punchId);
      $(this).replaceWith("<a punchid='" + punchId + "' class='edit-link' href='#'>"+editIconDiv+"</a>");
    });

    $(document).on('click', ".edit-link", function() {
      var punchId = $(this).attr("punchid");
      var punchRow = $(this).parents('tr:first');
      editExistingPunch(punchId, punchRow);
      return false;
    });

    startTextBox().blur(function() {
      var stopBox = stopTextBox();
      var stopVal = stopBox.val();
      var start = parseFloat(startTextBox().val());
      if (!isNaN(start)) {
        var stopBox = stopTextBox();
        if (stopBox.val() == '' || (start > parseFloat(stopBox.val()) && start < 23)) {
        //if ((start > parseFloat(stopVal) && start < 23) || stopVal == "") {
          stopBox.val(start+1);
        }
      }
    });

    // Replace existing date header rows with newer, better ones
    // TODO newpunch.php
    $('td.dateheader').each(function() {
      var dateHash = parseDateFromText($(this).text());
      var $row = $(this).parent();
      $row.next().remove();
      var replacer = function(dateStr, content) {
        $row.replaceWith(content);
      };
      insertNewDateRow(dateHash.year + "-" + pad2(dateHash.month) + "-" + pad2(dateHash.day), replacer);
    });

    var hideAllPunches = function() {
      $('.dateheader-row').each(function(index, $elem) {
        PunchVisibility.hide($elem);
      });
    }

    // Fill in any missing week days before proceeding
    _(DateTime.daysInRange(PunchIt.currentWeek.range).slice(0,5)).chain()
      .filter(function(date) { return date <= DateTime.midnightToday() })
      .each(function(day) {
        var year = 1900 + day.getYear();
        var month = day.getMonth() + 1;
        var day = day.getDate();
        var dateHeaderCell = findDateHeaderCell(year, month, day);
        if (!dateHeaderCell) {
          // Add the new date for punches if not already there
          insertNewDateRow(year + "-" + pad2(month) + "-" + pad2(day));
        }
      });

    hideAllPunches();
    PunchVisibility.show($('.dateheader-row:first'));

    $(document).on('click', '.day-date, .daily-total', function() {
      PunchVisibility.toggle($(this).parents('.dateheader-row'));
    });

    $('body').delegate("input[name='today']", "click", function(e) {
      e.preventDefault();
      populateDateInForm(DateTime.dateObjectToDashString(new Date()))
      return false;
    })
    $("input[name='today']").after($('<a id="not-today" title="This date is not today. Just so you know."/>').hide());

    var updateStoryDropdown = function(projectId, reload) {
      var $select = storyDropdown();


      var renderDropdown = function(stories) {
        var optionHtmlChunks = _.map(stories, function(story) {
          var storyName = story.percent_done == 100 ? "** " + story.name : story.name;
          return '<option value="' + story.id + '">' + storyName + '</option>';
        });
        $select.empty().append(optionHtmlChunks.join("\n"));
        sortDropdown($select);
        $select.prepend('<option value="">Select a Story</option>').val(PunchIt.pendingSelectedStory).change();
        PunchIt.pendingSelectedStory = null;
      };

      var project = PunchIt.activeProjects[projectId];

      $select.empty().append('<option value="">Loading...</option>').trigger("liszt:updated");
      handleStoryChange();
      if (project && project.has_stories) {
        if (PunchIt.projectStories[projectId] && !reload) {
          renderDropdown(PunchIt.projectStories[projectId]);
          $select.trigger("liszt:updated");
          $('body').trigger('punchit:latestStoriesLoaded');
        } else {
          Utils.ajaxRequest({
            method: 'GET',
            url: baseUrl + "/projects/" + projectId + "/phases/" + project.phase.id + "/stories",
            headers: {'range': ''},
            onload: function(xhr) {
              if (xhr.status == 200) {
                var stories = JSON.parse(xhr.responseText);
                PunchIt.projectStories[projectId] = stories;
                renderDropdown(stories);
              } else {
                alert('Unable to load stories for project ' + projectId);
              }
              $select.trigger("liszt:updated");
              $('body').trigger('punchit:latestStoriesLoaded');
            }
          });
        }
      } else {
        $select.empty().append('<option value="">(no stories)</option>').trigger("liszt:updated");
      }
    };

    var projectServiceOptionTemplate = _.template("<option value='<%= projectServiceId %>'><%= serviceDescription %></option>");
    var updateProjectServiceDropdowns = function(projectId) {
      var $select = $('#service-new, #service-edit');
      $select.empty();
      var project = PunchIt.activeProjects[projectId];
      if (project) {
        var optionHtmlChunks = _.map(project.project_services, function(projectService){
          return projectServiceOptionTemplate({projectServiceId: projectService.id, serviceDescription: projectService.description});
        });
        $select.append(optionHtmlChunks.join("\n"));
      }
    };

    /*
    var fixProjectAndStoryDropdownLayout = function() {
      var $projectDropdown = projectDropdown();
      var $projectDropdownRow = $projectDropdown.closest('tr');
      var $allProjectsButton = allProjectsButton().detach();
      $projectDropdown.detach().removeAttr("style").prop("id", 'project-select');
      $projectDropdownRow.empty().addClass("project-form-row").append("<td colspan='100'></td>");
      $projectDropdownRow.find("td").append($projectDropdown).append($allProjectsButton);

      var $storyDropdown = storyDropdown();
      var $storyDropdownRow = $storyDropdown.closest('tr');
      $storyDropdown.detach().removeAttr("style").prop("id", 'story-select');
      var $editStoryButton = editStoryButton().detach();
      var $addStoryButton = addStoryButton().detach();
      var $editStoriesButton = $("<input type='button' id='editStories' value='Edit Stories'/>");
      var $editStoryDiv = $('<div id="edit-story-button-container"></div>');
      $editStoryDiv.append($editStoryButton);
      $editStoryDiv.append("<div id='complete-story-button' style='display: none;' title='Mark story 100% complete'></div>");

      $storyDropdownRow.empty().addClass("story-form-row").append("<td colspan='100'></td>");
      $storyDropdownRow.find("td")
        .append($storyDropdown)
        .append($editStoriesButton)
        .append($addStoryButton)
        .append($editStoryDiv)
        ;
      $projectDropdownRow.append("<div id='reload-projects' class='reload-button'/>");
      $storyDropdownRow.append("<div id='reload-stories' class='reload-button'/>");
    };
    fixProjectAndStoryDropdownLayout();
    */

    var markStoryComplete = function (projectId, storyId, $button) {
      var stories = PunchIt.projectStories[projectId];
      if (stories && !_.isEmpty(stories)) {
        var story = _.detect(stories, function(story) {
          return story.id == storyId;
        });

        var storyData = {
          'id': storyId,
          'percent_done': 100,
        };

        Utils.ajaxRequest({
          method: "PUT",
          url: baseUrl + "/projects/" + projectId + "/stories/" + storyId,
          data: JSON.stringify(storyData),
          onload: function(xhr) {
            var data = JSON.parse(xhr.responseText);

            $button.removeClass("loading");
            if (xhr.status == 200) {
              // TODO: remove the spinner
              story.percent_done = 100;
              PunchIt.pendingSelectedStory = storyId;
              updateStoryDropdown(projectId, false, {selectSameStory: true});
            } else {
              alert(data["errors"]);
            }
          }
        });
      }
    };

    $('#complete-story-button').click(function(event) {
      var projectId = projectDropdown().val();
      var storyId = storyDropdown().val();
      var $button = $(event.target);

      $button.addClass("loading");
      markStoryComplete(projectId, storyId, $button);
    });

    var handleStoryButtonVisibility = function(projectId) {
      var project = PunchIt.activeProjects[projectId];
      if (project && project.has_stories) {
        addStoryButton().show();
        editStoriesButton().attr("style", "display: inline;");
        $("#reload-stories").show();
      } else {
        addStoryButton().hide();
        editStoriesButton().hide();
        $("#reload-stories").hide();
      }
    };

    var updateAddStoryForm = function(projectId) {
      var project = PunchIt.activeProjects[projectId];
      if (project && project.phase && project.phase.id) {
        $('#phase-new').val(project.phase.id);
      } else {
        $('#phase-new').val(1);
      }
    };

    projectDropdown().prop('onchange', '');
    projectDropdown().change(function(e) {
      e.preventDefault();
      var projectId = $(this).find('option:selected').attr("value");
      updateStoryDropdown(projectId);
      updateProjectServiceDropdowns(projectId);
      handleStoryButtonVisibility(projectId);
      updateAddStoryForm(projectId);
      return false;
    });
    handleStoryButtonVisibility();

    $('body').bind('punchit:punched', function(e, punch) {
      var projectId = punch.project.id;
      if (!_.include(PunchIt.recentProjectIds, projectId) && !_.include(PunchIt.frequentlyUsedProjectIds, projectId)) {
        // Remove the project from the 'all projects' list and add to 'recent projects'
        var index = _.indexOf(PunchIt.allOtherProjectIds, projectId);
        if (index != -1) {
          PunchIt.allOtherProjectIds.splice(index, 1);
        }
        PunchIt.recentProjectIds.push(projectId);

        var opts = {
          recentProjectIds: PunchIt.recentProjectIds,
          frequentlyUsedProjectIds: PunchIt.frequentlyUsedProjectIds,
          allOtherProjectIds: PunchIt.allOtherProjectIds,
          showAllProjects: true  // If we are in this if block it must be an "all projects" project
        };
        populateProjectDropdown(opts);
        projectDropdown().val(projectId);
      }
    });

    allProjectsButton().attr("value", "Show All Projects").click(function(e) {
      e.preventDefault();
      // If the button says "Show" when it was clicked the user wants to show all projects
      var wantsToShowAllProjects = $(this).attr("value") == "Show All Projects";
      var opts = {
        recentProjectIds: PunchIt.recentProjectIds,
        frequentlyUsedProjectIds: PunchIt.frequentlyUsedProjectIds,
        allOtherProjectIds: PunchIt.allOtherProjectIds,
        showAllProjects: wantsToShowAllProjects
      };

      if (wantsToShowAllProjects) {
        if (PunchIt.activeProjectsReloaded) {
          $(this).attr("value", "Hide All Projects");
          populateProjectDropdown(opts);
        } else {
          alert("All projects are currently loading in the background. Please wait a moment and click the button again.");
        }
      } else {
        $(this).attr("value", "Show All Projects");
        populateProjectDropdown(opts);
      }
      return false;
    });

    var fillInStoryInfo = function(projectId, storyId) {
      var noStory = function() {
        $("#edit-story").hide();
        $('input#edit-story-button').hide();
        $('#complete-story-button').hide();
      };
      var stories = PunchIt.projectStories[projectId]
      if (stories && !_.isEmpty(stories)) {
        var story = _.detect(stories, function(story) {
          return story.id == storyId;
        });
        if (story) {
          $("#phase-edit").val(story.phase.id);
          $("#loEstimate-edit").val(story.lo_estimate);
          $("#hiEstimate-edit").val(story.hi_estimate);
          $("#name-edit").val(story.name);
          $("#description-edit").val(story.description);
          $("#percentDone-edit").val(story.percent_done);
          $("#editStoryId").value = storyId;
          $("#service-edit").val(story.project_service.id);

          $('input#edit-story-button').show();
          if (story.percent_done < 100) {
            $('#complete-story-button').show();
          } else {
            $('#complete-story-button').hide();
          }
        } else {
          noStory();
        }
      } else {
        noStory();
      }
    };

    var handleStoryChange = function() {
      var storyId = storyDropdown().find('option:selected').attr("value");
      var projectId = projectDropdown().find('option:selected').attr("value");
      fillInStoryInfo(projectId, storyId);
    };

    storyDropdown().prop('onchange', '');
    storyDropdown().change(function(e) {
      e.preventDefault();
      handleStoryChange();
      return false;
    });
    handleStoryChange(); // Initialize story dropdown

    yearDropdown().change(function () {
      checkForToday();
    });

    monthDropdown().change(function() {
      checkForToday();
    });

    dayDropdown().change(function () {
      checkForToday();
    });

    // Check to see if need to indicate that form isn't showing today
    checkForToday();
    setInterval(checkForToday, 1000 * 30);

    // Just in case the page was loaded with a punch id somehow
    if (getIdOfPunchBeingEdited()) {
      displayEditMode(true);
    }

    function autoDecimal(ev) {
      var me = $(this);
      var val = me.val();
      var key2 = 50;
      var key5 = 53;
      var key7 = 55;

      if(this.selectionEnd == this.selectionStart) {
        if (val.indexOf('.') < 0) {
          var len = val.length;
          var key = ev.which;
          if (len == 1 && val != '1') {
            if ((key == key5 || key == key7) || (key == key2 && val != "2")) {
              me.val(val+'.');
            }
          } else if (len == 2) {
            switch(key) {
            case key2:
            case key5:
            case key7:
              me.val(val+'.');
            }
          }
        }
      }
    }

    startTextBox().keypress(autoDecimal);
    stopTextBox().keypress(autoDecimal);

    $(document).keydown(function (e) {
      var $this = $(e.target);

      if ($this.is('textarea')) {
        return;
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if ($this.is("input#punchit, input#start, input#stop")) {
          handlePunchClick();
        }
        return false;
      } else if ($(document.activeElement).is(":input")) {
        // Any other key besides return is not handled
        return;
      }

      switch (e.keyCode) {
        case 192: // `
          if (e.ctrlKey) {
            toggleResizeHandles();
          }
          break;
        case 85: // u
          if (e.ctrlKey) {
            ActionExecutor.undo();
          }
          break
        case 82: // r
          if (e.ctrlKey) {
            ActionExecutor.redo();
          }
          break
      }
    });

    $(".menu").append('<span id="extension-icons"></span>');
    var $extensionIcons = $('#extension-icons');
    
    $('body')
      .append('<div id="cooltip"></div>')
      .append('<div id="dragtip"></div>');

    // vim highlighting cant handle this craziness so need a single quote to fix it: '

    PunchIt.frequentlyUsedProjectLabel = 'Atomic';
    PunchIt.frequentlyUsedProjectIds = [
      1, // "General"
      30, //"Lunch"
      29, //"Personal Time"
      1329, //"Spin Content"
      18, //"Vacation - Paid"
      17, //"Holiday, NOT VACATION"
      255 //"Sick Day
    ];

    var projectOptionTemplate = _.template("<option value='<%= projectId %>'><%= name %></option>");
    var makeProjectOptions = function(projectIds, includeCustomerNameFlag, sortFlag) {
      var idsAndNames = _.map(projectIds, function(projectId) {
        var project = PunchIt.activeProjects[projectId];
        var name = "";
        if (project) {
          var customerName = "";
          if (includeCustomerNameFlag) {
            customerName = project.customer.name + " ";
            if (project.opportunity_identifier) {
              customerName += "Sales: ";
            }
          }
          name = customerName + project.name;
        }
        return [projectId, name];
      });

      if (sortFlag) {
        idsAndNames = _.sortBy(idsAndNames, function(idAndName) {
          return idAndName[1];
        })
      }

      return _.map(idsAndNames, function(idAndName) {
        return projectOptionTemplate({projectId: idAndName[0], name: idAndName[1]});
      });
    };

    var populateProjectDropdown = function(opts) {
      var $projectDropdown = projectDropdown();

      var recentProjectOptions = makeProjectOptions(opts.recentProjectIds, true, true);
      var frequentlyUsedOptions = makeProjectOptions(opts.frequentlyUsedProjectIds)
      var tags = [
        "<optgroup data-type='recent' label='Recent'>",
        recentProjectOptions,
        "</optgroup>",
        "<optgroup data-type='atomic' label='" + PunchIt.frequentlyUsedProjectLabel + "'>",
        frequentlyUsedOptions,
        "</optgroup>"
      ];

      if (opts.showAllProjects) {
        tags.push("<optgroup data-type='all' label='All Projects'>");
        tags.push(makeProjectOptions(opts.allOtherProjectIds, true, true));
        tags.push("</optgroup>");
      }

      $projectDropdown.html(tags.join("\n")).prepend("<option value=''>Select A Project</option>").val('');
      $projectDropdown.trigger("liszt:updated").change();
    };

    var configureProjectDropdown = function(projects, ignoreRecentProjects) {
      if (!ignoreRecentProjects) {
        PunchIt.recentProjectIds = _(projectDropdown().find('option:not(:first)')).chain()
          .map(function(option) {
            return toInt($(option).attr("value"));
          })
          .reject(function(projectId) {
            return _.include(PunchIt.frequentlyUsedProjectIds, projectId);
          })
          .value();
      }

      PunchIt.allOtherProjectIds = _(PunchIt.activeProjects).chain()
        .reject(function(project) {
          return project.opportunity_identifier || _.include(PunchIt.recentProjectIds, project.id) || _.include(PunchIt.frequentlyUsedProjectIds, project.id);
        })
        .pluck('id')
        .value();

      var showAllProjects = allProjectsButton().val() == "Hide All Projects";
      populateProjectDropdown({
        recentProjectIds: PunchIt.recentProjectIds,
        frequentlyUsedProjectIds: PunchIt.frequentlyUsedProjectIds,
        allOtherProjectIds: PunchIt.allOtherProjectIds,
        showAllProjects: showAllProjects
      });
    };

    var loadSomethingFromLocalStorage = function(opts) {
      var initialDataLoaded = false,
          data,
          json,
          delay = 0;

      var dataLoaded = function(data, isFromCache) {
        opts.onDataAvailable(data, isFromCache, function(possiblyProcessedData) {
          if (!initialDataLoaded) {
            initialDataLoaded = true;
            opts.onInitialDataLoaded(possiblyProcessedData);
          }
        });
      };

      var saveAndNotify = function (data) {
        Utils.saveLocal(opts.key, JSON.stringify(data));
        dataLoaded(data, false);
      };

      if (opts.checkCacheFirst) {
        json = Utils.readLocal(opts.key);
        if (json) {
          var data = JSON.parse(json);
          dataLoaded(data, true);
          // WAT delay = Utils.isGreasy() ? 3000 : 1000; // Wait before loading fresh data from the web service
          delay = 2000;
        }
      }
      _.delay(opts.dataLoader, delay, saveAndNotify);
    };

    var sequenceDataRetrieval = function(requests, seedData) {
      var seed = $.Deferred();

      var finalPromise = _.reduce(requests, function(promise, request) {
        var deferred = $.Deferred();
        promise.then(function(input) {
          var urlPromise = request.url(input);
          urlPromise.then(function(url) {
            Utils.ajaxRequest({
              method: 'GET',
              url: url,
              headers: request.headers
            }).done(function(json) {
              var processedData = request.process ? request.process(json, input) : json;
              deferred.resolve(processedData);
            }).fail(function() {
              log('An unexpected error occurred loading: ' + url);
              deferred.reject();
            });
          });
        });
        return deferred.promise();
      }, seed.promise());

      // Kick off the sequence
      seed.resolve(seedData);

      return finalPromise;
    };

    var makeStaticUrlFunction = function(url) {
      return function(input) {
        var deferred = $.Deferred();
        deferred.resolve(url);
        return deferred.promise();
      }
    };

    var lzmaCompress = function(data, callback) {
      // Taken from: http://nmrugg.github.io/LZMA-JS/demos/advanced_demo.html
      var formatAsHex = function(byte_arr) {
        var hex_str = "",
        i,
        len = byte_arr.length,
        tmp_hex;

        for (i = 0; i < len; ++i) {
          if (byte_arr[i] < 0) {
            byte_arr[i] = byte_arr[i] + 256;
          }
          tmp_hex = byte_arr[i].toString(16);

          // Add leading zero.
          if (tmp_hex.length == 1) tmp_hex = "0" + tmp_hex;

          if ((i + 1) % 16 === 0) {
            tmp_hex += "";
            } else {
            tmp_hex += "";
          }

          hex_str += tmp_hex;
        }

        return hex_str.trim();
      };

      lzma.compress(data, 1, function(result) {
        var hex = formatAsHex(result);
        callback(hex);
      });
    };

    var reloadProjects = function(checkCacheFirst) {
      loadSomethingFromLocalStorage({
        checkCacheFirst: checkCacheFirst,
        key: "activeProjects",
        dataLoader: function(callback) {
          // log("Start loading projects " + new Date());
          sequenceDataRetrieval([
            {
              url: makeStaticUrlFunction(baseUrl + "/projects?active=true"),
              headers: {'range': 'properties=personal,billable,name,customer,phase,has_stories,opportunity_identifier'},
              process: function(projects) {
                var context = {};
                context.projects = _.reduce(projects, function(memo, project) {
                  if (project.personal) {
                    project.type = PERSONAL;
                  } else if (project.billable) {
                    project.type = BILLABLE;
                  } else {
                    project.type = NONBILLABLE;
                  }
                  memo[project.id] = project;
                  return memo;
                }, {});
                return context;
              }
            },
            {
              url: makeStaticUrlFunction(baseUrl + "/services"),
              headers: {'range': 'properties=description'},
              process: function(services, context) {
                context.serviceDescriptions = _.reduce(services, function(memo, service) {
                  memo[service.id] = service.description;
                  return memo;
                }, {});
                return context;
              }
            },
            {
              url: function(context) {
                var deferred = $.Deferred();
                var projectIds = _.keys(context.projects);
                lzmaCompress(projectIds.join(","), function(compressed) {
                  var url = baseUrl + "/project_services?project_id=" + compressed;
                  deferred.resolve(url);
                });
                return deferred.promise();
              },
              headers: {'range': 'properties=project,service;lzma=project_id'},
              process: function(projectServices, context) {
                _.each(projectServices, function(projectService) {
                  projectService.description = context.serviceDescriptions[projectService.service.id];
                  var project = context.projects[projectService.project.id];
                  if (_.isArray(project.project_services)) {
                    project.project_services.push(projectService);
                    _.sortBy(project.project_services, function(projectService) {
                      return projectService.service_id;
                    });
                  } else {
                    project.project_services = [projectService]
                  }
                });
                // log("Done loading projects " + new Date());
                return context.projects;
              }
            }
          ]).then(callback)
        },
        onDataAvailable: function(projects, isFromCache, continuationFunc) {
          var customerIds = _(projects).chain()
            .map(function(project, projId) {
              return project.customer.id;
            })
            .uniq().value();

          Utils.ajaxRequest({
            method: "GET",
            url: baseUrl + "/customers?id=" + customerIds.join(","),
            headers: {'range': 'properties=name'},
            onload: function(xhr) {
              if (xhr.status === 200) {
                var customers = JSON.parse(xhr.responseText);
                var customerNames = _.reduce(customers, function(memo, customer) {
                  memo[customer.id] = customer.name;
                  return memo;
                }, {});
                _.each(projects, function(project, projectId) {
                  project.customer.name = customerNames[project.customer.id];
                });
                PunchIt.activeProjects = projects;
                $('body').trigger("punchit:projectsLoaded", projects);
                if (continuationFunc) {
                  continuationFunc(projects);
                }
                if (!isFromCache) {
                  $('body').trigger("punchit:latestProjectsLoaded", projects);
                }
              } else {
                log('An unexpected error occurred loading customer names');
              }
            }
          });
        },
        onInitialDataLoaded: function(projects) {
          loadAllDailyTotals();
          configureProjectDropdown(projects, !checkCacheFirst);
        }
      });
    };
    reloadProjects(true);

    var getPunchType = function(punch) {
      var project = PunchIt.activeProjects[punch.project.id];
      if (project) {
        return project.type;
      } else {
        // TODO: don't know what to return here. Maybe a color indicating unknown?
        //       Maybe make a request to get the specific project so always have
        //       valid data?
        return BILLABLE;
      }
    };

    function calculateWeeklyHoursByDay(week) {
      return _(DateTime.daysInRange(week.range)).chain()
        .filter(function(date) {
          return week.hours[date.toDateString()] ? true : false; // Filter out days with no data
        })
        .map(function(date) {
          return week.hours[date.toDateString()];
        })
        .value();
    }

    function displayWeeklyTotals(week) {
      if (!PunchIt.canDisplayWeeklyTotals) {
        return;
      }
      var weeklyHoursByDay = calculateWeeklyHoursByDay(week);
      var totalHoursForWeek = _.reduce(weeklyHoursByDay, function(total, dayData) { return total + dayData['total'] }, 0.0);
      var billableHoursForWeek = _.reduce(weeklyHoursByDay, function(total, dayData) { return total + dayData['billable'] }, 0.0);
      var percentBillable = Math.round((billableHoursForWeek / totalHoursForWeek) * 100.0);

      var new_kpi = {};
      new_kpi.week_billable = billableHoursForWeek;
      new_kpi.week_total = totalHoursForWeek;
      /*
      [
        {
          week_billable: 0,
          week_total: 0,
          week_billable_avg: 40,
          week_total_avg: 40,
          week_billable_possible: 40
        }, {
          quarter_utilization: 50,
          quarter_co_utilization: 50,
          quarter_utilization_goal: 100
        }
      ]
      */

      // Take the lesser/older of today or the end of the current week
      var today = new Date();
      var endDate = DateTime.backADay(new Date(PunchIt.currentWeek.range[1]));
      if (today < endDate) {
        endDate = today;
      }
      var date = endDate.format(dateFormat.masks.isoDate);
      Utils.ajaxRequest({
        method: "GET",
        url: kpiAPIUrl() + "/employees/" + PunchIt.employeeId + "/" + date,
        onload: function(xhr) {
          if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            new_kpi.week_billable_avg = data['billable_avg'];
            new_kpi.week_total_avg = data['total_avg'];
            new_kpi.quarter_utilization = Math.round(data['utilization'] * 100);
            new_kpi.week_billable_possible = data['billable_possible'];
            Kpi(new_kpi);
          }
        }
      });
      Utils.ajaxRequest({
        method: "GET",
        url: kpiAPIUrl() + "/" + date,
        onload: function(xhr) {
          if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            new_kpi.quarter_co_utilization = Math.round(data['co_utilization'] * 100);
            Kpi(new_kpi);
          }
        }
      });
    }
/*
      //var url = "http://chart.googleapis.com/chart?cht=bhs&chds=0," + HOURS_ON_CHART + "&chs=240x40&chbh=10&chxt=x&chxr=0,0," + HOURS_ON_CHART + ",8&chxtc=0,-30&chxs=0,000000,10,0,t,000000&chco="+BILLABLE+","+GRAVY+",000000&chd=t:" + regularHours + "|" + gravyHours + "|" + theRest;
      var url = "http://chart.googleapis.com/chart?chf=bg,s,"+BGCOLOR+"&cht=bhs&chds=0," + HOURS_ON_CHART + "&chs=240x40&chbh=10&chxt=x&chxr=0,0," + HOURS_ON_CHART + ",8&chxtc=0,-30&chxs=0,000000,10,0,t,000000&chco="+BILLABLE+","+GRAVY+",000000&chd=t:" + regularHours + "|" + gravyHours + "|" + theRest;
      if (gravyHours > 0) {
        url += "&chem=y;s=map_spin;d=0.35,180,"+GRAVY+",11,_,;ds=0;dp=" + GRAVY_LINE + ";py=1;of=1,-25";
      }
      $('<img />')
          .attr('src', url)
          .load(function(){
              $('#' + week.rowId + " td.chart").html( $(this) );
          });

      // Update week start date
      $('#' + week.rowId + " .week-date").text( DateTime.getMonthName(week.range[0]) + " " + week.range[0].getDate() );

      if (totalHoursForWeek > 0) {
        var nonBillableHours = totalHoursForWeek - billableHoursForWeek;
        //var hoursPieUrl = "http://chart.googleapis.com/chart?cht=p&chs=115x50&chd=t:" + billableHoursForWeek + "," + nonBillableHours +
        var hoursPieUrl = "http://chart.googleapis.com/chart?chf=bg,s,"+BGCOLOR+"&cht=p&chs=115x50&chd=t:" + billableHoursForWeek + "," + nonBillableHours +
        "&chco="+BILLABLE+"|"+NONBILLABLE+"&chl=" + billableHoursForWeek + "|" + nonBillableHours;

        var billablePercentString = totalHoursForWeek + "h, " + percentBillable + "%&nbsp;Billable";
        $("<img />")
          .attr('src', hoursPieUrl)
          .load(function() {
            var percentSpan = "<br/><span class='billable-percent'>" + billablePercentString  + "</span>";
            $('#' + week.rowId + " td.hours").html( $(this) ).append(percentSpan);
          })
      } else {
        $('#' + week.rowId + " td.hours").html( "" )
      }
    }



    function displayBillingPeriodTotals(weeks) {
      if (!PunchIt.canDisplayWeeklyTotals) {
        return;
      }

      var totalHours = _(weeks).chain()
        .map(function(week) {
          var weeklyHoursByDay = calculateWeeklyHoursByDay(week);
          var totalHoursForWeek = _.reduce(weeklyHoursByDay, function(total, dayData) { return total + dayData['total'] }, 0.0);
          return totalHoursForWeek;
        })
        .reduce(function(total, hours) { return total + hours }, 0.0)
        .value();
      var billableHours = _(weeks).chain()
        .map(function(week) {
          var weeklyHoursByDay = calculateWeeklyHoursByDay(week);
          var billableHoursForWeek = _.reduce(weeklyHoursByDay, function(total, dayData) { return total + dayData['billable'] }, 0.0);
          return billableHoursForWeek;
        })
        .reduce(function(total, hours) { return total + hours }, 0.0)
        .value();

      if (totalHours > 0) {
        var percentBillable = Math.round((billableHours / totalHours) * 100.0);
        var nonBillableHours = totalHours - billableHours;
      }
    }
*/
    function totalHoursForPunches(punches, type) {
      return _(punches).chain()
        .filter(function(punch) {
          var punchType = getPunchType(punch);
          // If type is specified, must match the type. If no type specified return everything but personal
          return (type && type === punchType) || (!type && punchType !== PERSONAL)
        })
        .map(function(punch) {
          return punch['stop'] - punch['start'];
        })
        .reduce(function(total, hours) { return total + hours }, 0.0)
        .value();
    };

    function updateWeeklyTotals(dateStr, punches) {
      var date = DateTime.parse(dateStr);
      var weekData = PunchIt.currentWeek;

      if (weekData) {
        // Initialize day data to empty hash if not defined
        var dayData = weekData.hours[date.toDateString()] = weekData.hours[date.toDateString()] || {};

        dayData['total'] = totalHoursForPunches(punches, null);
        dayData['billable'] = totalHoursForPunches(punches, BILLABLE);
        dayData['nonbillable'] = totalHoursForPunches(punches, NONBILLABLE);

        displayWeeklyTotals(weekData);
      }
    }

    function abbreviate(text, length) {
      var trimmed = text.replace(/^\s*|\s*$/g,'');
      if (trimmed.length > length) {
        return trimmed.slice(0, length) + "&hellip;";
      } else {
        return trimmed;
      }
    }

    var toggleResizeHandles = (function () {
      var hidden = true;
      return function () {
        hidden = !hidden;
        $('.greenbar').each(function (i, bar) {
          _.each(Utils.getElementData(bar, "resizeHandles"), function (resizeHandle) {
            if (hidden) {
              resizeHandle.hide();
            } else {
              resizeHandle.show().toFront();
            }
          })
        });
      }
    }());

    var GreenbarConstants = (function () {
      var hoursToPixels = 27 * 2;
      return {
        hoursToPixels: hoursToPixels,
        quarterHoursToPixels: hoursToPixels / 4.0,
        greenbarStartTime: 7.0,
        greenbarEndTime: 21.0
      };
    }());

    PunchIt.GreenbarResize = (function() {
      var dragging = false;

      var handleWidth = 6;
      var handleShift = handleWidth;
      var handleHeight = 25;
      var handleY = 0;
      var handleAttrs = {cursor: 'col-resize', opacity: 1, fill: '#f0f0f0', stroke: "#000"};

      var calculateQuarterHoursFromWidth = function (width) {
        return Math.round(width / GreenbarConstants.quarterHoursToPixels);
      };

      var calculateWidthFromQuarterHours = function (quarterHours) {
        return quarterHours * GreenbarConstants.quarterHoursToPixels;
      }

      var calculateEndTime = function (punch, numQuarterHours) {
        return punch.start + (numQuarterHours * 0.25);
      };

      var calculateStartTime = function (punch, numQuarterHours) {
        return punch.stop - (numQuarterHours * 0.25);
      };

      var isPastRightBounds = function (punch, endTime) {
        return (punch.extendRightLimit && endTime > punch.extendRightLimit) ||
                endTime > GreenbarConstants.greenbarEndTime;
      };

      var isPastLeftBounds = function (punch, startTime) {
        return (punch.extendLeftLimit && startTime < punch.extendLeftLimit) ||
               startTime < GreenbarConstants.greenbarStartTime;
      };

      var isLandlockedSmallestPunch = function (punch) {
        return punch.extendLeftLimit === punch.start &&
               punch.extendRightLimit === punch.stop &&
               punch.stop - punch.start === 0.25;
      };

      var moveHandle = function(handle, x, delta, time, resizePunchRects) {
        if (x === handle.attr("x")) {
          return;
        }

        handle.attr({x: x});
        resizePunchRects();
        handle.tooltipLabel.stop().animate({x: x}, 300, "bounce")
        handle.tooltipRect.stop().animate({x: x - 25}, 300, "bounce")
        handle.tooltipLabel.attr({text: time});
      };

      var updatePunch = function(punchId, startTime, stopTime, successCallback) {
        Utils.ajaxRequest({
          method: "PUT",
          url: punchesUrl() + "/" + punchId,
          data: JSON.stringify({'stop': stopTime, 'start': startTime}),
          onload: function(xhr) {
            if (xhr.status === 404) {
              alert('Could not find the punch being edited! (' + punchId + ')');
            }
            else {
              var data = JSON.parse(xhr.responseText);
              if (xhr.status === 200) {
                var $punchRow = $('#punch-row-' + data['id']);
                $punchRow.find('td.punch-stop').text(data['stop']);
                $punchRow.find('td.punch-start').text(data['start']);

                var $headerRow = $punchRow.prevAll('tr.detailheader:first');
                var $dateHeaderCell = $headerRow.prev().find('td.dateheader');

                if ($punchRow.is(":visible")) {
                  $punchRow.effect("highlight", {}, 1500);
                }

                updateGreenBar($dateHeaderCell.find('.greenbar'), data['date']);

                if (successCallback) {
                  successCallback();
                }
              } else {
                alert(data["errors"]);
              }
            }
          }
        });
      };

      var dragStart = function() {
        var handle = this,
          punchRect = handle.punchRect,
          backPunchRect = handle.backPunchRect,
          bar = handle.bar,
          punch = handle.punch;

        // Let the outside world know that dragging is taking place
        dragging = true;

        // store original coordinates
        handle.ox = handle.attr("x");
        handle.oy = handle.attr("y");
        punchRect.ox = punchRect.attr("x");
        punchRect.oldWidth = punchRect.attr("width");
        backPunchRect.oldWidth = backPunchRect.attr("width");

        var top = $(bar).position().top;
        var left = $(bar).position().left;

        // Position a div where the tooltip showing the time the user has dragged to can be displayed
        $('#dragtip').empty().css({top: top - 20, left: left}).show();

        var dragPaper = Raphael('dragtip', 770, 20);
        var rect = dragPaper.rect(handle.ox - 25, 0, 50, 20, 5);
        rect.attr({fill: "#303030", stroke: "#666", "stroke-width": 1, "fill-opacity": .9});
        var label = dragPaper.text(handle.ox, 10, "" + handle.rightSide ? punch.stop : punch.start);
        label.toFront();
        var dragTooltip = dragPaper.set();
        dragTooltip.push(rect, label);
        label.attr({font: '12px Helvetica, Arial', fill: "#fff"});
        handle.tooltip = dragTooltip;
        handle.tooltipLabel = label;
        handle.tooltipRect = rect;
      };

      var dragMove = function(dx, dy) {
        var delta = Math.round(dx / GreenbarConstants.quarterHoursToPixels) * GreenbarConstants.quarterHoursToPixels;
        var quarterHours, x;
        var handle = this;
        var punchRect = handle.punchRect;
        var backPunchRect = handle.backPunchRect;
        var punch = handle.punch;

        if (handle.rightSide) {
          quarterHours = calculateQuarterHoursFromWidth(punchRect.oldWidth + delta);
          var endTime = calculateEndTime(punch, quarterHours);

          if (quarterHours < 1) {
            // Don't allow smaller than a single quarter hour
            quarterHours = 1;

            x = punchRect.ox + GreenbarConstants.quarterHoursToPixels - handleShift;
            delta = x - handle.ox;
            endTime = calculateEndTime(punch, quarterHours);

          } else if (isPastRightBounds(punch, endTime)) {
            endTime = Math.min(punch.extendRightLimit || 1000, GreenbarConstants.greenbarEndTime);
            delta = calculateWidthFromQuarterHours((endTime - punch.stop) * 4);
            x = handle.ox + delta;
          } else {
            x = handle.ox + delta;
          }

          moveHandle(handle, x, delta, endTime, function () {
            punchRect.attr({width: punchRect.oldWidth + delta});
            backPunchRect.attr({width: backPunchRect.oldWidth + delta});
          });

        } else {
          quarterHours = calculateQuarterHoursFromWidth(punchRect.oldWidth - delta);
          var startTime = calculateStartTime(punch, quarterHours);

          if (quarterHours < 1) {
            // Don't allow smaller than a single quarter hour
            quarterHours = 1;
            x = punchRect.ox + punchRect.oldWidth - GreenbarConstants.quarterHoursToPixels - 1; // Why -1? don't know
            delta = x - handle.ox;
            startTime = calculateStartTime(punch, quarterHours);

          } else if (isPastLeftBounds(punch, startTime)) {
            startTime = Math.max(punch.extendLeftLimit || 0, GreenbarConstants.greenbarStartTime);
            delta = calculateWidthFromQuarterHours((punch.start - startTime) * 4) * -1;
            x = handle.ox + delta;

          } else {
            x = handle.ox + delta;
          }

          // NOTE: might have to multiple delta by -1 here!
          moveHandle(handle, x, delta * -1, startTime, function() {
            punchRect.attr({x: x, width: punchRect.oldWidth - delta});
            backPunchRect.attr({x: x, width: backPunchRect.oldWidth - delta});
          });
        }
      };

      var makePunchUpdater = function(punchId, startTime, stopTime) {
        return function(callback) {
          updatePunch(punchId, startTime, stopTime, callback);
        };
      };

      var dragEnd = function() {
        var handle = this,
          punch = handle.punch,
          punchRect = handle.punchRect;

        // Let the outside world know that dragging has ended
        dragging = false;

        handle.tooltip.remove();
        delete handle.tooltip;
        delete handle.tooltipLabel;
        delete handle.tooltipRect;

        $('#dragtip').hide();
        toggleResizeHandles();
        var startTime, stopTime;
        if (handle.rightSide) {
          stopTime = calculateEndTime(punch, calculateQuarterHoursFromWidth(punchRect.attr("width")));
          startTime = punch.start;
        } else {
          startTime = calculateStartTime(punch, calculateQuarterHoursFromWidth(punchRect.attr("width")));
          stopTime = punch.stop;
        }

        ActionExecutor.execute("Punch from " + startTime + " to " + stopTime,
          makePunchUpdater(punch.id, startTime, stopTime),
          makePunchUpdater(punch.id, punch.start, punch.stop)
        );
      };

      return {
        isDragging: function() {
          return dragging;
        },
        registerPunch: function(args) {
          var bar = args.bar,
            punch = args.punch,
            punchRectData = args.punchRectData,
            punchRect = args.punchRect,
            backPunchRect = args.backPunchRect,
            paper = args.paper,
            x = punchRect.attr("x");

          if (punchRectData.c === GAP || isLandlockedSmallestPunch(punch)) {
            return;
          }

          _.defer(function() {
            var dragRightRect = paper.rect(x + punchRectData.w - handleShift, handleY, handleWidth, handleHeight);
            dragRightRect.attr(handleAttrs).hide();
            dragRightRect.rightSide = true;

            var dragLeftRect = paper.rect(x, handleY, handleWidth, handleHeight);
            dragLeftRect.attr(handleAttrs).hide();
            dragLeftRect.leftSide = true;

            Utils.getElementData(bar, "resizeHandles").push(dragRightRect);
            Utils.getElementData(bar, "resizeHandles").push(dragLeftRect);

            var applyDragHandlers = function (handle) {
              handle.punchRect = punchRect;
              handle.backPunchRect = backPunchRect;
              handle.punch = punch;
              handle.bar = bar;

              handle.drag(dragMove, dragStart, dragEnd);
            };

            applyDragHandlers(dragRightRect);
            applyDragHandlers(dragLeftRect);
          });
        }
      };
    }());

    function updateGreenBar(bar, date, callback) {

      // Get the punches for the date
      Utils.ajaxRequest({
        method: "GET",
        url: punchesUrl() + "?date=" + date,
        headers: {'range': 'properties=project,start,stop,story,notes'},
        onload: function(xhr) {
          if (xhr.status !== 200) {
            // Unable to connect to the server (this can happen when laptop first opened), try again
            _.delay(updateGreenBar, 1000, bar, date, callback);
          } else {
            var punches = JSON.parse(xhr.responseText);

            Utils.setElementData(bar, "resizeHandles", []);
            bar.find('svg:first').remove();
            var canvas = bar[0];
            var r=Raphael(canvas, 770, 40);
            var borderLeft = 4;
            var hoursAndColors, tooltip = '';
            r.rect(borderLeft, 12, 756, 4).attr({fill:'#'+GAP, stroke:'none'}); // Red bar


            var hoursAndColors = [];
            if (punches.length == 0) {
              bar.parent().find('.daily-total').text('0h');

              // Add a single gap for the entire day that populates a start time of 8am
              hoursAndColors.push({
                w: GreenbarConstants.greenbarEndTime - GreenbarConstants.greenbarStartTime,
                x: 0,
                c: GAP,
                punch: {start: 8.0, stop: GreenbarConstants.greenbarEndTime},
                startTimeOnly: true
              });

            } else {

              var hoursForPunch = function(punch) {
                var start = punch['start'];
                var stop = punch['stop'];

                return stop - start;
              };

              _.each(punches, function(punch) {
                  if (punch['stop'] > GreenbarConstants.greenbarStartTime && punch['start'] < 21) {
                    hoursAndColors.push({
                        x: punch['start'] - GreenbarConstants.greenbarStartTime,
                        w: hoursForPunch(punch),
                        c: getPunchType(punch),
                        punch: punch
                    });
                  }
              });

              var gaps = [];
              _.reduce(punches, function(punchA, punchB) {
                if (punchA && punchB) {
                  if (punchA.stop != punchB.start && punchA.stop >= GreenbarConstants.greenbarStartTime) {
                    punchA.extendRightLimit = punchB.start;
                    punchB.extendLeftLimit = punchA.stop;
                    gaps.push({
                      x: punchA.stop - GreenbarConstants.greenbarStartTime,
                      w: punchB.start - punchA.stop,
                      c: GAP,
                      punch: {start: punchA.stop, stop: punchB.start}
                    });
                  } else {
                    punchA.extendRightLimit = punchA.stop;
                    punchB.extendLeftLimit = punchB.start;
                  }
                }
                return punchB;
              }, null);

              if (hoursAndColors.length != 0) {
                if (hoursAndColors[0].punch.start > GreenbarConstants.greenbarStartTime) {
                  gaps.unshift({
                    w: hoursAndColors[0].punch.start - GreenbarConstants.greenbarStartTime,
                    x: 0,
                    c: GAP,
                    punch: {start: GreenbarConstants.greenbarStartTime, stop: hoursAndColors[0].punch.start},
                    stopTimeOnly: true
                  });
                }


                var lastPunch = _.last(hoursAndColors).punch;
                if (lastPunch.stop < GreenbarConstants.greenbarEndTime) {
                  gaps.push({
                    w: GreenbarConstants.greenbarEndTime - lastPunch.stop,
                    x: lastPunch.stop - GreenbarConstants.greenbarStartTime,
                    c: GAP,
                    punch: {start: lastPunch.stop, stop: GreenbarConstants.greenbarEndTime},
                    startTimeOnly: true
                  });
                }
              }

              hoursAndColors = _(hoursAndColors).chain()
                .concat(gaps)
                .sort(function(hoursAndColor) {
                  return hoursAndColor.x;
                })
                .value();
              bar.parent().find('.daily-total').text(totalHoursForPunches(punches) + 'h');
            }

            _.each(hoursAndColors, function (punch) {
              punch['w'] *= GreenbarConstants.hoursToPixels;  // hours -> pixels
              var x = punch['x'] * GreenbarConstants.hoursToPixels + borderLeft;
              var backPunchRect = r.rect(x+1, 7, punch['w']-2, 11);
              var punchRect = r.rect(x, 6, punch['w']+1, 13);
              var punchData = punch['punch'];

              PunchIt.GreenbarResize.registerPunch({
                paper: r,
                bar: bar,
                punch: punchData,
                punchRectData: punch,
                punchRect: punchRect,
                backPunchRect: backPunchRect
              });

              if (punch['c'] == GAP) {
                $(punchRect.node).click(
                  function(event) {
                    if (punch.stopTimeOnly) {
                      startTextBox().val("");
                      // if (!Utils.isGreasy()) {
                        startTextBox().focus();
                      // }
                    } else {
                      startTextBox().val(punchData.start);
                    }
                    if (punch.startTimeOnly) {
                      stopTextBox().val("");
                      // if (!Utils.isGreasy()) {
                        stopTextBox().focus();
                      // }
                    } else {
                      stopTextBox().val(punchData.stop);
                    }
                    populateDateInForm(date);

                    return false;
                  }
                );
                $(punchRect.node).hover(
                  function (e) {
                    if (PunchIt.GreenbarResize.isDragging()) {
                      return;
                    }
                    punchRect.attr({fill: '#' + GAP, opacity: 0.4});
                  },
                  function (e) {
                    if (PunchIt.GreenbarResize.isDragging()) {
                      return;
                    }
                    punchRect.attr({fill: '#fff', opacity: 0.1});
                  }
                );
                backPunchRect.attr({stroke: 'none'});
                punchRect.attr({fill: '#fff', stroke: 'none', opacity: 0.1});

              } else {
                backPunchRect.attr({fill:'#fff', stroke:'none'}); // white background for each punch rect
                tooltip = punchData.notes;
                $(punchRect.node).hover(
                  function (e) {
                    if (PunchIt.GreenbarResize.isDragging()) {
                      return;
                    }

                    var rect = $(this);

                    var $punchRow = $('#punch-row-' + punchData['id']);
                    var projectName = $punchRow.find('td.punch-project').text();
                    var storyName = $punchRow.find('td.punch-notes b').text();
                    var $info = bar.parents('tr:first').find('.punch-info');

                    var template = _.template("<span class='times'><%= punchStart %> - <%= punchStop %></span>&nbsp;<span class='project-name'><%= projectName %></span>");
                    var text = template({
                      punchStart: punchData.start,
                      punchStop: punchData.stop,
                      projectName: abbreviate(projectName, 30)
                    });
                    if (storyName) {
                       text += _.template("&nbsp;<span class='story-name'><%= storyName %></span>", {storyName: abbreviate(storyName, 35)});
                    }

                    var top = $info.position().top;
                    var left = $info.position().left;
                    $('#cooltip')
                      .html(text)
                      .css({
                        top: top,
                        left: left + 5
                      })
                      .show();

                    rect.animate({opacity: 0.65}, 250);
                  },
                  function (e) {
                    if (PunchIt.GreenbarResize.isDragging()) {
                      return;
                    }
                    $('#cooltip').hide();
                    $(this).animate({opacity: 1}, 250);
                  }
                );
                $(punchRect.node).click(
                  function(event) {
                    if (event.altKey) {
                      if (event.shiftKey) {
                        deletePunch(punchData['id']);
                      } else {
                        editExistingPunch(punchData['id'], bar.parents('tr:first'));
                      }
                    }
                    setProjectAndStory(punchData);
                    return false;
                  }
                );

                punchRect.attr({fill: '45-#'+punch['c']+':50-#fff:99', stroke:'none', title:tooltip});
              }
            });

            var lbltxt = {class: 'ax'};
            var m = 54, half = 0.0, quarter = 0.0, threeq = 0.0, hour=0.0, startHour = 7;
            for (var i = startHour; i <= 21; i++) {
                hour=m*(i-startHour)+borderLeft;
                r.path('M'+(hour+0.5)+',3L'+(hour+0.5)+',22').attr({stroke: '#000',opacity:0.5, 'stroke-width': 1}).toBack();
                half = Math.round(hour+m/2)+0.5;
                r.path('M'+half+',6L'+half+',23').attr({stroke: '#000', opacity:0.6, 'stroke-width': 1}).toBack();
                quarter = Math.round((hour + half) / 2.0)+0.5;
                threeq = Math.round(half + (half - quarter))+0.5;
                r.path('M'+quarter+',19L'+quarter+',21').attr({class: 'tick'}).toBack();
                r.path('M'+threeq +',19L'+threeq +',21').attr({class: 'tick'}).toBack();
                r.text(hour, 28, i.toString()).attr(lbltxt);
            }

            updateWeeklyTotals(date, punches);

            if (callback) {
              callback();
            }
          }
        }
      });
    }

    var ProjTime = (function() {
      // Will be filled in when the module is initialized
      var PunchIt;

      var print = function(str) {
        $('#projtime-writer').append(str);
      };
      var printTable = function(str) {
        $('#projtime-table-writer').append("<div class='projtime-week'>" + str + "</div>");
      };
      var debug = function(str) {
        log("projtime: " + str);
      };
      var formatDate = function(date) {
        return new Date(date).format('yyyy-mm-dd');
      };
      var formatHours = function(hours) {
        if (hours < 10) {
          return ' ' + hours.toFixed(2);
        } else {
          return hours.toFixed(2);
        }
      };

      var ICONS = {
        clock: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMESURBVDjLXZNrSFNxGMYPgQQRfYv6EgR9kCgKohtFgRAVQUHQh24GQReqhViWlVYbZJlZmZmombfVpJXTdHa3reM8uszmWpqnmQuX5drmLsdjenR7ev9DR3Xgd3h43+d5/pw/HA4AN9zITSPUhJ14R0xn87+h2ZzJvZVInJpzAQOXQOQMt+/5rvhMCLXv9Vjrt1rSXitmwj+Jua1+Ox+2HfGNdGf6yW8l5sUKPNVcRsiaPDA22Ahv6/7Ae/0aKdviQ0G7B/c6f8Zg+gbfh079Mjno0MhS58lflOsgEjh3BXc+bM/0DzbvDwj314znt/bjof0HdPw3FBq6kP+oCxVNfdDZvqPsrQmf6zdFRtyPJgbrFoqUTeS+FnPrekpmiC2lS+QcUx+qrf0wmFzodYfgC0nwhoYh9oegfdmLsmYXHj7JhV23erS7ZNYHyibGLiLtXsO19BoHSiwu6Ok09gwFg/gy8BO/STOkKFBk7EWh2YkLeh5Hy4Ws2B2w157iDvOpxw4UPRPRTSfL41FIsow7ZeXwUFF4dBQ1L96A/xLEFf1HMC/LxAt25PH+VN0HXH1gh2dEwdBoBGO0OKvW4L7hCdIvavBSsMIRVHCi0ArmZZl4wbYrz/yHSq1Ql9vQLylUEoE7GMal3OuxMG/7CO848N6n4HheK5iXZeIFmy88Nu+8aYJG24G3ziB+0Ee7wwqemlvQ5w9hcAJwyUDtpwBOFLeBeVkmXpB0qlK9RV2HlLsCsvUivHRhQwoQjhCkA1TgJX1OK0JVzIN5WSZesPZ44XKia+P5BqSS4aq+BzZXABLdhyQrsJPOqv4MVcEbMA/zsky8gLHyYO7hI9laecOZWuzLfYXU2zzSblmQerMZqjwTknOeY9dlIw5kVcrMG/8XpoQgCEkOhwNNJn5i7bFSrFDpsCrFEIPpLacr0WxpibYIQpS86/8pMBqNswnJ6XSivqHBv3R3pmbxzgwz4Z+EaTXtwqIogrzjxIJ4QVVV1UyihxgjFv3/K09Bu/lEkBgg5rLZH+fT5dvfn7iFAAAAAElFTkSuQmCC'
      };

      var setupOverlay = function() {
        $('#projtime-writer').remove();
        $('body').append('<div class="projtime-dialog overlay projtime-closer"></div>');
        $('body').append('<div id="projtime-writer" class="projtime-dialog"></div>');

        print('<span id="projtime-status">Loading...</p>');
        print('<h2 id="projtime-top-header">Project Hours</h2>');
        print('<div id="projtime-table-writer"></div>');
      };

      var getProjectIds = function(punches) {
        return _(punches).chain()
          .map(function (p) {
            return p.project.id;
          })
          .uniq()
          .value();
      };

      var sortPunches = function(punches, projectIds) {
        var sortedPunches = {};
        _.each(projectIds, function (id) {
          sortedPunches[id] = _(punches).select(function (p) {
            return p.project.id == id;
          });
        });
        return sortedPunches;
      };

      var aggregatePunches = function(punches) {
        return _(punches).reduce(function (sum, punch) {
          return sum + punch.stop - punch.start;
        }, 0);
      };

      var writeProjectData = function(projectIds, projectTimes, weekStart, weekEnd) {
        var caption = weekStart.format(dateFormat.masks.mediumDate) + ' <span class="preposition">to</span> ' + weekEnd.format(dateFormat.masks.mediumDate);
        var output = '<table class="projtime-table"><caption>' + caption + '</caption><tbody>';
        output += '<tr><th width="65" class="hours">Hours</th><th>Project</th></tr>';
        _(projectIds).chain().sortBy(function (id) {
          // Sort by hours spent on project, descending order
          return -projectTimes[id];
        }).each(function (id) {
          var project = PunchIt.activeProjects[id];
          var name;

          if (project) {
            name = project.customer.name + " ";
            if (project.opportunity_identifier) {
              name += "Sales: ";
            }
            name += project.name;
          } else {
            name = "(Project no longer active)";
          }

          if (!project || project.type != PERSONAL) {
            output += '<tr><td class="hours">' + formatHours(projectTimes[id]) + '</td><td>' + name + '</td></tr>';
          }

        }).value();
        output += '</tbody></table>';
        printTable(output);
      };

      var mainGenerator = function(punches,  weekStart, weekEnd) {
        if (_(punches).isEmpty()) {
          return;
        }
        var projectIds = getProjectIds(punches);
        var punchesByProject = sortPunches(punches, projectIds);
        var projectTimes = {};
        _(projectIds).each(function (id) {
          projectTimes[id] = aggregatePunches(punchesByProject[id]);
        });
        writeProjectData(projectIds, projectTimes, weekStart, weekEnd);
      };

      var getOwnProjects = function() {
        var week1Start = PunchIt.weekOne.range[0],
            week1End = DateTime.backADay(PunchIt.weekOne.range[1]), // Want the date to be Sunday instead of Monday at midnight
            week2Start = PunchIt.weekTwo.range[0],
            week2End = DateTime.backADay(PunchIt.weekTwo.range[1]); // Want the date to be Sunday instead of Monday at midnight
        var punchesWeek1Url = baseUrl + '/employees/' + PunchIt.employeeId + '/punches?dateStart=' + formatDate(week1Start) + '&dateEnd=' + formatDate(week1End),
            punchesWeek2Url = baseUrl + '/employees/' + PunchIt.employeeId + '/punches?dateStart=' + formatDate(week2Start) + '&dateEnd=' + formatDate(week2End),
            headers = {'range': 'properties=date,start,stop,project'};

        Utils.getJSON(punchesWeek1Url, function(punches) {
          mainGenerator(punches, week1Start, week1End);

          // Retrieve (and then display) the second week of the period
          Utils.getJSON(punchesWeek2Url, function(punches) {
            mainGenerator(punches, week2Start, week2End);
            $('#projtime-status').hide();
          }, headers);

        }, headers);
      };

      var start = function() {
        var $dialog = $('.projtime-dialog');
        if ($dialog.length > 0) {
          $dialog.remove();
        }
        setupOverlay();
        getOwnProjects();
      };

      return {
        // punchitData == PunchIt data structure
        initialize: function(punchItData, $iconContainer) {
          PunchIt = punchItData;
          $iconContainer.append('<img id="projtime" src="' + ICONS.clock + '" alt="Project time"/>');
          $(document).on('click', '#projtime', start);
          $(document).on('click', '.projtime-closer', function () {
            $('.projtime-dialog').hide();
          });

          this.initialized = true;
        },

        initialized: false
      };
    })();

    $('body').bind('punchit:projectsLoaded', function(e, projects) {
      if (!ProjTime.initialized) {
        ProjTime.initialize(PunchIt, $extensionIcons)
      }
    });

    var WatchIt = (function() {
      var employeeData = {};
      var numberOfEmployees;
      var numberLoaded;

      var print = function (str) {
        $('#watchit-writer-integrated').append(str);
      };
      var debug = function (str) {
        log("WatchIt: " + str);
      };
      // var getJSON = function(url, callback, headers) {
      //   var args = {method: 'GET', url: url, headers: headers};
      //   return Utils.ajaxRequest(args).pipe(callback);
      // };
      var formatDate = function(date) {
        return new Date(date).format('yyyy-mm-dd');
      };
      var ICONS = {
        no_punches: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==',
        gap: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIpSURBVDjLpZP7T1JhGMfPn9RaznVZa7Zhl1WoOI1ZtNlmq5Wrma1jMTSG5li1ahWSFJKmjuhEYzVJCDGQUNJI7WYX7ALnhFwiKFvn2zkHKw6d33y27y/v830+++5535cAQCxHhN7+AR23I9Ba30EzMIeTva9BWl4+ljJbRhLqHk9i/trDOLpdDLoeMCAyuZ8oVtP1WVYKYPYsfCv2Eqd9bdB61dB4SJxwNQuHjcZnkAKY3F+Efu/0VZjDV9A9eVFoiIo37L88JQkwDjNCv7CIPm8MheINey+ERIC6/kpFtXkbdhjKUdtVIfITVn9URGRSOajOBv8ClH1yRZVpK9s63IL2kVbIz20RBvkaGI3mAVQgBmosCsd4FG8+p7Gzc0wA1Fi2KyqMm1nyfhNqjHKsP1WKct1GDPpisPLy0/8nePUxhWqdD1xkJReZbXY0oqxjLbtOU7JJf2ceqewibAFa8FKBJYCQgktg49Rg3QMuMupv1uGw/QA26Faza9SrZHyidtt7JDOLsAdp3B3Pixh6QiOd/bdZVY8SGjeJg1QDH5ktbVkp+7OPtsG3SHz9gXuhfALnJPeQHBM0ClVrqOIjg4uMkuMrZIW3oe6fEwBD3KBzScQtPy3awfNIEiq9T/IdkDdeYIEDuJ4ygtcd5gD8QLF2dT76JQU4ap5FPP0ddDKHT/EsInQGRKXWi2KVHXNSUoAjppnRQ4ZwZt+lKdSfD2H3meDyvjKv3+cfGcwF4FggAAAAAElFTkSuQmCC',
        low_hours: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAENSURBVDjLpZM/SwNREMTnxBRpFYmctaKCfwrBSCrRLuL3iEW6+EEUG8XvIVjYWNgJdhFjIXamv3s7u/ssrtO7hFy2fcOPmd03SYwR88xi1cPgpRdjjDB1mBquju+TMt1CFcDd0V7q4GilAwpnd2A0qCvcHRSdHUBqAYgOyaUGIBQAc4fkNSJIIGgGj4ZQx4EEAY3waPUiSC5FhLoOQkbQCJvioPQfnN2ctpuNJugKNUWYsMR/gO71yYPk8tRaboGmoCvS1RQ7/c1sq7f+OBUQcjkPGb9+xmOoF6ckCQb9pmj3rz6pKtPB5e5rmq7tmxk+hqO34e1or0yXTGrj9sXGs1Ib73efh1WaZN46/wI8JLfHaN24FwAAAABJRU5ErkJggg==',
        eye: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKASURBVDjLxVNLTxNRFP7udDp9TCEtFSzloUBwY4FUF0ZjVDYsTDSw0/gjXBii/gk2GjZudO1G4wONK40CGkQSRKTybqGAfVHa6dy5M/d6WwMhccnCk3yLk3u+L9+55xwihMBRQsERQz2crK+vX3Txyn1SyfXDMnyE24AjwR0Q4qLQw1M82H4vGo1+3OeQ/RZSqdQTV2XnhkKzmqaoYJaJQj4P27LgcQGNdTocRmFzyWiJv2zqil0/EJDkt67C0oAGhtTmJpLpHEwSAPNEwBwCy+bQ7W1EsYlYWxiKdMSjvbPhniu96tra2ohmbAxovILZxCq0E5dh6M1g0jllAqYEZRw7lhRp1ZDdewW9tILAykRPingfk9Ti7BbJJ47viiC645cwNm2gYPAaefhWH4TgGB79JoU4vG6Cu0MNyMx/Bv8+hkzJtlWWW27yRfrQ0dhS+4sq0aAOqHQgOK8JGJbMKZf9/h1asPssyv56sBejqupuinEtEHI5jgNFURCuA5JZB6a0fPvBF1BLClbsmoPT7X5wKVqrbWhFqDMmFFHcKLLiNmzbBmMM7WEFAY2jbDCUJbFsMpQkjgUI4ifVWk21lqaXoBQ2mMJ94adi6wes5AxoMYOw7uBcl4JTEQFVULhhId5GcO2MJtuUEykXQRc+gb1/hLTl/VobY2JmctyfnTvvUwlEqCMPvdGEHrKgevj+wlTrxO8VL1+ebLaSc1gwA2kj9bPlYJGmPrx7bm0lrkbIrhrwewFPPbjbj+pzdSPtUh7YXsRqpiT2gp1T9NfEhcGR1zY5fEzjo3c8ud3SIKV0SJrp1wgCLjiS7/CKaU5LPCOcj918+Gb+n1X+b9f4B22tbKhgZZpBAAAAAElFTkSuQmCC',
        refresh: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oGFg8TEhxJH+0AAAJvSURBVDjLjZNNSJRRFIbf+fzSlNSMRKFGqDRdOZSLaNtGKETEhIqQWgVRGERpUIHEQD8ERn9ERlAgCE3hIhmZhVRUWgmNQmCNJQ5FoEyOc7/7f7/bIkb8GcgDZ3PPuQ8v55wX1lr8L2sffuzaceNVXq6agzWETJEjIuM9yFULWGsBAG2xeJAqtFKOxgXpNHBPlsuMhCIMW0rKQLiD5GT8VupR+5lVgJZYfC9Tgc5aaZpLCopQuL4ATgDQxofSBtpoCKnw4kMavydHwl7k3MUswG0ajAepQueefLd5c/kmeEzAWguhNJQx/wC+hvAtNCHQkucvVeASjtadxm/eWLoBnGtQITGcEPg+lYD2KIzwUFZZA80lZhOjd0S0+/wyQIo7jcUFATAp4FGBp++mZrRHn83ePXw221R44Mq4b/iYiIZPrxyiy+fprueECeUxX6UZ04I+mbt/9NLSJi15PxS/GuqbOC6ogJ6nUB6D9DhckfIuKMGg0mxRcvub8TyhbFf/vlAYAFQsHAaA2nuj2xVhJ5XHClWaOVrQ+cU1Lo22WPwxVWh4uT9Un32r6Xl/UxF28FB9ZZW7zsHXJMXQ69Gou/JzSyx+u1r6x7gCQn0TNiu5qqgEu+uKkecGII3G5xkKzcjQMkDTYPx6tfJPBSsroLWPYPYOdCmUMcgwBqsMhr8F8HPi7YD2ZWQZgHDIBQ0wrmC0hfINlDHQWiNDBCZTAfyYnsOvLyMDvpbXRLQ7uWoGdb2ferbZvA4iHCRmpqE9CkUFfEFmjWBjPudDvuEREQ0nASCn+7ZeHuyt6IiMr8WpOd0o/ngnZIb0rcWpfwGx19+bhirHDQAAAABJRU5ErkJggg=='
      };

      var displayGreenBarReport = function(employee, sortedPunches) {
        var RED = "E13F1A",
          GREEN = "33CC33",
          DAY_START = 7.0,
          DAY_END = 21.0;
        var time = DAY_START;
        var colors = [];
        var sections = [];
        _.each(sortedPunches, function (punch) {
          // Fill in the time up to the next punch in red
          var len = punch.start - time;
          if (punch.start >= DAY_END) {
            colors[colors.length] = RED;
            sections[sections.length] = DAY_END - time;

          } else if (len > 0) {
            colors[colors.length] = RED;
            sections[sections.length] = len;
          } else if (punch.start <= DAY_START && punch.stop <= DAY_START) {
            return;
          }

          // Fill in the time up to the end of this punch in green
          len = punch.stop - Math.max(punch.start, DAY_START);
          if (punch.stop >= DAY_END) {
            colors[colors.length] = GREEN;
            sections[sections.length] = DAY_END - punch.start;
          } else if (len > 0) {
            colors[colors.length] = GREEN;
            sections[sections.length] = len;
          }

          // Move the time forward for the next punch
          time = punch.stop;
        });

        // Fill in everything after the last punch in red
        if (time < DAY_END) {
          colors[colors.length] = RED;
          sections[sections.length] = DAY_END - time;
        }
        var colorString = colors.join(',');
        var punchString = sections.join('|');

        return 'http://chart.googleapis.com/chart?cht=bhs&chds=0,14&chs=770x40&chbh=10&chxt=x,x&chxr=0,7,21,1|1,7,21,0.5&chxtc=0,-30|1,-30&chxs=0,000000,12,0,t,000000|1,000000,0,0,t,000000&chco='+ colorString +'&chd=t:' + punchString;
      };

      var selectPunchesByDay = function(punches, day) {
        return _(punches).chain()
          .select(function (punch) {
            return punch.date == day;
          })
          .sortBy(function (punch) {
            return punch.start;
          })
          .value();
      };

      var WATCHIT_PROBLEM_TEMPLATE = _.template('<div class="watchit-problem-integrated"><img class="watchit-icon" src="<%= pngData %>" /><span class="watchit-problem-date-integrated"><%= formattedDay %></span>: <span><%= issue %></span><img class="greenbar-report hidden-image" src="<%= greenbarURL %>" /></div>');

      var createGreenBarReport = function(employeeId, issue, day, pngData) {
        var employee = employeeData[employeeId].employee;
        var punches = employeeData[employeeId].punches;
        var greenbarURL = displayGreenBarReport(employee, selectPunchesByDay(punches, formatDate(day)));
        var formattedDay = day.format('ddd mm/dd/yyyy');

        return WATCHIT_PROBLEM_TEMPLATE({
          pngData: pngData,
          formattedDay: day.format('ddd mm/dd/yyyy'),
          issue: issue,
          greenbarURL: displayGreenBarReport(employee, selectPunchesByDay(punches, formatDate(day)))
        });
      };

      var writeName = function(name) {
        return name.replace(/(\w+),\s*(\w+)/, '$2 $1');
      };
      var warnNoPunches = function(name, dateString) {
        return ' no punches';
      };
      var warnGaps = function(name, dateString, gapStart, gapEnd) {
        return ' gap at [' + gapStart + ' - ' + gapEnd + ']';
      };
      var warnLowHours = function(name, dateString, hoursPunched) {
        return ' low hours (' + hoursPunched + ' is < 7)';
      };

      var printValidationOutput = function(id, nameString, issues, indexValue) {
        var output = '<div class="watchit-link-container-integrated" id="watchit-link-' + id + '">';
        output += '<h3 class="watchit-link-integrated">' + nameString + '<span class="watchit-link-id-integrated">' + id + '</span></h3>';
        _.each(issues, function (issue) {
          output += createGreenBarReport(id, issue.issue, issue.day, issue.type);
        });
        output += '<span class="watchit-sorter-integrated">' + indexValue + '</span></div>';
        print(output);

        var elements = $('#watchit-writer-integrated').find('.watchit-link-container-integrated').get();
        _(elements).chain()
          .sortBy(function (wlContainer) {
            return $(wlContainer).find('.watchit-sorter-integrated').text().toLowerCase();
          })
          .each(function (wlContainer) {
            // Sort in place by last name
            $('#watchit-writer-integrated').append($(wlContainer));

            // Remove duplicate greenbars
            var $problems = $(wlContainer).find('.watchit-problem-integrated');
            $.each($problems, function (index, problem) {
              if ($(problem).find('img.greenbar-report').length <= 0) {
                return;
              }
              var date = $(problem).find('.watchit-problem-date-integrated').text();
              var sameDayProblems = $problems.filter(function () {
                return $(this).find('.watchit-problem-date-integrated').text() == date;
              });
              sameDayProblems.not(':last').find('img.greenbar-report').remove();
            });
          });
      };

      var statusCallback = function() {
        numberLoaded++;
        $('#watchit-status-integrated').text('Loading... ' + numberLoaded + ' of ' + numberOfEmployees + ' done.');
        if (numberLoaded >= numberOfEmployees) {
          // Can't refresh until done loading
          var refreshButton = $('#watchit-refresh-integrated');
          refreshButton.addClass('clickable');
          refreshButton.click(refresh);

          setTimeout(function () {
            if ($('#watchit-writer-integrated').find('.watchit-link-container-integrated').length <= 0) {
              $('#watchit-status-integrated').text('No one seems to be missing punches.');
            } else {
              $('#watchit-status-integrated').hide();
            }
          }, 1000);
        }
      };

      var setupOverlay = function() {
        $('#watchit-writer-integrated').remove();
        $('body').append('<div class="watchit-dialog-integrated overlay watchit-closer-integrated"></div>');
        $('body').append('<div id="watchit-writer-integrated" class="watchit-dialog-integrated"></div>');
        $('.watchit-closer-integrated').click(function () {
          $('.watchit-dialog-integrated').hide();
        });

        print('<span id="watchit-status-integrated">Loading...</p>');
        print('<img id="watchit-refresh-integrated" src="' + ICONS.refresh + '" />');
        print('<h2 id="watchit-top-header-integrated">Missing Punches</h2>');
      };

      var toggleGreenBarImage = function() {
        var greenbar = $(this).siblings().find('.greenbar-report');
        greenbar.toggleClass('hidden-image');
      };

      var getPunchData = function(employee) {
        var punchURL = baseUrl + employee.punches.$ref;
        var dateStart = PERIOD_DATE_RANGE[0];
        var dateEnd = PERIOD_DATE_RANGE[1];
        Utils.getJSON(punchURL + '?dateStart=' + dateStart.format("yyyy-mm-dd") + '&dateEnd=' + dateEnd.format("yyyy-mm-dd"), function (punches) {
          employeeData[employee.id] = {'employee': employee, 'punches': punches};
          validatePunches(employee, punches);
        }, {'range': 'properties=date,start,stop'});
      };

      var getEmployeeDataFromURL = function(employeeURL) {
        Utils.getJSON(employeeURL + '?full_time=true&active=true', function (employees) {
          numberOfEmployees = employees.length;
          _.each(employees, getPunchData);
        }, {range: 'properties=id,punches,name', order: 'name.asc'});
      };

      var getEmployeeURL = function() {
        Utils.getJSON(baseUrl, function (resources) {
          getEmployeeDataFromURL(baseUrl + resources.employees.$ref);
        });
      };

      var getTargetDates = function(raw) {
        var today = DateTime.midnightToday();

        return _(DateTime.daysInRange(PERIOD_DATE_RANGE)).chain()
          .reject(function (date) {
            return date >= today || date.getDay() === 0 || date.getDay() === 6;
          })
          .map(function (date) {
            return raw ? date : formatDate(day);
          })
          .reverse()
          .value();
      };

      var validatePunches = function(employee, punches) {
        var targetDays,
          i, j,
          sortedPunches,
          hoursPunched,
          problems = false,
          issues = [];
        // Get the days to analyze
        targetDays = getTargetDates(true);
        _.each(targetDays, function (day) {
          var formattedDay = formatDate(day);

          var lastPunchedTime = false;
          sortedPunches = selectPunchesByDay(punches, formattedDay);
          // Warn about days with no punches at all
          if (sortedPunches.length == 0) {
            issues[issues.length] = {'type': ICONS.no_punches, day: day, issue: warnNoPunches(employee.name, formattedDay)};
            problems = true;
          }
          else {
            // Warn about gaps between punches in a day, only looking at punches between 7:00 AM and 7:00 PM
            _.each(sortedPunches, function (punch) {

              if(lastPunchedTime && punch.start != lastPunchedTime && punch.start < 19) {
                issues[issues.length] = {'type': ICONS.gap, day: day, issue: warnGaps(employee.name, formattedDay, lastPunchedTime, punch.start)};
                problems = true;
                lastPunchedTime = punch.stop;

              } else if (punch.stop >= 7 && punch.start < 19 && punch.start >= 7) {
                lastPunchedTime = punch.stop;
              }
            });
            hoursPunched = _.reduce(sortedPunches, function (sum, punch) {
              return sum + punch.stop - punch.start;
            }, 0);

            // Warn about days with less than 7 hours punched
            if (hoursPunched < 7) {
              issues[issues.length] = {'type': ICONS.low_hours, day: day, issue: warnLowHours(employee.name, formattedDay, hoursPunched)};
              problems = true;
            }
          }
        });
        if (problems) {
          var lastName = employee.name.match(/^(\w+)/)[1];
          printValidationOutput(employee.id, writeName(employee.name), issues, lastName);
        }
        statusCallback();
      };

      var run = function(reload) {
        var $dialog = $('.watchit-dialog-integrated');
        if (reload || $dialog.length <= 0) {
          $dialog.remove();
          numberLoaded = 0;
          setupOverlay();
          getEmployeeURL();
        } else {
          $dialog.show();
        }
      }

      var refresh = function() {
        run(true);
      };

      var start = function() {
        run(true);
      };

      // var watchitContainer = $('img[src="images/timeclock-100.png"]').parent();
      $extensionIcons.append('<img id="watchit-integrated" src="' + ICONS.eye + '" alt="Missing punches"/>');
      $('#watchit-integrated').click(start);
      $(document).on('click', '.watchit-link-integrated', toggleGreenBarImage);
      $('#watchit').remove();
    }());

    var Kpi = (function() {
      var KPI, graphs_in_header, kpi_graphs, label, rect, update_for, update_kpi_with;
      label = function(node, attrs) {
        return node.append('text').attr('class', attrs["class"]).attr('y', attrs.y).attr('x', attrs.x).text(typeof attrs.text === 'function' ? attrs.text : (function(d) {
          return d[attrs.text];
        }));
      };
      rect = function(node, attrs) {
        var anode;
        anode = node.append('rect').attr('class', attrs["class"]);
        if (attrs.bounds != null) {
          anode.attr('x', attrs.bounds[0]).attr('y', attrs.bounds[1]).attr('width', attrs.bounds[2]).attr('height', attrs.bounds[3]);
        } else {
          if (attrs.x != null) anode.attr('x', attrs.x);
          if (attrs.y != null) anode.attr('y', attrs.y);
          if (attrs.width != null) anode.attr('width', attrs.width);
          if (attrs.height != null) anode.attr('height', attrs.height);
        }
        if (attrs.title != null) anode.append('title').text(attrs.title);
        return anode;
      };
      kpi_graphs = function(home) {
        var draw_graphs;
        return draw_graphs = function(kpi_inputs) {
          var QUARTER, WEEK, adjust_quarter_graph_for, adjust_week_graph_for, dims, graph_inputs, graphs, hrs_scale, kpi_labels, q_inputs, quarter, quarter_axis, right_padding, ulz_scale, vis, week, week_axis, _base;
          kpi_labels = [
            {
              label: 'Hours',
              label_line2: 'this week',
              id: 'week',
              week_billable_label: 'billable',
              week_total_label: 'total'
            }, {
              id: 'quarter',
              label_line2: 'this quarter',
              label: 'Utilization'
            }
          ];
          WEEK = 0;
          QUARTER = 1;
          graph_inputs = [];
          $.each(kpi_inputs, function(i, k) {
            return graph_inputs.push($.extend({}, k, kpi_labels[i]));
          });
          dims = {
            graph_padding: 10,
            label_padding: 4,
            numeric_padding: 12,
            graph_height: 24,
            intergraph_padding: 60,
            hours_max: 40,
            utilization_max: 100,
            graph_width: 280
          };
          dims.graph_unit_height = dims.graph_height / 3;
          hrs_scale = d3.scale.linear().domain([0, dims.hours_max]).range([0, dims.graph_width]);
          ulz_scale = d3.scale.linear().domain([0, dims.utilization_max]).range([0, dims.graph_width]);
          week_axis = d3.svg.axis().scale(hrs_scale).orient('bottom').tickValues([0, 8, 16, 24, 32, 40]).tickSubdivide(1);
          quarter_axis = d3.svg.axis().scale(ulz_scale).orient('bottom').tickValues([0, 25, 50, 75, 100]);
          vis = d3.select(home).append('svg').attr('width', 620).attr('height', 115).attr('id', 'kpi').attr('shape-rendering', 'crisp-edges');
          $('svg#kpi').append("<defs>                    <style type='text/css'>                      <![CDATA[                        @font-face {                        font-family: DINOT-Light;                        src: url('css/DINOT.woff');                        }                      ]]>                    </style>                  </defs>");
          graphs = vis.append('g').selectAll('g.bullet-graph').data(graph_inputs).enter().append('g').attr('class', 'bullet-graph');
          graphs.append('g').attr('class', function(d) {
            return d.id;
          });
          week = graphs.select('g.week');
          label(week, {
            "class": 'label',
            y: dims.graph_height / 2,
            x: -dims.label_padding,
            text: 'label'
          });
          label(week, {
            "class": 'small-label',
            y: dims.graph_height,
            x: -dims.label_padding,
            text: 'label_line2'
          });
          rect(week, {
            "class": 'week-total-avg',
            bounds: [
              0, 0, (function(d) {
                return hrs_scale(d.week_total_avg);
              }), dims.graph_height
            ],
            title: '12-week average of total hours per week'
          });
          rect(week, {
            "class": 'week-billable-avg',
            height: dims.graph_height,
            title: '12-week average of billable hours per week'
          });
          rect(week, {
            "class": 'week-total',
            bounds: [
              0, dims.graph_unit_height, (function(d) {
                return hrs_scale(d.week_total);
              }), dims.graph_unit_height
            ],
            title: 'Total hours punched this week'
          });
          rect(week, {
            "class": 'week-billable',
            bounds: [
              0, dims.graph_unit_height, (function(d) {
                return hrs_scale(d.week_billable);
              }), dims.graph_unit_height
            ],
            title: 'Billable hours punched this week'
          });
          rect(week, {
            "class": 'week-target',
            bounds: [
              (function(d) {
                return hrs_scale(d.week_billable_possible);
              }), dims.graph_unit_height / 2, 2, dims.graph_height - dims.graph_unit_height
            ],
            title: 'Billable hours possible this week'
          });
          label(week, {
            "class": 'numeric-label billable',
            y: dims.graph_height / 2 + 3
          }).attr('dy', '0.20em');
          label(week, {
            "class": 'numeric-label total',
            y: dims.graph_height / 2 + 3
          }).attr('dy', '0.20em');
          label(week, {
            "class": 'small-label legend billable',
            y: dims.graph_height + 18,
            text: 'week_billable_label'
          });
          label(week, {
            "class": 'small-label legend total',
            y: dims.graph_height + 18,
            text: 'week_total_label'
          });
          adjust_week_graph_for = function(t) {
            var after_billable, scaled_max_x;
            t.select('.week-billable').attr('width', function(d) {
              return hrs_scale(d.week_billable);
            });
            t.select('.week-total').attr('width', function(d) {
              return hrs_scale(d.week_total);
            });
            t.select('.week-billable-avg').attr('width', function(d) {
              return hrs_scale(d.week_billable_avg) + 1;
            });
            t.select('.week-total-avg').attr('width', function(d) {
              return hrs_scale(d.week_total_avg) + 1;
            });
            t.select('.week-target').attr('x', function(d) {
              return hrs_scale(d.week_billable_possible);
            });
            scaled_max_x = function(d) {
              var n, x, _i, _len, _ref;
              x = 0;
              _ref = [d.week_total_avg, d.week_billable, d.week_total, d.week_billable_avg, d.week_billable_possible];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                n = _ref[_i];
                if (n > x) x = n;
              }
              return hrs_scale(x);
            };
            after_billable = function(d) {
              var _base, _base2;
              return dims.numeric_padding * 2 + scaled_max_x(d) + Math.max(typeof (_base = $('text.legend.billable')[0]).getComputedTextLength === "function" ? _base.getComputedTextLength() : void 0, typeof (_base2 = $('text.billable.numeric-label')[0]).getComputedTextLength === "function" ? _base2.getComputedTextLength() : void 0);
            };
            t.select('text.billable.numeric-label').text(function(d) {
              return d.week_billable;
            });
            t.select('text.total.numeric-label').text(function(d) {
              return d.week_total;
            });
            t.selectAll('text.billable').attr('x', function(d) {
              return scaled_max_x(d) + dims.numeric_padding;
            });
            return t.selectAll('text.total').attr('x', after_billable);
          };
          adjust_week_graph_for(week);
          week.append('g').attr('class', 'axis').attr('transform', "translate(0," + dims.graph_height + ")").call(week_axis);
          kpi_inputs[WEEK].recalc_graph = function() {
            var metric, _i, _len, _ref;
            _ref = ['week_billable', 'week_total', 'week_billable_avg', 'week_total_avg', 'week_billable_possible'];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              metric = _ref[_i];
              graph_inputs[WEEK][metric] = kpi_inputs[WEEK][metric];
            }
            return adjust_week_graph_for(week.transition());
          };
          quarter = graphs.selectAll('g.quarter').attr('transform', "translate(0, " + dims.intergraph_padding + ")");
          label(quarter, {
            "class": 'label utilization',
            y: dims.graph_height / 2,
            x: -dims.label_padding,
            text: 'label'
          });
          label(quarter, {
            "class": 'small-label',
            y: dims.graph_height,
            x: -dims.label_padding,
            text: 'label_line2'
          });
          rect(quarter, {
            "class": 'quarter-utilization-goal',
            height: dims.graph_height,
            width: function(d) {
              return ulz_scale(d.quarter_utilization_goal);
            }
          });
          rect(quarter, {
            "class": 'quarter-co-utilization',
            height: dims.graph_height,
            title: 'Company-wide utilization this quarter'
          });
          rect(quarter, {
            "class": 'quarter-utilization',
            height: dims.graph_unit_height,
            y: dims.graph_unit_height,
            title: 'Utilization this quarter'
          });
          label(quarter, {
            "class": 'numeric-label utilization',
            y: dims.graph_height / 2 + 3
          }).attr('dy', '0.20em');
          adjust_quarter_graph_for = function(t) {
            var max_x;
            max_x = function(d) {
              return Math.max(d.quarter_utilization, Math.max(d.quarter_utilization_goal, d.quarter_co_utilization));
            };
            t.select('text.utilization.numeric-label').attr('x', function(d) {
              return ulz_scale(max_x(d)) + dims.numeric_padding;
            });
            t.select('.quarter-utilization').attr('width', function(d) {
              return ulz_scale(d.quarter_utilization);
            });
            t.select('.quarter-co-utilization').attr('width', function(d) {
              return ulz_scale(d.quarter_co_utilization);
            });
            return t.selectAll('text.numeric-label.utilization').text(function(d) {
              return "" + d.quarter_utilization + "%";
            });
          };
          adjust_quarter_graph_for(quarter);
          quarter.append('g').attr('class', 'axis').attr('transform', "translate(0," + dims.graph_height + ")").call(quarter_axis);
          right_padding = dims.graph_padding + parseInt(typeof (_base = $('text.label.utilization')[0]).getComputedTextLength === "function" ? _base.getComputedTextLength() : void 0);
          graphs.attr('transform', "translate(" + right_padding + "," + dims.graph_padding + ")");
          q_inputs = kpi_inputs[QUARTER];
          q_inputs.recalc_graph = function() {
            graph_inputs[QUARTER].quarter_utilization = q_inputs.quarter_utilization;
            graph_inputs[QUARTER].quarter_co_utilization = q_inputs.quarter_co_utilization;
            return adjust_quarter_graph_for(quarter.transition());
          };
          return kpi_inputs;
        };
      };
      graphs_in_header = kpi_graphs('div.header');
      KPI = graphs_in_header([
        {
          week_billable: 0,
          week_total: 0,
          week_billable_avg: 0,
          week_total_avg: 40,
          week_billable_possible: 40
        }, {
          quarter_utilization: 0,
          quarter_co_utilization: 0,
          quarter_utilization_goal: 100
        }
      ]);
      update_for = function(x) {
        return function(new_vals) {
          var k, p, v, _results;
          _results = [];
          for (k in new_vals) {
            v = new_vals[k];
            _results.push((function() {
              var _i, _len, _results2;
              _results2 = [];
              for (_i = 0, _len = x.length; _i < _len; _i++) {
                p = x[_i];
                if (!(p != null)) continue;
                p[k] = v;
                _results2.push(p.recalc_graph());
              }
              return _results2;
            })());
          }
          return _results;
        };
      };
      update_kpi_with = update_for(KPI);
      return update_kpi_with;
    })();

    editStoriesButton().click(function(e) {
      document.location = "adminStories.php?project=" + projectDropdown().val();
    }).hide();

    projectDropdown().chosen();
    storyDropdown().chosen();

    $('*[bgcolor="#dddddd"]').removeAttr('bgcolor').addClass('even-row');
    $('*[bgcolor="#ffffff"]').removeAttr('bgcolor').addClass('even-row');
    $('table:nth(1)').before($('table:nth(2) small'));
    $('table:last').addClass('inset-shadow').removeAttr('width');

  });
})(jQuery);
