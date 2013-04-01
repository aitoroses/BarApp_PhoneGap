/*!
 *
 *  Copyright (c) David Bushell | http://dbushell.com/
 *
 */(function(e,t,n){e.App=function(){var e=!1,n={};n.init=function(){if(e)return;e=!0;var r=!1;n.openNav=function(){if(!r){$("html").addClass("js-nav",{duration:500});r=!0;return!1}};n.closeNav=function(){if(r){$("html").removeClass("js-nav");r=!1;return!1}};$("#nav-open-btn").on("click",function(){n.openNav()});$("#nav-close-btn").on("click",function(){n.closeNav()});$("#main").on("click",function(e){if(r){e.preventDefault();n.closeNav()}});$(t.documentElement).addClass("js-ready")};return n}();$.fn.ready(function(){e.App.init()})})(window,window.document);