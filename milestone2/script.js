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

  var base = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(termSearch);
  var call1 = $.getJSON(base + "&maxResults=40&startIndex=0");
  var call2 = $.getJSON(base + "&maxResults=20&startIndex=40");

  $.when(call1, call2).done(function (data1, data2) {
    var books1 = data1[0].items || [];
    var books2 = data2[0].items || [];
    allBooks = books1.concat(books2);
    $("#summary").html("Books found: " + allBooks.length);
    buildPages();
    showPage(1);
  }).fail(function () {
    $("#summary").html("<span style='color:red'>Error fetching results. Please try again.</span>");
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
    var img = book.imageLinks ? book.imageLinks.thumbnail : "";

    var html = "<div class='book'>";
    if (img) {
      html += "<img class='thumb' src='" + img + "'>";
    }
    html += "<p class='book-title'><a href='details.html?id=" + allBooks[i].id + "'>" + title + "</a></p>";
    html += "<p class='book-meta'>" + authors + "</p>";
    html += "</div>";

    $("#results").append(html);
  }
}
