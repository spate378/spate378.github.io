var allBooks = [];
var pageResults = 10;
var pageNum = 1;
var lastSection = "search";
var doneShelf = false;
var currentView = "grid";
var shelfView = "grid";
var shelfType = "";
var apiKey = "fc1a418da70cf6b5c38e0e2d41f38f01";
var baseUrl = "https://api.themoviedb.org/3";

$(document).ready(function () {
  $("#searchBtn").click(function () {
    searchBooks();
  });
  $("#searchInput").keypress(function (e) {
    if (e.which === 13) { searchBooks(); }
  });
  $("#navSearch").click(function (e) {
    e.preventDefault();
    showSection("search");
    setActiveNav("navSearch");
  });
  $("#navShelf").click(function (e) {
    e.preventDefault();
    showSection("shelf");
    setActiveNav("navShelf");
    if (shelfType !== "trending") {
      loadBookshelf("trending");
    }
  });
  $("#backBtn").click(function () {
    showSection(lastSection);
    if (lastSection === "shelf") {
      setActiveNav("navShelf");
    } else {
      setActiveNav("navSearch");
    }
  });
  $("#gridBtn").click(function () {
    currentView = "grid";
    $("#results").removeClass("list").addClass("grid");
    $("#gridBtn").addClass("active-toggle");
    $("#listBtn").removeClass("active-toggle");
    showPage(pageNum);
  });
  $("#listBtn").click(function () {
    currentView = "list";
    $("#results").removeClass("grid").addClass("list");
    $("#listBtn").addClass("active-toggle");
    $("#gridBtn").removeClass("active-toggle");
    showPage(pageNum);
  });
  $("#shelfGridBtn").click(function () {
    shelfView = "grid";
    $("#shelfResults").removeClass("list").addClass("grid");
    $("#shelfGridBtn").addClass("active-toggle");
    $("#shelfListBtn").removeClass("active-toggle");
    renderShelf(allBooks);
  });
  $("#shelfListBtn").click(function () {
    shelfView = "list";
    $("#shelfResults").removeClass("grid").addClass("list");
    $("#shelfListBtn").addClass("active-toggle");
    $("#shelfGridBtn").removeClass("active-toggle");
    renderShelf(allBooks);
  });
  $("#trendingBtn").click(function () {
    $("#trendingBtn").addClass("active-tab");
    $("#bestBtn").removeClass("active-tab");
    loadBookshelf("trending");
  });
  $("#bestBtn").click(function () {
    $("#bestBtn").addClass("active-tab");
    $("#trendingBtn").removeClass("active-tab");
    loadBookshelf("best");
  });
});

