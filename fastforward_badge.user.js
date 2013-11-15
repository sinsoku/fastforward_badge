// ==UserScript==
// @name       fast-forward badge
// @namespace  https://github.com/sinsoku/fastforward_badge
// @version    0.2
// @include    https://github.com/*/pull/*
// ==/UserScript==

function addBadge(enable) {
  var text;
  var tagName = "span";
  var style = "border-radius: 5px;" +
    "display: inline-block;" +
    "margin-top: 3px;" +
    "padding: 1px 3px;";
  var enableStyle = "color: #fff;" +
    "background-color: forestgreen;";
  var disabledStyle = "color: #fff;" +
    "background-color: dimgray;";
  if (enable) {
    text = "fast-forward";
    style += enableStyle;
  } else {
    text = "non-fast forward";
    style += disabledStyle;
  }
  var badge = '<' + tagName + ' style="' + style + '">' + text + '</' + tagName + '>';
  $(".discussion-topic-header").append(badge);
}
var pullreq, commits, baseBranch;
var s = document.location.pathname.split('/');
var owner = s[1];
var repo = s[2];
var number = s[4];
var apiURL = "https://api.github.com/";
$.ajaxSetup({ async: false });

function getPullReq() {
  var url = apiURL + "repos/" + owner + "/" + repo + "/pulls/" + number;
  $.getJSON(url, function(json) { pullreq = json; });
}
function getCommits() {
  var url = apiURL + "repos/" + owner + "/" + repo + "/pulls/" + number + "/commits";
  $.getJSON(url, function(json) { commits = json; });
}
function getBaseBranch() {
  var url = apiURL + "repos/" + owner + "/" + repo + "/branches/" + pullreq.base.ref;
  $.getJSON(url, function(json) { baseBranch = json; });
}

function isFastForward() {
  return commits[0].parents[0].sha == baseBranch.commit.sha;
}
function isOpen() {
  return pullreq.state == "open";
}

getPullReq();
getCommits();
getBaseBranch();
if (isOpen()) { addBadge(isFastForward()); }
