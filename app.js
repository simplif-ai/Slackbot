require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const WebClient = require('@slack/client').WebClient;
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const bot_token = process.env.SLACK_BOT_TOKEN || '';
const auth_token = process.env.SLACK_AUTH_TOKEN || '';
const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);

const web = new WebClient(auth_token);
const bot = new WebClient(bot_token);

let channel;
let botID;
const PORT = 4309;
const app = express();
var request = require('request');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/slack/events', slackEvents.expressMiddleware());

app.listen(PORT, function() {
	console.log('TalkBot is listening on port ' + PORT);

	// Get userID for bot
	bot.auth.test()
		.then((info) => {
			if (info.user_id) {
				botID = info.user_id;
				console.log('bot id: ' + botID)
			}
		})
		.catch(console.error)
});

//make a call to the summarizer API:
function getSummary(msg, callback) {
	const body = JSON.stringify({
        	text: msg
    });
	var options = {
		headers: {
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
        	text: msg
        }),
        method: 'POST'
	}
 		
	request.post(
	    'http://simplif-ai-backend.us-east-2.elasticbeanstalk.com/summarizertext',
	     options ,
	    function (error, response, body) {

	    	var str = 'Summary: ';
	    	var body = JSON.parse(body);


	        if (!error && body.success && response.statusCode == 200) {
	        	//dynamic sentence count ~~ neato

	        	var sentenceCount = 0;

	        	if (body.text.length <= 3) {
	        		sentenceCount = body.text.length;
	        	} else {
	        		sentenceCount = Math.max(3, Math.ceil(body.text.length / 5));
	        	}

	        	var sentences = [];
	        	for(var s in body.text) {
	        		if (body.text[s][1] <= sentenceCount) {
	        			sentences.push(body.text[s][0]);
	        		}
	        	}
	        	
	            callback(sentences.join(' '), null);
	        } else {
	            callback(null, 'Sorry, I didn\'t catch that. Please try again!');
	        }
	    }
	);

}

slackEvents.on('message', (event) => {

	let botRef = '<@' + botID + '>';

	console.log(event);
	if (event.text.startsWith(botRef)) {
		let parsedMsg = event.text.replace(botRef, '');
		getSummary(parsedMsg, function(msg, error) {
			if (error) {
				web.chat.postMessage(event.channel, error, function(err, info) {
					if (err) console.log(err);
				});
			} else {
				web.chat.postMessage(event.channel, msg, function(err, info) {
					if (err) console.log(err);
				});
			}
		})
	}
});


module.exports = {
	'getSummary': getSummary
}
