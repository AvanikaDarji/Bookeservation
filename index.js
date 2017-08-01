var express = require('express');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var app = express();

var contexts = [];

app.get('/smssent', function (req, res) {
  var message = req.query.Body;
  var number = req.query.From;
  var twilioNumber = req.query.To;

  var context = null;
  var index = 0;
  var contextIndex = 0;
  contexts.forEach(function(value) {
    console.log(value.from);
    if (value.from == number) {
      context = value.context;ß
      contextIndex = index;
    }
    index = index + 1;
  });

  console.log('Recieved message' + number + ' says \'' + message  + '\'');

  var conversation = new ConversationV1({
    username: '7ec7d501-0e6f-43d1-86b3-576f38822a05',
    password: '1yUTwKgDTCUL',
    version_date: ConversationV1.VERSION_DATE_2017_08_01
  });

  console.log(JSON.stringify(context));
  console.log(contexts.length);

  conversation.message({
    input: { text: message },
    workspace_id: '2732a7bc-66b4-461e-b832-20d4a17b0d34',
    context: context
   }, function(err, response) {
       if (err) {
         console.error(err);
       } else {
         console.log(response.output.text[0]);
         if (context == null) {
           contexts.push({'from': number, 'context': response.context});
         } else {
           contexts[contextIndex].context = response.context;
         }




         var intent = response.intents[0].intent;
         console.log(intent);
         if (intent == "done") {
           
           contexts.splice(contextIndex,1);
          
         }

        /* var intent = response.intents[0].intent;
         console.log(intent);
         if (intent == "done") {
           
           contexts.splice(contextIndex,1);
          
         }*/

         var client = require('twilio')(
           'ACdc8fbc24308303ba67553e0015e8c095',
           'a644c729795f967232dbfde3c122ee92'
         );

         client.messages.create({
            from: twilioNumber,
           to: number,
           body: response.output.text[0]
         }, function(err, message) {
           if(err) {
             console.error(err.message);
           }
         });
       }
  });

  res.send('');
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});

