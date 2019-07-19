var tmi = require('tmi.js');
var sleep = require('sleep');
const player = require('play-sound')()
var color;
var selectedColor;
var Gpio = require('pigpio').Gpio;
redLed = new Gpio(17, {mode: Gpio.OUTPUT}),
  redDutyCycle = 0,
  greenLed = new Gpio(22, {mode: Gpio.OUTPUT}),
  greenDutyCycle = 128,
  blueLed = new Gpio(24, {mode: Gpio.OUTPUT}),
  blueDutyCycle = 0;

var options = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: 'vtcodsworthbot',
		password: require('./oauth')
	},
	channels: ["vegasvault"]
};

var vvOptions = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: 'vtcodsworthbot',
		password: require('./oauthVV')
	},
	channels: ["vegasvault"]
};

var colors = (require('./colors'));
var off ={
		"name": "off",
		"rgb": [0, 0, 0,]
	};
var client = new tmi.client(options);
client.connect();
var vvClient = new tmi.client(vvOptions);
vvClient.connect();

function cycleRainbow()
{
 var colorIndex = ["red", "orange", "yellow", "green", "blue", "purple", "indigo" ];
 for(var j = 0; j < 3; j++)
 {
 	for (var i = 0; i < colorIndex.length; i++){

 		displayColor(colors[colors.map(function (myIndex) {return myIndex.name;}).indexOf(colorIndex[i])]);
 		sleep.msleep(250); 
 	}


 }
displayColor(colors[colors.map(function (myIndex) {return myIndex.name;}).indexOf(colorIndex[0])]);
}

function bubbEmoteVip()
{
	bubbSound();
	sleep.msleep(400);
	redLed.pwmWrite(12);
	greenLed.pwmWrite(20);
	blueLed.pwmWrite(60);

	for(var j = 0; j < 4; j++)
	{
	for (var i = 255; i > 0; i--){
		redLed.pwmWrite(i);
		sleep.msleep(5);
	}
	for (var i = 0; i < 255; i++){
		redLed.pwmWrite(i);
		sleep.msleep(5);
	}
}
	for(var i = 255; i >12; i--){
		redLed.pwmWrite(i);
		sleep.msleep(7);
	}
}

function stormEmoteVip()
{
	stormSound();
	sleep.msleep(400);
	colorIndex = ["yellow", "white", "deepskyblue"];
	for(var i = 0; i < 2; i++){
	displayColor(colors[colors.map(function (myIndex) {return myIndex.name;}).indexOf(colorIndex[0])]);
	sleep.msleep(100);
	displayColor(off);
	sleep.msleep(75);
	displayColor(colors[colors.map(function (myIndex) {return myIndex.name;}).indexOf(colorIndex[0])]);
	sleep.msleep(125);
	displayColor(off);
	sleep.msleep(120);
	displayColor(colors[colors.map(function (myIndex) {return myIndex.name;}).indexOf(colorIndex[1])]);
	sleep.msleep(150);
}
	fadeColorFromOff(colors[colors.map(function (myIndex) {return myIndex.name;}).indexOf(colorIndex[2])], 1500);
}

function displayColor(selectedColor){

	redDutyCycle = selectedColor.rgb[0];
	greenDutyCycle = selectedColor.rgb[1];
	blueDutyCycle = selectedColor.rgb[2];
	redLed.pwmWrite(redDutyCycle);
	greenLed.pwmWrite(greenDutyCycle);
	blueLed.pwmWrite(blueDutyCycle);
}


function fadeToColor(selectedColor, fadeTime){
	var redFadeTick = (redDutyCycle - selectedColor.rgb[0]) / 255;
	var greenFadeTick = (greenDutyCycle - selectedColor.rgb[1]) / 255;
	var blueFadeTick = (blueDutyCycle - selectedColor.rgb[2]) / 255;



	for(var i = 0; i < 255; i++){
		redDutyCycle -= redFadeTick;
		greenDutyCycle -= greenFadeTick;
		blueDutyCycle -= blueFadeTick;
		console.log(redDutyCycle);
		redLed.pwmWrite(Math.floor(redDutyCycle));
		console.log(greenDutyCycle);
		greenLed.pwmWrite(Math.floor(greenDutyCycle));
		console.log(blueDutyCycle);
		blueLed.pwmWrite(Math.floor(blueDutyCycle));
		sleep.msleep(Math.floor(fadeTime/255));
	}
		redDutyCycle = selectedColor.rgb[0];
		greenDutyCycle = selectedColor.rgb[1];
		blueDutyCycle = selectedColor.rgb[2];
		redLed.pwmWrite(Math.floor(redDutyCycle));
		greenLed.pwmWrite(Math.floor(greenDutyCycle));
		blueLed.pwmWrite(Math.floor(blueDutyCycle));

}

function fadeColorFromOff(selectedColor, fadeTime){
	
	displayColor(off);
	sleep.msleep(100);
	var redFadeTick = selectedColor.rgb[0] / 255;
	var greenFadeTick = selectedColor.rgb[1] / 255
	var blueFadeTick = selectedColor.rgb[2] / 255

for(var i = 0; i < 255; i++){
	redLed.pwmWrite(Math.floor(redFadeTick * i));
	greenLed.pwmWrite(Math.floor(greenFadeTick * i));
	blueLed.pwmWrite(Math.floor(blueFadeTick * i));
	sleep.msleep(Math.floor(fadeTime/255));
}
	redLed.pwmWrite(selectedColor.rgb[0]);
	greenLed.pwmWrite(selectedColor.rgb[1]);
	blueLed.pwmWrite(selectedColor.rgb[2]);
}

