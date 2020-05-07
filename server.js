var express = require('express')
var bodyParser = require('body-parser')
var app = express()
// var cors = require('cors')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(__dirname))

var dbURL = "mongodb+srv://oscar117372002:B122325124@cluster0-c2cul.mongodb.net/test?retryWrites=true&w=majority"

var Note = mongoose.model("note", {
  title: String,
  content: String
})

app.get('/notes', (req, res) =>{
  Note.find({}, (err, note) => {
  res.send(note)
  })
})

app.post('/notes', (req, res) => {
  var note = new Note(req.body)
  note.save((err) => {
    if(err){
      sendStatus(500)
    }
    io.emit('note', req.body)
    res.sendStatus(200)
  })

})
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true}, err => {
  console.log("Mongoose db connection", err)
});


var server = http.listen(3000)
