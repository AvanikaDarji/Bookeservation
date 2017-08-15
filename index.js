var express = require('express');
//var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

//using express 
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
      context = value.context;
      contextIndex = index;
    }
    index = index + 1;
  });

  console.log('Recieved message' + number + ' says \'' + message  + '\'');

  var conversation = new ConversationV1({
    
  username: '05d0272f-8e14-4c5d-a807-1e8cbff7a26f',
  password: 'YK6NVrQg5nze',
    version_date: ConversationV1.VERSION_DATE_2017_05_26
  });
   

  //console.log(JSON.stringify(context));
  //console.log(contexts.length);

  conversation.message({
    input: { text: message },
    workspace_id: 'e556964f-e07b-4eeb-bf71-6256c9c44ba8',
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

