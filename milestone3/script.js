var allBooks = [];
var pageResults = 10;
var pageNum = 1;
var lastSection = "search";
var doneShelf = false;
var booksID = ["Kw5sEQAAQBAJ","XfFvDwAAQBAJ","q0rCTQlvNMoC","GZXlEAAAQBAJ","mwWNEQAAQBAJ"];
var gKey = "AIzaSyA6lSYNLDYST73FsnRTEKXHqX7wbpi90qU";

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
    loadBookshelf();
  });

  $("#backBtn").click(function () {
    showSection(lastSection);
    if (lastSection === "shelf") {
      setActiveNav("navShelf");
    } else {
      setActiveNav("navSearch");
    }
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
  allBooks = [];
  pageNum = 1;

  var apiUrl = "https://www.googleapis.com/books/v1/volumes?q="
    + encodeURIComponent(termSearch)
    + "&maxResults=40&startIndex=0"
    + "&key=" + gKey;

  $.getJSON(apiUrl, function (data) {
    var firstBatch = data.items || [];

    var apiUrl2 = "https://www.googleapis.com/books/v1/volumes?q="
      + encodeURIComponent(termSearch)
      + "&maxResults=10&startIndex=40"
      + "&key=" + gKey;

    $.getJSON(apiUrl2, function (data2) {
      var secondBatch = data2.items || [];
      allBooks = firstBatch.concat(secondBatch).slice(0, 50);
      var totalPages = Math.ceil(allBooks.length / pageResults);
      $("#summary").html("Showing results for <strong>" + termSearch + "</strong>: " + allBooks.length + " books found.");
      buildPages(totalPages);
      showPage(1);
    }).fail(function () {
      allBooks = firstBatch.slice(0, 50);
      var totalPages = Math.ceil(allBooks.length / pageResults);
      $("#summary").html("Showing results for <strong>" + termSearch + "</strong>: " + allBooks.length + " books found.");
      buildPages(totalPages);
      showPage(1);
    });

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
  $("#results").empty();

  for (var i = start; i < end && i < allBooks.length; i++) {
    var book = allBooks[i].volumeInfo;
    var id = allBooks[i].id;
    var title = book.title || "No title";
    var authors = book.authors ? book.authors.join(", ") : "N/A";
    var img = book.imageLinks ? book.imageLinks.thumbnail : "";
    var bookHtml = "<div class='book' data-id='" + id + "'>";

    if (img) {
      bookHtml += "<img class='thumb' src='" + img + "'>";
    } else {
      bookHtml += "<div class='no-cover'>No Cover</div>";
    }

    bookHtml += "<p class='book-title'>" + title + "</p>";
    bookHtml += "<p class='book-meta'>" + authors + "</p>";
    bookHtml += "</div>";
    $("#results").append(bookHtml);
  }

  $("#results").off("click", ".book").on("click", ".book", function () {
    lastSection = "search";
    loadDetails($(this).data("id"));
  });
}

function loadBookshelf() {
  if (doneShelf) { return; }
  doneShelf = true;

  $("#shelfResults").empty();
  $("#shelfSummary").html("Loading bookshelf...");
  var loaded = 0;

  booksID.forEach(function (id) {
    var apiUrl = "https://www.googleapis.com/books/v1/volumes/" + id + "?key=" + gKey;

    $.getJSON(apiUrl, function (data) {
      var book = data.volumeInfo;
      var title = book.title || "No title";
      var authors = book.authors ? book.authors.join(", ") : "N/A";
      var img = book.imageLinks ? book.imageLinks.thumbnail : "";
      var bookHtml = "<div class='book' data-id='" + id + "'>";

      if (img) {
        bookHtml += "<img class='thumb' src='" + img + "'>";
      } else {
        bookHtml += "<div class='no-cover'>No Cover</div>";
      }
      bookHtml += "<p class='book-title'>" + title + "</p>";
      bookHtml += "<p class='book-meta'>" + authors + "</p>";
      bookHtml += "</div>";
      $("#shelfResults").append(bookHtml);
      loaded++;

      if (loaded === booksID.length) {
        $("#shelfSummary").html("Showing " + loaded + " books from my shelf.");
      }
    }).fail(function () {
      loaded++;
    });
  });
  $("#shelfResults").on("click", ".book", function () {
    lastSection = "shelf";
    loadDetails($(this).data("id"));
  });
}
function loadDetails(bookId) {
  showSection("details");
  $("#detailsContent").html("Loading book details...");

  var apiUrl = "https://www.googleapis.com/books/v1/volumes/" + bookId + "?key=" + gKey;

  $.getJSON(apiUrl, function (data) {
    var bookData = data.volumeInfo;
    var title = bookData.title || "No title found";
    var authors = bookData.authors ? bookData.authors.join(", ") : "N/A";
    var publisher = bookData.publisher || "N/A";
    var published = bookData.publishedDate || "N/A";
    var pages = bookData.pageCount ? bookData.pageCount + " pages" : "N/A";
    var description = bookData.description || "No description available.";
    var rating = bookData.averageRating ? bookData.averageRating + " / 5" : "N/A";
    var img = bookData.imageLinks ? bookData.imageLinks.large || bookData.imageLinks.thumbnail : "";
    var price = "N/A";
    if (data.saleInfo && data.saleInfo.listPrice) {
      price = "$" + data.saleInfo.listPrice.amount + " " + data.saleInfo.listPrice.currencyCode;
    }

    var bookHtml = "<div class='details-layout'>";
    if (img) {
      bookHtml += "<div class='details-img'><img src='" + img + "'></div>";
    }
    bookHtml += "<div class='details-info'>";
    bookHtml += "<h2>" + title + "</h2>";
    bookHtml += "<p><strong>Author(s):</strong> " + authors + "</p>";
    bookHtml += "<p><strong>Publisher:</strong> " + publisher + "</p>";
    bookHtml += "<p><strong>Published:</strong> " + published + "</p>";
    bookHtml += "<p><strong>Pages:</strong> " + pages + "</p>";
    bookHtml += "<p><strong>Rating:</strong> " + rating + "</p>";
    bookHtml += "<p><strong>Price:</strong> " + price + "</p>";
    bookHtml += "<p><strong>Description:</strong> " + description + "</p>";
    bookHtml += "</div></div>";
    
  $("#detailsContent").html(bookHtml);
  }).fail(function () {
    $("#detailsContent").html("<span style='color:red'>Error, Something went wrong.</span>");
  });
}
