var allBooks = [];
var pageResults = 10;

$(document).ready(function () {
  $("#searchBtn").click(function () {
    searchBooks();
  });

  $("#pageSelect").change(function () {
    var pageNum = parseInt($(this).val());
    showPage(pageNum);
  });
});

function searchBooks() {

  var termSearch = $("#searchInput").val().trim();
  if (termSearch === "") {
    $("#summary").html("Please enter a search term.");
    $("#results").empty();
    return;
  }

  var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(termSearch) + "&maxResults=40";

  $.getJSON(apiUrl, function (data) {

    allBooks = data.items || [];
    $("#summary").html("Books found: " + allBooks.length);
    buildPages();
    showPage(1);
  });
}

function buildPages() {

  $("#pageSelect").empty();
  var totalPages = Math.ceil(allBooks.length / pageResults);
  for (var i = 1; i <= totalPages; i++) {
    $("#pageSelect").append("<option value='" + i + "'>" + i + "</option>");
  }
}

function showPage(pageNum) {

  $("#results").empty();
  var start = (pageNum - 1) * pageResults;
  var end = start + pageResults;

  for (var i = start; i < end && i < allBooks.length; i++) {

    var book = allBooks[i].volumeInfo;
    var title = book.title || "No title";
    var authors = book.authors ? book.authors.join(", ") : "N/A";
    var img = "";
    
    if (book.imageLinks) {
      img = book.imageLinks.thumbnail;
    }

    var html = "<div class='book'>";
    if (img) {
      html += "<img src='" + img + "'>";
    }
    html += "<h3><a href='details.html?id=" + allBooks[i].id + "'>" + title + "</a></h3>";
    html += "<p>" + authors + "</p>";
    html += "</div>";

    $("#results").append(html);
  }
}
