var createError = require('http-errors');
var express = require('express');
var path = require('path');
const http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const groupModel = require('./models/chatroom');
const patientsRouter = require('./controllers/patientRoute');
var cloudinary = require('cloudinary');
var authRouter = require('./controllers/authRoute');
var userRouter = require('./controllers/userRouter');
var reportsRouter = require('./controllers/labReportRoute');
const socketio = require('socket.io');
const chatGroupRouter = require('./controllers/chatGroupRouter.js');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getAllRooms,
} = require('./utils/users');

require('dotenv').config();
const PORT = 4000;
var app = express();

const server = http.createServer(app);
const io = socketio(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Database Connection
require('./connections/db');

//Routes

app.use('/api/users', userRouter);
app.use('/api/chatgroup', chatGroupRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/reports', reportsRouter);
app.use('/auth', authRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/chat-app/build'));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, 'client', 'chat-app', 'build', 'index.html')
    );
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const botName = 'BringO Bot';

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    groupModel.findOne({ group_name: room }).exec(function (error, group) {
      if (error)
        socket.emit('custom_msg', 'Server Error while creating a group');
      if (group) {
        //check if user is a memeber of group
        if (group.users.indexOf(username) == -1) {
          socket.emit('custom_msg', 'Access Denied !');
        } else {
          //run if user is part of group
          const user = userJoin(socket.id, username, room);
          console.log(user);
          socket.join(user.room);

          // // Welcome current user
          // socket.emit('message', formatMessage(botName, 'Welcome to Room!'));

          // Broadcast when a user connects
          socket.broadcast
            .to(user.room)
            .emit(
              'message',
              formatMessage(botName, `${user.username} has joined the chat`)
            );

          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
          });
        }
      }
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    if (user) {
      var update = formatMessage(user.username, msg);
      //adding messages to database
      groupModel.update(
        { group_name: user.room },
        { $push: { messages: update } },
        function (err, done) {
          if (err) socket.emit('custom_msg', 'Server Error');
          else {
            console.log('msg saved');
          }
        }
      );

      io.to(user.room).emit('message', formatMessage(user.username, msg));
    }
  });

  //Listen for Patient Edit
  socket.on(
    'patientNotification',
    ({ patient_bed_no, room, last_updated_by }) => {
      var botUpdate = formatMessage(
        botName,
        `Bed No. ${patient_bed_no} is updated by ${last_updated_by}`
      );
      //adding bot messages to database
      groupModel.update(
        { group_name: room },
        { $push: { messages: botUpdate } },
        function (err, done) {
          if (err) socket.emit('custom_msg', 'Server Error');
          else {
            console.log('msg saved');
          }
        }
      );
      io.to(room).emit(
        'message',
        formatMessage(
          botName,
          `Bed No. ${patient_bed_no} is updated by ${last_updated_by}`
        )
      );
    }
  );

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has gone offline`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || PORT, function (error, done) {
  if (error) console.log('Server Listening Failed');
  else console.log('Server Listening to port ', process.env.PORT);
});
