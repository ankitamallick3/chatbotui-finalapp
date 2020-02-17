// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const aws = require('aws-sdk');
const key = "--";
const secret_key = "--";
process.env.AWS_ACCESS_KEY_ID = `${key}`;
process.env.AWS_SECRET_ACCESS_KEY = `${secret_key}`;
process.env.AWS_REGION = "us-east-1";

 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  //function to generate an id
  function makeid(l)
{
var text = "";
var char_list = "0123456789";
for(var i=0; i < 3; i++ )
{ 
text += char_list.charAt(Math.floor(Math.random() * char_list.length));
}
return text;
}
console.log(makeid(3));
console.log(makeid(3));


  

  // function to save user data to UserDetails Table
  function saveData(agent){
    let db = new aws.DynamoDB.DocumentClient();
    console.log("Coming in saveData");
    
    const fullName = agent.parameters.fullname;
    const areaName = agent.parameters.areaName;
    const pincode = agent.parameters.pincode;
    const mobNo = agent.parameters.mobNo;
    
    let save = function(){
      var input = {
        "MobNo" : mobNo,
        "fullName" : `${fullName}`,
        "areaName" : `${areaName}`,
        "pincode" : pincode
        };
      var parameters = {
        TableName: "UserDetails",
        Item: input
      };
      db.put(parameters,function(err,data){
      if(err){
        console.log("Error is:",JSON.stringify(err,null,2));
      }else{console.log("success");}
      });
    };
    save();
 }

// function to save a Veg Order to OrderDetails table
    function saveVegOrder(agent){
    let dbVegWrite = new aws.DynamoDB.DocumentClient();
    //console.log("Coming in saveVegOrder");
    var number = makeID(3);

    var id = number;
    const order = "Veg Pizza";
    const pizzaSize = agent.parameters.pizzaSize;
    const crustType = agent.parameters.crustType;
    const pizzaToppings = agent.parameters.pizzaToppings;
    
    
    let save = function(){
      var input = {
         "orderId" : id,
        "pizzaType" : `${order}`,
        "pizzaSize" : `${pizzaSize}`,
        "crustType" : `${crustType}`,
        "pizzaToppings" : `${pizzaToppings}`
        };
      var parameters = {
        TableName: "OrderDetailsTable",
        Item: input
      };
      dbVegWrite.put(parameters,function(err,data){
      if(err){
        console.log("Error is two:",JSON.stringify(err,null,2));
      }else{console.log("success");}
      });
    };
    save();

  }

// function to save a Non Veg Order to OrderDetails table
    function saveNonVegOrder(agent){
    let dbNonVegWrite = new aws.DynamoDB.DocumentClient();
    //console.log("Coming in saveVegOrder");
    var number = makeID(3);

    var id = number;
    const order = "Non-Veg Pizza";
    const pizzaSize = agent.parameters.pizzaSize;
    const crustType = agent.parameters.crustType;
    const pizzaToppings = agent.parameters.pizzaToppings;
    
    
    let save = function(){
      var input = {
         "orderId" : id,
        "pizzaType" : `${order}`,
        "pizzaSize" : `${pizzaSize}`,
        "crustType" : `${crustType}`,
        "pizzaToppings" : `${pizzaToppings}`
        };
      var parameters = {
        TableName: "OrderDetailsTable",
        Item: input
      };
      dbNonVegWrite.put(parameters,function(err,data){
      if(err){
        console.log("Error is two:",JSON.stringify(err,null,2));
      }else{console.log("success");}
      });
    };
    save();

  }
  


  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('UserDetails', saveData);
  intentMap.set('VegPizzaAdons', saveVegOrder);
  intentMap.set('NonVegPizzaAdons', saveNonVegOrder);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
