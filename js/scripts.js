// Generated by CoffeeScript 1.6.1
(function(){$(document).ready(function(){$(document).ready(function(){return $("#main").load("sections/home/index.html")});return $("#nav a").click(function(e){var t;App.closeNav();$(this).parent().addClass("is-active");$("#nav a").parent().removeClass("is-active");e.preventDefault();t=$(this).attr("rel");switch(t){case"1":return $("#main").load("sections/home/index.html");case"2":return $("#main").load("sections/chart/index.html");case"3":return $("#main").load("sections/likes/index.html");case"4":return $("#main").load("sections/employees/index.html")}})})}).call(this);