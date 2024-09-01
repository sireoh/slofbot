/* #region local database */
var firstData = ["noone atm"];
var titlegenData = [];
const micStatus = ["mic ✔ audio ✔", "mic ✗ audio ✔"];
var micStatusIndex = 0;
var artTaxLink = "";
/* #endregion local database */

/* #region importing packages */
const express = require('express');
const session = require('express-session');
const tmi = require('tmi.js');
const axios = require('axios');
const app = express();
require('dotenv').config();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const {
	printWords,
	printEmojis
} = require("./scripts/titlegen.js");

const PORT = 3055;
const PARAMS = new URLSearchParams({
	"response_type" : "code",
	"client_id" : process.env.CLIENT_ID,
	"redirect_uri" : process.env.REDIRECT_URI,
	"scope" : "channel:bot channel:moderate chat:edit chat:read",
  }).toString();

  app.use(session({
	secret: '126139ab-378f-44c8-a529-7ef5dbe55f36',
	resave: false,
	saveUninitialized: false
  }));
/* #endregion importing packages */

/* #region twitch bot connection */
const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: [ process.env.CHANNEL_NAME ]
});

client.connect();
/* #endregion twitch bot connection*/

/* #region routing */
app.get("/", (req, res) => {
  res.redirect(`https://id.twitch.tv/oauth2/authorize?${PARAMS}`);
});

app.get("/token", async (req, res) => {
	try {
		const { code } = req.query;
		const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
			params: {
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				code,
				grant_type: 'authorization_code',
				redirect_uri: process.env.REDIRECT_URI
			}
		});
		const access_token = tokenResponse.data.access_token;
		req.session.code = code;
		req.session.access_token = access_token;
		res.redirect("/auth");
	} catch (error) {
		console.error('Error during authentication:', error);
		res.status(500).send('Error during authentication');
	}
});

app.get("/auth", (req, res) => {
	res.send({
		data: {
		authcode: req.session.code,
		access_token: req.session.access_token,
		}
	});
});

app.get("/first", (req, res) => {
	firstData[0] = req.query.user;
	res.render("first", {data: firstData[0]});
});

app.get("/titlegen", (req, res) => {
	res.render("titlegen", {data: titlegenData[0]});
});

app.get("/micstatus", (req, res) => {
	let i = micStatusIndex;
	res.render("micStatus", {data: micStatus[i]});
});

app.get("/arttax", (req, res) => {
	let img = displayArtTaxLink();
	console.log(img);
	res.render("artTax", {data: img});
});
  
app.listen(PORT, () => {
	console.log("Listening on port: " + PORT + "!");
});
/* #endregion routing */

/* #region commands */
client.on('message', (channel, tags, message, self) => {
	const command = message.toLowerCase();
	if(self) return;

	if(command === 'test') {
		client.say(channel, "test");
	}

	if(command === 'how are u' || command === 'how is eoh' || command === 'how eoh') {
		client.say(channel, `eoh is well froogyComfy CatPat how is ${tags.username}? peepoFriendship`);
	}

	if(command === 'im gaming') {
		client.say(channel, `/me ${tags.username} is really gaming froogyComfy`);
	}

	if(command === '!whofirst') {
		client.say(channel, firstData[0] + " was first froogyBirthday");
	}

	if(command.startsWith('!titlegen')) {
		if(
			tags.badges.broadcaster ||
			tags.username === 'eob0t_'
		) {
			titlegenCmd(channel, command);
		} else {
			console.log(tags);
			client.say(channel, "hey .. you're not eoh 😡");
		}
	}

	if(command.startsWith('!arttax')) {
		if(
			tags.badges.broadcaster ||
			tags.username === 'eob0t_'
		) {
			artTaxCmd(channel, command);
		} else {
			console.log(tags);
			client.say(channel, "hey .. you're not eoh 😡");
		}
	}

	if(command === '!micon' || command === '!toggleon') {
		if(
			tags.badges.broadcaster ||
			tags.username === 'eob0t_'
		) {
			micOn(channel);
		} else {
			console.log(tags);
			client.say(channel, "hey .. you're not eoh 😡");
		}
	}

	if(command === '!micoff' || command === '!toggleoff') {
		if(
			tags.badges.broadcaster ||
			tags.username === 'eob0t_'
		) {
			micOff(channel);
		} else {
			console.log(tags);
			client.say(channel, "hey .. you're not eoh 😡");
		}
	}
});
/* #endregion commands */

