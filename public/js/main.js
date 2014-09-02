'use strict';

var owl = $('.owl-carousel'),
    errorDiv = $('#error');

// setup and start our carousel
owl.owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:5
        }
    }
});

// check if our browser is chrome
var isChrome = navigator.userAgent.match(/chrome/i);

// only proceed if we are on chrome
if (isChrome) {

	if (!('webkitSpeechRecognition' in window)) {
	    upgrade();
	} else {

        var processingCommand = false,
            recognizer = new webkitSpeechRecognition();

        /**
         * Speak voice message to the user
         * @param  {string} command Command to execute
         * @return {void}         
         */
        var voiceMsg = function(command) {
            var voiceSpeak = new SpeechSynthesisUtterance('I didn\'t understand your last request. Available commands are next and back. Please try again.');
            voiceSpeak.lang = 'en-US';
            voiceSpeak.pitch = 1;
            voiceSpeak.rate = 1;
            voiceSpeak.voice = voices[10];
            voiceSpeak.voiceURI = 'native';
            voiceSpeak.volume = 1;
            speechSynthesis.speak(voiceSpeak);
            
            // listen to onend event
            // voiceSpeak.onend = function(e) {
                
            // };
        };

        /**
         * Process every command that is sent by speech recognition
         * @param  {string}   command     Command to process
         * @param  {Function} callback    [description]
         * @return {[type]}               [description]
         */
        var slideLoop = function(command, callback) {

            if (!processingCommand) return;

            if (typeof(command) === 'undefined') return;

            switch(command) {
                // voice sometimes adds space before words, so check or trim
                case 'next':
                case ' next':
                    processingCommand = true;
                    owl.trigger('next.owl.carousel');
                    break;

                case 'back':
                case ' back':
                    processingCommand = true;
                    owl.trigger('prev.owl.carousel');
                    break;

                default:
                    processingCommand = true;
                    voiceMsg(command);
            }
            if (callback) callback();
        };

        recognizer.continuous = true;

        recognizer.lang = ['English', ['en-US', 'United States']];

        // We return final strings which take longer than non-final but are more accurate
        recognizer.interimResults = true;

        // when we get a result, process it
        recognizer.onresult = function(e) {
            // set variable
            var interim_transcript = '';
            if (e.results.length) {
                for (var i = event.resultIndex; i < event.results.length; i++) {
                    interim_transcript = event.results[i][0].transcript;

                    // remove spaces from results 
                    interim_transcript = interim_transcript.trim();
                    // if the slide isn't moving, allow commands to be sent down
                    if (!processingCommand) {
                        slideLoop(interim_transcript, function() {
                            // set small delay before accepting next command
                            setTimeout(function(){
                                processingCommand = false;
                            }, 200);
                        });
                    }
                }
            }

            console.log(e);
        };

        // on error event, log our error
        recognizer.onerror = function(e) {
            // TODO:: Display error message to the user
            console.log(e.error);
        };

        // start speech recognition
        recognizer.start();
    }
}