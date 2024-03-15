document.addEventListener('DOMContentLoaded', function () {
    var speechInputText = document.getElementById('speechInputText');
    var overlay = document.getElementById('overlay');
    var talkableButton = document.querySelector('.button.talkable');
    var swipeableButtons = document.querySelectorAll('.button.swipeable');

    // Define a flag to track if the camera has been initialized
    var cameraInitialized = false;

    // Define a flag to track if speech input is in progress
    var speechInProgress = false;

    // Define a counter to track the number of speech recognition trials
    var speechTrials = 0;

    // Function to initialize the camera or AR.js
    function initializeCamera() {
        if (!cameraInitialized) {
            // Initialize the camera or AR.js here
            cameraInitialized = true;
        }
    }

    // Function to activate speech input interface
    function activateSpeechInput() {
        speechInProgress = true;
        speechInputText.innerText = 'Waiting for speech...';
        // Simulate speech recognition process
        setTimeout(function() {
            var recognized = Math.random() < 0.5; // Simulate recognition
            if (recognized) {
                speechInputText.innerText = 'Recognized';
            } else {
                speechTrials++;
                if (speechTrials < 3) {
                    speechInputText.innerText = 'Try again';
                } else {
                    speechInputText.innerText = 'No more trials allowed';
                    // Reset speech input state after timeout
                    setTimeout(function() {
                        speechInProgress = false;
                        speechTrials = 0;
                        talkableButton.addEventListener('click', handleSpeechSwipe);
                    }, 3000);
                }
            }
        }, 2000); // Simulated speech recognition delay
    }

    // Event listener for swipe success and speech command for the talkableButton
    function handleSpeechSwipe() {
        if (!speechInProgress) {
            initializeCamera();
            activateSpeechInput();
            // Additional code for speech recognition
            // Display overlay when speech command is recognized
            showOverlay();
        }
    }

    talkableButton.addEventListener('click', handleSpeechSwipe);

    // Event listener for swipe gestures only for the other buttons
    swipeableButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Additional code for swipe gesture
            showOverlay();
        });
    });

    // Rest of the code...
});