/* #region command logic */

function titlegenCmd(channel, message) {
	//Custom Title
	let titlestr = "";
	let arr = message.split(" ");
	if (arr[2]) {
		for (let i = 2; i < arr.length; i++) {
			titlestr += arr[i];
			if (i < arr.length - 1) {
				titlestr += " ";
			}
		}
		titlegenData[1] = titlestr;
	}
	console.log(titlestr);

	/*
	empty: [mic on], and random.
	off: [mic off], and random.
	Option 2: custom.
	*/
	switch(arr[1]) {
		case "off":
			titlegenData[1] = printWords();
			titlegenData[2] = printEmojis();
			titlegenData[0] = "[mic off] " + titlegenData[1] + " "
				+ titlegenData[2];
			client.say(channel, "generated title🖨, with mic-off 🎤❌");
			console.log({
				mode: "off",
				custom: "false",
				data: titlegenData[0]
			});
			micStatusIndex = 1;
			break;
		
		case "toggleoff":
			micOff(channel);
			break;

		case "toggleon":
			micOn(channel);
			break;
		
		case "custom":
			titlegenData[2] = printEmojis();
			titlegenData[0] = "[mic on] " + titlegenData[1] + " "
				+ titlegenData[2];
			client.say(channel, "generated custom title🖨, with mic-on 🎤✅");
			console.log({
				mode: "off",
				custom: "true",
				data: titlegenData[0]
			});
			micStatusIndex = 0;
			break;

		case "customoff":
			titlegenData[2] = printEmojis();
			titlegenData[0] = "[mic off] " + titlegenData[1] + " "
				+ titlegenData[2];
			client.say(channel, "generated custom title🖨, with mic-off 🎤❌");
			console.log({
				mode: "on",
				custom: "true",
				data: titlegenData[0]
			});
			micStatusIndex = 1;
			break;

		case "what":
			client.say(channel, "/me the title is ...");
			client.say(channel, titlegenData[1] + " " + titlegenData[2]);
			break;
		
		case "set":
			client.say(channel, "!settitle " + titlegenData[1] + " "
				+ titlegenData[2]);
			break;

		default:
			titlegenData[1] = printWords();
			titlegenData[2] = printEmojis();
			titlegenData[0] = "[mic on] " + titlegenData[1] + " "
				+ titlegenData[2];
			client.say(channel, "generated title🖨, with mic-on 🎤✅");
			console.log({
				mode: "on",
				custom: "false",
				data: titlegenData[0]
			});
			micStatusIndex = 0;
			break;
	};
}

function artTaxCmd(channel, message) {
	artTaxLink = message.split(" ")[1];
}

function micOn(channel) {
	titlegenData[0] = "[mic on] " + titlegenData[1] + " "
				+ titlegenData[2];
				client.say(channel, `mic is now "on" 🎤✅ in overlay🖨`);
			console.log({
				mode: "off",
				custom: "false",
				data: titlegenData[0]
			});
	micStatusIndex = 0;
}

function micOff(channel) {
	titlegenData[0] = "[mic off] " + titlegenData[1] + " "
				+ titlegenData[2];
				client.say(channel, `mic is now "off" 🎤❌ in overlay🖨`);
			console.log({
				mode: "off",
				custom: "false",
				data: titlegenData[0]
			});
	micStatusIndex = 1;
}

function displayArtTaxLink() {
	return artTaxLink;
}
/* #endregion command logic */