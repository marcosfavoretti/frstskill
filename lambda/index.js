/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
//const fetch = require('node-fetch');//import do fetch
const axios = require('axios');
//const fetch = (...args) => fetchP.then(fn => fn(...args))
const Alexa = require('ask-sdk-core');

const boardID = '6414eaacdf357282aee076b1'
const key ='17206af45468d8b12bd543f7f0bb3f86'
const token ='ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B'

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
};//respota da alexa


const UpdateIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UpdateIntent';
    },
    async handle(handlerInput) {
        const speakOutput = 'funcionou';
        
         const cardName = await handlerInput.requestEnvelope.request.intent.slots['nome'].value//pega o filtro de dias
        
         const fieldName =await handlerInput.requestEnvelope.request.intent.slots['campo'].value//pega o filtro de dias
        
         let newValue =await handlerInput.requestEnvelope.request.intent.slots['newvalue'].value//pega o filtro de dias
         
        // console.log(cardName, fieldName, newValue)
         console.log(CheckDate(newValue))
         
    //Caso for uma data, tratar conforme abaixo
    if (CheckDate(newValue)) {
        newValue = new Date(newValue);
    }

    let cardID = ''
        //URL para adquirir todos os cartões
    let url = `https://api.trello.com/1/boards/${boardID}/cards?key=${key}&token=${token}`;
    console.log(url)
    axios.get(encodeURI(url))
        .then((response) => {
            //Adquire o ID do cartão que será atualizado
            //const obj = JSON.parse(JSON.stringify(response.data))
            const obj = response.data
            console.log('---------------------------------------------->', cardName)
            
            //const target = obj.filter((cartao) => cartao.name === cardName)
             for (let i = 0; i < response.data.length; i++) {
                console.log(response.data[i].name, cardName)
                if (response.data[i].name === cardName) {
                    let target = response.data[i]
                    cardID = target.id;
                }
            }
            

            //Atualiza o cartão
            let urlCard = `https://api.trello.com/1/cards/${cardID}?key=${key}&token=${token}`;
           // console.log(urlCard)
            let parameter = alexaDictionary[fieldName]+'='+newValue; //Note que estou usando o alexaDictionary para traduzir o input da Alexa
            console.log('-------------------->',urlCard,parameter);
            axios.put(encodeURI(urlCard), parameter);
                 
            
        }).catch((err) => { //Manuseia erro caso não encontrado
            console.log(`Error: ${err}`);
        });
            
            return handlerInput.responseBuilder
            .speak(cardName, fieldName, newValue, cardID, boardID)//o que ela fala
            //.reprompt(speakOutput)//esperando resposta fala
            .getResponse();

       
    }
}


function CheckDate(text) {
  const date = new Date(text)
  return !isNaN(date.getTime());
}

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    async handle(handlerInput) {
        //const speakOutput = 'Hello World!';
       // const speakOutput = axios.post('https://api.trello.com/1/cards?idList=6414eaacdf357282aee076b8&name=teste&key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B');
        //let speakOutput = response.value.joke;


        return handlerInput.responseBuilder
            .speak('deu errado algo')
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const GerenciaIntent = {//funçao que ve os dias de vencimento dos cards
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GerenciaIntent';
    },
    async handle(handlerInput) {
        
    //
    
    let List = [];//vai armazenar as que que tiverem no range de 5 dias

    var dataT = new Date();
    var diastr = dataT.getFullYear().toString() + '-' +
    (dataT.getMonth() + 1).toString().padStart(2, '0') + '-' +
    dataT.getDate().toString().padStart(2, '0');

    var dias = handlerInput.requestEnvelope.request.intent.slots['dias'].value//pega o filtro de dias
    
    if(dias === undefined ){
        dias = 7 //se nao for passado os dias ele busca um range de 7 dias para vencerdabdhajwdbad
    }
    var data = new Date(diastr)//dia de hoje 

axios.get('https://api.trello.com/1/boards/6414eaacdf357282aee076b1/lists?cards=open&key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B')//req para pegar as lists
    .then(response => {
        const obj = JSON.parse(JSON.stringify(response.data))//json parse => obj recebe json
        //console.log(obj)
        for (var i in obj) {
            var cardobj = obj[i].cards 
            for (var j in cardobj) {
                var datacard = new Date(cardobj[j].due)//dia do cartao
                //console.log(typeof datacard)//pego a data de vencimento
                var umDiaEmMilissegundos = 86400000; // número de milissegundos em um dia
                var intervaloEmDias = dias; // número de dias no intervalo
                if (Math.abs((datacard.getTime() - data.getTime()) / umDiaEmMilissegundos) <= intervaloEmDias) {
                    
                    List.push(cardobj[j].name)
                    console.log('->>>>>>>>>>>>>>>>>>>>>>' + List)
                    
                }
            }
        }
            return handlerInput.responseBuilder
            .speak('Os cartoes próximos ao vencimento são:' + List)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    })//try
    .catch(err => console.error( err))
    //
            console.log('erro' + List)
            return handlerInput.responseBuilder
            .speak('erro')//aki so para testar coloquei um elemento so
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }//return hadle
};

const CardCreateIntent = {//funçao para criar cartao
  canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CardCreateIntent';
    },
   async handle(handlerInput) {

const nome = handlerInput.requestEnvelope.request.intent.slots['nomecard'].value;//nome do card
const nomelist = handlerInput.requestEnvelope.request.intent.slots['nomelist'].value;//nome da list
console.log(nome)
var due = handlerInput.requestEnvelope.request.intent.slots['dataVencimento'].value;//data vencimento
if(due  === undefined){//trata o valor caso ele nao seja passado
    due = ""
}
//else{
//var temp = due.split('-')
//temp[2] = parseInt(temp[2]) + 1//so mais um na variavel
//console.log(temp[2])
//var str = ''

//for (var i in temp) {
//    console.log(i)
  //  str += temp[i]
  //  if (i != 2) {
     //   str += '-'
  //  }
//}
//str minha variavel com o dia certo em string 
//tive que fazer isso pq ele sempre esta subtraindo um dia da minha data quando eu nao tratava

axios.get(encodeURI('https://api.trello.com/1/boards/6414eaacdf357282aee076b1/lists?&key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B'))//req para pegar as lists
    .then(response => {
        const obj = JSON.parse(JSON.stringify(response.data))//json parse => obj recebe json
        for (var i in obj) {

            if (obj[i].name.toLowerCase() === nomelist) {//pegar o valor de todas as listas do quadro
                //ve se tem a lista com o nome passado se tiver vai adicionar o cartao na lista passada
                axios.post(encodeURI('https://api.trello.com/1/cards?idList=' + obj[i].id + '&name=' + nome +'&due='+due+'&key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B'));
                break//sai do for 
            }
            else if (nomelist === undefined && nome !== undefined ) {//se nao passar nenhuma lista ele vai colocar na primeira lista e sair do for
                axios.post( encodeURI('https://api.trello.com/1/cards?idList=' + obj[i].id + '&name=' + nome + '&due='+due+'&key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B'));
                break
            }
        }
    })
    .catch(err => console.error(err))
        return handlerInput.responseBuilder
            .speak('cartao '+ nome +' criado na lista' + nomelist + 'validade' + due)
           // .reprompt('add a reprompt if you want to keep the session open for the user to respond')
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

const alexaDictionary = {
    'nome': 'name',
    'descrição': 'desc',
    'validade': 'due'
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        UpdateIntent,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CardCreateIntent,
        GerenciaIntent,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();