vvClient.on("hosted", function(channel, username, viewers, autohost){
	//do your thang
	//vape would go here.
	 raidSound();
	 sleep.msleep(200);
	console.log(username + "is hosting you do some crap");
	redLed.pwmWrite(255);
	greenLed.pwmWrite(0);
	blueLed.pwmWrite(0);

	for(var j = 0; j < 4; j++)
	{
	for (var i = 255; i > 0; i--){
		redLed.pwmWrite(i);
		sleep.msleep(5);
	}
	for (var i = 0; i < 255; i++){
		redLed.pwmWrite(i);
		sleep.msleep(5);
	}
}

});

client.on('chat', function(channel, user, message, self){	
	//color list command
	if (message.toLowerCase() === "!colors"){
		var availableColors  = "The available colors are: " + colors[0].name;
		for (var i = 1; i < colors.length; i++){
			availableColors += ", " + colors[i].name;
		}
		console.log(availableColors)
		client.action("vegasvault", availableColors);
	}

//fade command 
	if(user.username === "streamelements" && message.includes("used fade")){
		color = message.split(" ")[3];
		var selectedColor;
		for (var i = 0; i < colors.length; i++){

				if (colors[i].name === color.toLowerCase()){
					selectedColor = colors[i];
				}
			}
		if (typeof(selectedColor) == 'undefined') {
			client.action("vegasvault", "Color: " + color + " is undefined so you get white.")
			selectedColor = colors[colors.map(function (myIndex) {return myIndex.name;}).indexOf("white")];
			}
		fadeToColor(selectedColor, 1500);	
}


	//strobe command 
	if(user.username === "streamelements" && message.includes("used strobe")){
		color = message.split(" ")[3];
		var selectedColor;
		for (var i = 0; i < colors.length; i++){

				if (colors[i].name === color.toLowerCase()){
					selectedColor = colors[i];
				}
			}
		if (typeof(selectedColor) == 'undefined') {
			client.action("vegasvault", "Color: " + color + " is undefined so you get white.")
			selectedColor = colors[colors.map(function (myIndex) {return myIndex.name;}).indexOf("white")];
			}
			
		for (var i = 0; i < 10; i++)
		{
		displayColor(off);
		sleep.msleep(75);
		displayColor(selectedColor);
		sleep.msleep(75);
	}

}

	//vip commands
	if(user.username === "vegasvault" && message.includes("calmbeEmote")){
		stormEmoteVip();
	}
	if(user.username === "calmbeforethestorm" && message.includes("calmbeEmote")){
		stormEmoteVip();
	}

	if(user.username === "bubbthenub" && message.includes("bubbthNUBS")){
		bubbEmoteVip();
	}
	if(user.username === "vegasvault" && message.includes("bubbthNUBS")){
		bubbEmoteVip();
	}

	//Miss America
	try{	
		if(user.username === "streamelements" && message.includes("voted for Miss America!")){
			for(var i = 0; i < 3; i++)
			{
				redLed.pwmWrite(128);
				greenLed.pwmWrite(0);
				blueLed.pwmWrite(0);
				sleep.msleep(400);
				redLed.pwmWrite(255);
				greenLed.pwmWrite(255);
				blueLed.pwmWrite(135);
				sleep.msleep(400);
				redLed.pwmWrite(0);
				greenLed.pwmWrite(0);
				blueLed.pwmWrite(128);
				sleep.msleep(400);
			}
		}
	}
	catch(e){
		console.log(e);
	}

	//flash command
	try{	
		if(user.username === "streamelements" && (message.includes("used flash") || message.includes("used command custom"))){
			color = message.split(" ")[3];
			//check to see if color is a speical case
			switch(color.toLowerCase()){
				case "rainbow":
				cycleRainbow();
				break;
				case "mint":
				displayMint();
				break;
				case "custom":
				console.log(true);
				if(message.split(" ")[4] < 25 && message.split(" ")[5] < 25 && message.split(" ")[6] < 25){
					client.action("vegasvault", "One color must be above intensity 25!");
				}
				else{
				redLed.pwmWrite(message.split(" ")[4]);
				greenLed.pwmWrite(message.split(" ")[5]);
				blueLed.pwmWrite(message.split(" ")[6]);
			}
				break;
				default:
				for (var i = 0; i < colors.length; i++){

				if (colors[i].name === color.toLowerCase()){
					selectedColor = colors[i];
					displayColor(selectedColor);
				}
			}
			}
		}
	}
	catch(e){
	console.log(e);
	}
});

function stormSound() {
    console.log('playing sound');
    player.play('./sfx/Storm.mp3', (err) => {
        if (err) console.log(`Could not play sound: ${err}`);
    });
}

function bubbSound(){
	console.log('playing sound');
    player.play('./sfx/datass.mp3', (err) => {
        if (err) console.log(`Could not play sound: ${err}`);
    });	
}

function raidSound() {
    console.log('playing sound');
    player.play('./sfx/raid_alert.mp3', (err) => {
        if (err) console.log(`Could not play sound: ${err}`);
    });
}

function displayMint(){
client.action("vegasvault", "This color was discovered by Fireturret!");
				for (var i = 0; i < colors.length; i++){
					if (colors[i].name === color.toLowerCase()){
					selectedColor = colors[i];
					displayColor(selectedColor);
				}
			}
}
//find a way to trigger OBS sound
