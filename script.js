document.addEventListener('DOMContentLoaded', function () {
    var speechInputText = document.getElementById('speechInputText');
    var overlay = document.getElementById('overlay');
    var talkButton = document.getElementById('talkButton');

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
                speechInputText.innerText = 'Ok! Be ready';
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
                        talkButton.addEventListener('click', handleSwipe);
                    }, 3000);
                }
            }
        }, 2000); // Simulated speech recognition delay
    }

    // Event listener for swipe success and speech command for the talk button
    function handleSwipe() {
        if (!speechInProgress) {
            initializeCamera(); // Initialize camera only when swiping the talk button
            activateSpeechInput();
            // Additional code for speech recognition
            // Display overlay when speech command is recognized
            showOverlay();
        }
    }

    talkButton.addEventListener('click', handleSwipe);

    // Function to display overlay
    function showOverlay() {
        overlay.setAttribute('visible', true);
        setTimeout(function () {
            hideOverlay();
        }, 7000); // Hide overlay after 7 seconds
    }

    // Function to hide overlay
    function hideOverlay() {
        overlay.setAttribute('visible', false);
    }

    // Event listener for swipe gestures for all buttons except the talk button
    var swipeableButtons = document.querySelectorAll('.button.swipeable:not(.talkable)');
    swipeableButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Additional code for swipe gesture
            showOverlay();
        });
    });
});
