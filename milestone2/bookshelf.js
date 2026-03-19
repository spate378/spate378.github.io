var volumeIDs = [
  "Kw5sEQAAQBAJ",
  "XfFvDwAAQBAJ",
  "q0rCTQlvNMoC",
  "GZXlEAAAQBAJ",
  "mwWNEQAAQBAJ"
];

var apiKey = "AIzaSyA6lSYNLDYST73FsnRTEKXHqX7wbpi90qU";
var loadedBooks = 0;

$(document).ready(function () {
  $("#results").empty();
  $("#summary").html("Loading " + volumeIDs.length + " books...");

  volumeIDs.forEach(function (id) {
    var apiUrl = "https://www.googleapis.com/books/v1/volumes/" + id + "?key=" + apiKey;

    $.getJSON(apiUrl, function (data) {
      var book = data.volumeInfo;
      var title = book.title || "No title";
      var authors = book.authors ? book.authors.join(", ") : "N/A";
      var img = book.imageLinks ? book.imageLinks.thumbnail : "";

      var html = "<div class='book'>";
      if (img) {
        html += "<img class='thumb' src='" + img + "'>";
      }
      html += "<p class='book-title'><a href='details.html?id=" + id + "'>" + title + "</a></p>";
      html += "<p class='book-meta'>" + authors + "</p>";
      html += "</div>";

      $("#results").append(html);
      loadedBooks++;

      if (loadedBooks === volumeIDs.length) {
        $("#summary").html("Showing " + loadedBooks + " books from my shelf.");
      }
    }).fail(function () {
      loadedBooks++;
      $("#summary").html("<span style='color:red'>Error loading one or more books.</span>");
    });
  });
});