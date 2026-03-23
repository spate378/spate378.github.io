$(document).ready(function () {
  
  var pageParams = new URLSearchParams(window.location.search);
  var bookId = pageParams.get("id");
  if (!bookId) {
    $("#detailsContent").html("<p style='color:red'>Error, No book ID entered.</p>"); return;
  }
  var requestUrl = "https://www.googleapis.com/books/v1/volumes/" + bookId + "?key=AIzaSyA6lSYNLDYST73FsnRTEKXHqX7wbpi90qU";

  $.getJSON(requestUrl, function (data) {
    var bookData = data.volumeInfo;
    var bookTitle = bookData.title || "No title found";
    var bookAuthor = bookData.authors ? bookData.authors.join(", ") : "N/A";
    var publisher = bookData.publisher || "N/A";
    var description = bookData.description || "No description.";
    var bookCover = bookData.imageLinks ? bookData.imageLinks.large || bookData.imageLinks.thumbnail : "";
    var bookPrice = "N/A";
    if (data.saleInfo && data.saleInfo.listPrice) {
      bookPrice = "$" + data.saleInfo.listPrice.amount + " " + data.saleInfo.listPrice.currencyCode;
    }
    var bookHtml = "<div class='details-layout'>";
    if (bookCover) {
      bookHtml += "<div class='details-img'><img src='" + bookCover + "'></div>";
    }
    bookHtml += "<div class='details-info'>";
    bookHtml += "<h2>" + bookTitle + "</h2>";
    bookHtml += "<p><strong>Author:</strong> " + bookAuthor + "</p>";
    bookHtml += "<p><strong>Publisher:</strong> " + publisher + "</p>";
    bookHtml += "<p><strong>Price:</strong> " + bookPrice + "</p>";
    bookHtml += "<p><strong>Description:</strong> " + description + "</p>";
    bookHtml += "</div></div>";

    $("#detailsContent").html(bookHtml);
  }).fail(function () {
    $("#detailsContent").html("<span style='color:red'>Error, Somethign went wrong.</span>");
});
});
