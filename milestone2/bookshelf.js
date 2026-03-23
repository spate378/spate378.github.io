var booksID = ["Kw5sEQAAQBAJ","XfFvDwAAQBAJ","q0rCTQlvNMoC","GZXlEAAAQBAJ","mwWNEQAAQBAJ"
];

var gKey = "AIzaSyA6lSYNLDYST73FsnRTEKXHqX7wbpi90qU";
var bookNum = 0;

$(document).ready(function () {
  $("#results").empty();
  $("#summary").html("Now getting " + booksID.length + " books...");
  booksID.forEach(function (id) {
  var apiUrl = "https://www.googleapis.com/books/v1/volumes/" + id + "?key=" + gKey;

    $.getJSON(apiUrl, function (data) {
      var book = data.volumeInfo;
      var title = book.title || "No title";
      var bookAuthor = book.authors ? book.authors.join(", ") : "N/A";
      var img = book.imageLinks ? book.imageLinks.thumbnail : "";
      var bookHtml = "<div class='book'>";
      
      if (img) {
        bookHtml += "<img class='thumb' src='" + img + "'>";
      }
      bookHtml += "<p class='book-title'><a href='details.html?id=" + id + "'>" + title + "</a></p>";
      bookHtml += "<p class='book-meta'>" + bookAuthor + "</p>";
      bookHtml += "</div>";
      $("#results").append(bookHtml);
      bookNum++;
      
      if (bookNum === booksID.length) {$("#summary").html("Showing " + bookNum + " books from my shelf.");}
    }).fail(function () { bookNum++;
      $("#summary").html("<span style='color:red'>Error, Something went wrong.</span>");
    });
});
});
