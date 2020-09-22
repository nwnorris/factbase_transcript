var SERVER_URL = "http://localhost:1050"

function showSpeech(response) {
  $(".result").text(response.data)
  $(".result").slideDown()
  $(".speech-title").text(response.title)
  console.log(response.title)
  $(".speech-title").fadeIn()
}

function fail() {
  $(".search-bar").css("height", "0px")
  $(".search-bar").val("")
  $(".speech-title").text("")
  $(".speech-title").fadeOut()
  $('.submit').css("border", "1px solid #ff7070")
  $('.search-bar').css("border", "1px solid #ff7070")
  setTimeout(function() {
    $('.submit').css("border", "")
    $('.search-bar').css("border", "")
    $(".search-bar").css("height", "")
  }, 1000)
}

$(".submit").click(function(){
  var url = $(".search-bar").val()
  $(".result").text("")
  $(".result").slideUp()
  console.log(url)
  $.ajax({
    method: 'POST',
    url: SERVER_URL + "/speech",
    data: {
      url: url
    },
    success: showSpeech,
    error: fail
  })
})
