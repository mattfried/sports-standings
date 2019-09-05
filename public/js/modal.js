$(window).on('load', () => {
  setTimeout( () => {
    $('#emailModal').modal('show');
  },
  1000);
});


// $(document).ready(function (e) {
//   $("#submitModalBtn").on('submit',(function(e) {
//     console.log('clicked!!');
//     e.preventDefault();
//     $.ajax({
//       url: "/",                 // Url to which the request is send
//       type: "POST",             // Type of request to be send, called as method
//       data: new Email.model(),  // Data sent to server, a set of key/value pairs (i.e. form fields and values)
//       contentType: false,       // The content type used when sending data to the server.
//       cache: false,             // To unable request pages to be cached
//       processData: false,       // To send DOMDocument or non processed data file it is set to false
//       success: function(data)   // A function to be called if request succeeds
//       {
//           $('.close-modal').click();
//           $('#emailModal').modal('hide');
//           alert("Thank You! Your email was successfully submitted.");
//       }
//     });
//   }));
// });
