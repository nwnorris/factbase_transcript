var express = require('express')
var got = require('got')
var cheerio = require('cheerio')
var path = require('path')
var bp = require('body-parser')
var app = express()

app.use(bp.urlencoded({extended: true}))
app.use(bp.json())
app.use("/src", express.static(path.join(__dirname, 'src')))

const htmlPath = path.join(__dirname, 'src/html/')

//https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url/22648406#22648406
function isURL(str) {
    var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    var url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
}

app.get("/", function(req, res) {
  res.sendFile(htmlPath + "index.html")
})

//Goal is to convert many different text elements into one long paragraph of text for easy searching.
app.post("/speech", function(req, res) {
    if(isURL(req.body.url)) {
      got(req.body.url).then(response => {

        //Extract individual text elements, figured out based on the page structure.
        var data = ""
        const $ = cheerio.load(response.body)
        var sections = $('div.media.topic-media-row.mediahover')

        for(var i = 0; i < sections.length; i++ ){
          var s = cheerio.load(sections[i])
          const speakerName = s('.speaker-label').html()
          if(speakerName == "Donald Trump") {
            const quote = s('a')['0'].children[0].data
            data += quote + " "
          }
        }

        var speechTitle = $('h1.topic-page-header.transcript-header')[0].children[0].data
        res.json({data : data, title: speechTitle})
      })
    } else {
      res.status(400).send()
    }
})


app.listen(1050, () => console.log("App online on port 1050"))
