$(document).ready(function () {
  var params = new URLSearchParams(window.location.search);
  var bookId = params.get("id");

  if (!bookId) {
    $("#detailsContent").html("<p style='color:red'>No book ID provided.</p>");
    return;
  }

  var apiUrl = "https://www.googleapis.com/books/v1/volumes/" + bookId + "?key=AIzaSyA6lSYNLDYST73FsnRTEKXHqX7wbpi90qU";

  $.getJSON(apiUrl, function (data) {
    var book = data.volumeInfo;
    var title = book.title || "No title";
    var authors = book.authors ? book.authors.join(", ") : "N/A";
    var publisher = book.publisher || "N/A";
    var description = book.description || "No description available.";
    var img = book.imageLinks ? book.imageLinks.large || book.imageLinks.thumbnail : "";
    var price = "N/A";

    if (data.saleInfo && data.saleInfo.listPrice) {
      price = "$" + data.saleInfo.listPrice.amount + " " + data.saleInfo.listPrice.currencyCode;
    }

    var html = "<div class='details-layout'>";

    if (img) {
      html += "<div class='details-img'><img src='" + img + "'></div>";
    }

    html += "<div class='details-info'>";
    html += "<h2>" + title + "</h2>";
    html += "<p><strong>Authors:</strong> " + authors + "</p>";
    html += "<p><strong>Publisher:</strong> " + publisher + "</p>";
    html += "<p><strong>Price:</strong> " + price + "</p>";
    html += "<p><strong>Description:</strong> " + description + "</p>";
    html += "</div></div>";

    $("#detailsContent").html(html);
  }).fail(function () {
    $("#detailsContent").html("<span style='color:red'>Error loading book details. Please try again.</span>");
  });
});