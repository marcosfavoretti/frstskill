/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
//const fetch = require('node-fetch');//import do fetch
const axios = require('axios');
//const fetch = (...args) => fetchP.then(fn => fn(...args))
const Alexa = require('ask-sdk-core');
let list_reuniao = []
const boardID = '6414eaacdf357282aee076b1'
const key ='17206af45468d8b12bd543f7f0bb3f86'
const token ='ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B'

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'pronto para uso';

        return handlerInput.responseBuilder
            .speak(speakOutput)//o que ela fala
            .reprompt(speakOutput)//esperando resposta fala
            .getResponse();
    }
};//respota da alexa

const SignPersonIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SignPersonIntent';
    },
    async handle(handlerInput) {
        
        const person = await handlerInput.requestEnvelope.request.intent.slots['Person'].value//pega o filtro de dias

        const card = await handlerInput.requestEnvelope.request.intent.slots['card'].value//pega o filtro de dias

        
        
    let cardUrl = `https://api.trello.com/1/boards/${boardID}/cards?key=${key}&token=${token}`;
    let memberUrl = `https://api.trello.com/1/boards/${boardID}/members?key=${key}&token=${token}`;

    axios.get(encodeURI(cardUrl)).then((cardResponse) => {
        axios.get(encodeURI(memberUrl)).then((memberResponse) => {
            //Adquire o ID do cartão que será atribuido
            const cardsObj = JSON.parse(JSON.stringify(cardResponse.data))
            let card = ''//filtro o cartao
            for( let i  in cardsObj){
                if(cardsObj[i].name === card){
                    card = cardsObj[i]
                }
            }
            //Adquire o ID do membro que será adicionado
            const membersObj = JSON.parse(JSON.stringify(memberResponse.data));

            //const member = membersObj.find(memberObj => memberObj.fullName === memberName);
            let member = ''
            for( let j in membersObj){
                if(membersObj[j].fullName === person){
                    member = membersObj[j]
                }
            }
            console.log(card, member)
            //Atualiza o cartão

           
                console.log(member.id)
                let urlCard = `https://api.trello.com/1/cards/${card.id}/idMembers?key=${key}&token=${token}`;
                axios.post(encodeURI(urlCard), { value: member.id });
           
            
        }).catch((err) => { console.log(`Error: ${err}`); });
    }).catch((err) => { console.log(`Error: ${err}`); });
    
    return handlerInput.responseBuilder
            .speak('pessoa atribuida ao card')//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();
    }
}

const MarkersIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MarkersIntent';
    },
    async handle(handlerInput) {
        const cardName = await handlerInput.requestEnvelope.request.intent.slots['nomecard'].value//pega o filtro de dias
        
        const type =await handlerInput.requestEnvelope.request.intent.slots['type'].value//pega o filtro de dias
    
        if(type === undefined){
            let url = `https://api.trello.com/1/boards/${boardID}/cards?key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B`
            //console.log(url)
            let resp = await axios.get(url)

            if (resp) {
        //console.log(resp.data)
        //let card = resp.data.filter((resp) => nomecard === resp.name)
             for( let i in resp.data){
                if(resp.data[i].name === cardName){
                let id = resp.data[i].id
                console.log(resp.data[i].name, resp.data[i].id )
                axios.put(`https://api.trello.com/1/cards/${id}?&key=${key}&token=${token}`, {
                    cover: {
                        color: 'green'
                    }
                })
        
            }
        }
    }
    else {
        return false
    }
        }
        else{
            //setar a importancia do card
        }
        return handlerInput.responseBuilder
            .speak(`card ${cardName} marcado com sucesso`)//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();

        
    }
}
async function generateList(){//faço a lista de tarefas
    list_reuniao = []
    let url = `https://api.trello.com/1/boards/${boardID}/cards?key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B`
    console.log(url)
    let resp = await axios.get(url)

    if (resp) {
        //console.log(resp.data)
        //let card = resp.data.filter((resp) => nomecard === resp.name)
        for( let i in resp.data){
            if(resp.data[i].cover.color === 'green'){
                let id = resp.data[i].id
                let unic = true
                for( i in list_reuniao){
                    if(i.nome === resp.data[i].name){ //se ja tiver na lista
                            unic = false
                            
                        }
                }
                console.log('---------------<'+ resp.data[i].name + unic )
                if(unic){
                    console.log(resp.data[i].name)
                    list_reuniao.push({nome: resp.data[i].name, desc: resp.data[i].desc, due: resp.data[i].due, id: resp.data[i].id}) //adiciono o card no meu array
                }

            }
        }
    }
    else {
        return false
    }
    //console.log('->',list)
}
const CreateListIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CreateListIntent';
    },
    async handle(handlerInput) {
           
           const listname = await handlerInput.requestEnvelope.request.intent.slots['nomeLista'].value//pega o filtro de dias
           let pos = await handlerInput.requestEnvelope.request.intent.slots['pos'].value//pega o filtro de dias
            
            if(pos ===undefined){
                pos = 0;//se for undefined crai no primeiro lugar
            }
                
            let urlCreateList = 'https://api.trello.com/1/lists?name=' + encodeURIComponent(listname) + `&pos=${pos}&idBoard=${boardID}`+`&key=${key}&token=${token}`;
            axios.post(urlCreateList).then(response => {
                console.log('Lista criada com sucesso: ', response.data)
              }).catch(error => {
                console.log(error)
                return handlerInput.responseBuilder
            .speak('nao foi possivel criar a lista')//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();
              });

           
            return handlerInput.responseBuilder
            .speak('lista ' + listname + 'criado com sucesso')//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();
    }
    
}
const MoveCardIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MoveCardIntent';
    },
        async handle(handlerInput) {

        const listname = await handlerInput.requestEnvelope.request.intent.slots['listname'].value

        const cardname = await handlerInput.requestEnvelope.request.intent.slots['card'].value
        
        
        //Cartão que vai ser movido
//Lista que vai receber o cartão

const urlGetAllCardsOnBoard = `https://api.trello.com/1/boards/${boardID}/cards?key=${key}&token=${token}`
let find = ''
let findlist = ''

await axios.get(urlGetAllCardsOnBoard).then( (response) => {
    //Achou o card que vai ser movido
    //const card = response.data.find( c => c.name === cardToBeMoved )
    for( let i in response.data){
        console.log(response.data[i].name)
        if(response.data[i].name === cardname){
            find = response.data[i]
        }
    }

    //Se achar o card, agora vai procurar a lista
    if(find !== ''){
        axios.get(`https://api.trello.com/1/boards/${boardID}/lists?key=${key}&token=${token}`).then(response => {
            for( let i in response.data){
                if(response.data[i].name === listname){
                    findlist = response.data[i]
                }
            }
        

            //Se achar a lista, agora vai atualizar o card pra ficar na lista
            if(findlist !== ''){
                axios.put(encodeURI(`https://api.trello.com/1/cards/${find.id}?idList=${findlist.id}&pos=bottom&key=${key}&token=${token}`))
                console.log('Card movido com sucesso!')
            }
            else{
                console.log('list error')
            return handlerInput.responseBuilder
            .speak('nao foi possivel')//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();
            }
        }).catch(error =>{
            console.log(error)
           return handlerInput.responseBuilder
            .speak(error)//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();
        })
    }else{
        console.log('Não achou o card' + findlist+ find + listname+ cardname)
        return handlerInput.responseBuilder
            .speak('card nao achado')//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();
    }
}).catch( error => {
    console.log('Erro ao buscar o card: ',error)
    return handlerInput.responseBuilder
            .speak(error)//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();
})
return handlerInput.responseBuilder
            .speak('card'+cardname+' movido com sucesso para lista'+ listname)//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();
   
}
}
const DeleteCardIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DeleteCardIntent';
    },
    async handle(handlerInput) {
    const cardname = await handlerInput.requestEnvelope.request.intent.slots['nomeCard'].value
    
    const urlGetCards =encodeURI( `https://api.trello.com/1/boards/${boardID}/cards?&key=${key}&token=${token}`)
    console.log('----------------------->'+urlGetCards)
    let resp = await axios.get(urlGetCards)
    console.log('antes do resp')
    if (resp) {
        console.log('delete intent')
    //console.log(resp.data)
    //let card = resp.data.filter((resp) => nomecard === resp.name)
         for( let i in resp.data){
            console.log(resp.data[i].name + cardname)
            if(resp.data[i].name === cardname){
                let urlDeleteCard = encodeURI('https://api.trello.com/1/cards/' + resp.data[i].id + '?key=17206af45468d8b12bd543f7f0bb3f86&token=ATTA87f2f270cd37b96abe400dd0bd72a39e50f6f257ef50b9a23c3f0635b6de28ca10C1494B')
                await axios.delete(urlDeleteCard).then(response => {
                console.log('Card deletado com sucesso: ', response.data);
                }).catch(error => {
                  console.log('Erro ao deletar o card: ', error);
                   return handlerInput.responseBuilder
                .speak('error')//o que ela fala
                .reprompt()//esperando resposta fala
                .getResponse();
               
            })
        }
    }
}
 return handlerInput.responseBuilder
                .speak('card '+ cardname+' deletado com sucesso')//o que ela fala
                .reprompt()//esperando resposta fala
                .getResponse();
    }
}

const ReuniaoTopicsIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReuniaoTopicsIntent';
    },
    async handle(handlerInput) {
    await generateList()
    let speak = list_reuniao[0]
    //console.log(speak)
    axios.put(`https://api.trello.com/1/cards/${speak.id}?&key=${key}&token=${token}`, {
        cover: {
            color: 'lime'
        }
    })
   list_reuniao.splice(0,1) //remove o primeiro elemento
    
    console.log(speak)
    return handlerInput.responseBuilder
            .speak(speak.nome +  'descriçao' + speak.desc)//o que ela fala
            .reprompt()//esperando resposta fala
            .getResponse();

    }
    
}


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
            .speak("cartao "+ cardName + "foi atualizado")//o que ela fala
            .reprompt(speakOutput)//esperando resposta fala
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
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
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
            .reprompt()
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
    'data': 'due'
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
        MoveCardIntent,
        SignPersonIntent,
        DeleteCardIntent,
        CreateListIntent,
        ReuniaoTopicsIntent,
        MarkersIntent,
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