document.addEventListener('DOMContentLoaded', function () {
    var speechInputText = document.getElementById('speechInputText');
    var overlay = document.getElementById('overlay');
    var speechButton = document.getElementById('speechButton');
    var swipeableButtons = document.querySelectorAll('.button.swipeable');

    var speechRecognition;

    // Function to start speech recognition
    function startSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            speechRecognition = new webkitSpeechRecognition();
            speechRecognition.lang = 'en-US';
            speechRecognition.onresult = function(event) {
                var result = event.results[0][0].transcript;
                handleSpeechRecognition(result);
            };
            speechRecognition.start();
            speechInputText.innerText = 'Listening...';
        } else {
            console.error('Speech recognition is not supported in this browser.');
        }
    }

    // Function to handle speech recognition result
    function handleSpeechRecognition(result) {
        speechInputText.innerText = 'Speech Recognized: ' + result;
        // Handle the recognized speech here
    }

    // Event listener for speech button
    speechButton.addEventListener('click', function() {
        startSpeechRecognition();
    });

    // Event listener for swipe gestures for all buttons
    swipeableButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Additional code for swipe gesture
            showOverlay();
        });
    });

    // Function to show overlay
    function showOverlay() {
        overlay.setAttribute('visible', true);
        setTimeout(function () {
            overlay.setAttribute('visible', false);
        }, 7000); // Hide overlay after 7 seconds
    }
});
