var allBooks = [];
var pageResults = 10;

$(function () {
  $("#searchBtn").click(function () { searchBooks(); });

  $("#pageSelect").change(function () {
    var pageNum = parseInt($(this).val()); showPage(pageNum); });
});

function searchBooks() {

  var termSearch = $("#searchInput").val().trim();
  if (!termSearch) {
    $("#summary").html('<div class="error"><strong>Error:</strong> Please enter a search term.</div>');
    $("#results").empty();
    return;
  }

  var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(search_term) + "&maxResults=40";
  $.getJSON(apiUrl)
    .done(function (data) {
      allBooks = data.items || [];
      $("#summary").html("Books found: <strong>" + allBooks.length + "</strong>");
      if (allBooks.length === 0) {
        $("#results").html("<div>No books found.</div>");
        $("#pageSelect").empty();
        return;
      }
      buildPages();
      showPage(1);
    })
    .fail(function () {
      $("#summary").html('<div class="error"><strong>Error:</strong> Could not load book data.</div>');
      $("#results").empty();
    });
}

function buildPages() {
  $("#pageSelect").empty();
  var totalPages = Math.ceil(allBooks.length / pageResults);

  for (var i = 1; i <= totalPages; i++) {
    $("#pageSelect").append('<option value="' + i + '">' + i + '</option>');
  }
}

function showPage(pageNum) {
  $("#results").empty();

  var startNum = (pageNum - 1) * pageResults;
  var endum = startNum + pageResults;

  for (var i = startNum; i < endum && i < allBooks.length; i++) {
    
    var bookInformatiom = (allBooks[i] && allBooks[i].volumeInfo) ? allBooks[i].volumeInfo : {};
    var bookId = allBooks[i].id;
    var bookTitle = bookInformatiom.title || "No title";
    var authorName = (bookInformatiom.authors && bookInformatiom.authors.length) ? bookInformatiom.authors.join(", ") : "N/A";

    var bookCover = "";
    if (bookInformatiom.imageLinks) {
      book_cover = bookInformatiom.imageLinks.thumbnail || bookInformatiom.imageLinks.smallThumbnail || "";
    }

    var bookCard = "";
    bookCard += '<div class="book">';
    if (bookCover) {
      bookCard += '<img class="thumb" src="' + bookCover + '" alt="Book cover">';
    }
    bookCard += '<div class="book-title"><a href="details.html?id=' + bookId + '">' + bookTitle + '</a></div>';
    bookCard += '<div class="book-meta"><strong>Author(s):</strong> ' + authorName + '</div>';
    bookCard += '</div>';
    $("#results").append(bookCard);
  }
}
