/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
//const fetch = require('node-fetch');//import do fetch
const axios = require('axios');
//const fetch = (...args) => fetchP.then(fn => fn(...args))
const Alexa = require('ask-sdk-core');


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'funcionou';

        return handlerInput.responseBuilder
            .speak(speakOutput)//o que ela fala
            .reprompt(speakOutput)//esperando resposta fala
            .getResponse();
    }
};//respota do da alexa

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    async handle(handlerInput) {
        //const speakOutput = 'Hello World!';
        const speakOutput = axios.post('https://api.trello.com/1/cards?idList=6414eaacdf357282aee076b8&name=teste&key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B');
        //let speakOutput = response.value.joke;


        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const CardCreateIntent = {//funçao para criar cartao
  canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CardCreateIntent';
    },
   async handle(handlerInput) {

const nome = handlerInput.requestEnvelope.request.intent.slots['nomecard'].value;//nome do card
const nomelist = handlerInput.requestEnvelope.request.intent.slots['nomelist'].value;//nome da list

axios.get('https://api.trello.com/1/boards/6414eaacdf357282aee076b1/lists?&key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B')//req para pegar as lists
    .then(response => {
        const obj = JSON.parse(JSON.stringify(response.data))//json parse => obj recebe json
        for (var i in obj) {


            if (obj[i].name.toLowerCase() === nomelist) {//pegar o valor de todas as listas do quadro
                //ve se tem a lista com o nome passado se tiver vai adicionar o cartao na lista passada
                axios.post('https://api.trello.com/1/cards?idList=' + obj[i].id + '&name=' + nome + '&key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B');
                break//sai do for 
            }
            else if (nomelist === '' || nomelist === null || nomelist === undefined) {//se nao passar nenhuma lista ele vai colocar na primeira lista e sair do for
                axios.post('https://api.trello.com/1/cards?idList=' + obj[i].id + '&name=' + nome + '&key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B');
                break
            }
        }
    })
    .catch(err => console.error(err))
        return handlerInput.responseBuilder
            .speak('cartao '+ nome +' criado na lista' + nomelist)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CardCreateIntent,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();