function showSection(name) {
  $("#searchSection").hide();
  $("#shelfSection").hide();
  $("#detailsSection").hide();
  if (name === "search") { $("#searchSection").show(); }
  if (name === "shelf") { $("#shelfSection").show(); }
  if (name === "details") { $("#detailsSection").show(); }
}
function setActiveNav(id) {
  $(".nav a").removeClass("nav-active");
  $("#" + id).addClass("nav-active");
}
function searchBooks() {
  var termSearch = $("#searchInput").val().trim();
  if (termSearch === "") {
    $("#summary").html("Enter a term to search.");
    $("#results").empty();
    return;
}
  $("#summary").html("Searching...");
  $("#results").empty();
  $("#pagination").empty();
  $("#viewToggle").hide();
  allBooks = [];
  pageNum = 1;
  var apiUrl = baseUrl + "/search/movie?api_key=" + apiKey + "&query=" + encodeURIComponent(termSearch) + "&page=1";

  $.getJSON(apiUrl, function (data) {
    allBooks = data.results || [];
    var totalPages = Math.ceil(allBooks.length / pageResults);
    $("#summary").html("Showing results for <strong>" + termSearch + "</strong>: " + allBooks.length + " movies found.");
    $("#viewToggle").show();
    buildPages(totalPages);
    showPage(1);
  }).fail(function () {
    $("#summary").html("<span style='color:red'>Error, Something went wrong.</span>");
  });
}
function buildPages(totalPages) {
  $("#pagination").empty();
  $("#pagination").append("<span>Page: </span>");
  for (var i = 1; i <= totalPages; i++) {
    (function (pg) {
      var $btn = $("<button class='page-btn'>" + pg + "</button>");
      if (pg === pageNum) { $btn.addClass("active"); }
      $btn.click(function () {
        pageNum = pg;
        $(".page-btn").removeClass("active");
        $(this).addClass("active");
        showPage(pg);
      });
      $("#pagination").append($btn);
  })(i);
}
}
function showPage(pg) {
  var start = (pg - 1) * pageResults;
  var end = start + pageResults;
  var slice = allBooks.slice(start, end);
  var data = {

    movies: slice.map(function (m) {
      return {
        id: m.id,
        title: m.title || "No Title",
        poster: m.poster_path || "",
        year: m.release_date ? m.release_date.substring(0, 4) : "N/A",
        rating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
        overview: m.overview ? m.overview.substring(0, 120) + "..." : "No description."
      };
  })
};
  var template = currentView === "list"
    ? $("#listTemplate").html()
    : $("#cardTemplate").html();
  var html = Mustache.render(template, data);
  
  $("#results").html(html);
  $("#results").off("click", ".movie").on("click", ".movie", function () {
    lastSection = "search";
    loadDetails($(this).data("id"));
  });
}
function loadBookshelf(type) {
  shelfType = type;
  allBooks = [];
  $("#shelfResults").empty();
  $("#shelfSummary").html("Loading shelf...");

  var endpoint = type === "best" ? "/movie/top_rated" : "/movie/popular";
  var apiUrl = baseUrl + endpoint + "?api_key=" + apiKey + "&page=1";

  $.getJSON(apiUrl, function (data) {
    allBooks = data.results || [];
    var label = type === "best" ? "Best Rated" : "Trending";
    $("#shelfSummary").html("Showing " + allBooks.length + " " + label + " movies.");
    renderShelf(allBooks);
  }).fail(function () {
    $("#shelfSummary").html("<span style='color:red'>Error, Something went wrong.</span>");
  });

  $("#shelfResults").off("click", ".movie").on("click", ".movie", function () {
    lastSection = "shelf";
    loadDetails($(this).data("id"));
  });
}
function renderShelf(movies) {
  var data = {
    movies: movies.map(function (m) {
      return {
        id: m.id,
        title: m.title || "No Title",
        poster: m.poster_path || "",
        year: m.release_date ? m.release_date.substring(0, 4) : "N/A",
        rating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
        overview: m.overview ? m.overview.substring(0, 120) + "..." : "There is No description."
      };
  })
};
  var template = shelfView === "list"
    ? $("#listTemplate").html()
    : $("#cardTemplate").html();
  var html = Mustache.render(template, data);

  $("#shelfResults").html(html);
  $("#shelfResults").off("click", ".movie").on("click", ".movie", function () {
    lastSection = "shelf";
    loadDetails($(this).data("id"));
  });
}
function loadDetails(bookId) {
  showSection("details");
  $("#detailsContent").html("Loading movie details...");
  var apiUrl = baseUrl + "/movie/" + bookId + "?api_key=" + apiKey;

  $.getJSON(apiUrl, function (data) {
    var genres = data.genres ? data.genres.map(function (g) { return g.name; }).join(", ") : "N/A";
    var runtime = data.runtime ? data.runtime + " min" : "N/A";
    var templateData = {
      title: data.title || "No Title",
      poster: data.poster_path || "",
      releaseDate: data.release_date || "N/A",
      rating: data.vote_average ? data.vote_average.toFixed(1) : "N/A",
      language: data.original_language ? data.original_language.toUpperCase() : "N/A",
      genres: genres,
      runtime: runtime,
      overview: data.overview || "No description available."
  };
    var template = $("#detailsTemplate").html();
    var html = Mustache.render(template, templateData);
    $("#detailsContent").html(html);
  }).fail(function () {
  $("#detailsContent").html("<span style='color:red'>Error, Something went wrong.</span>");
});
}