document.addEventListener('DOMContentLoaded', function () {
    var speechInputText = document.getElementById('speechInputText');
    var arScene = document.getElementById('arScene');
    var speechInputText = document.getElementById('speechInputText');
    var overlay = document.getElementById('overlay');
    

  

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
        }
        // Additional code for speech recognition
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
    var swipeableButtons = document.querySelectorAll('.button.swipeable');
    swipeableButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Additional code for swipe gesture
            showOverlay();
        });
    });

    // Gesture detector component for swipeable buttons
    AFRAME.registerComponent('gesture-detector', {
        schema: {
            swipeDistance: { default: 0.25 },
            swipeDirection: { default: 'right' }
        },
        init: function() {
            this.startPosition = { x: 0, y: 0 };
            this.touchStartHandler = this.touchStartHandler.bind(this);
            this.touchEndHandler = this.touchEndHandler.bind(this);
            this.swipeSequence = []; // Array to store swipe sequence
            this.el.addEventListener('touchstart', this.touchStartHandler);
            this.el.addEventListener('touchend', this.touchEndHandler);
        },
        touchStartHandler: function(event) {
            this.startPosition.x = event.touches[0].pageX;
            this.startPosition.y = event.touches[0].pageY;
        },
        touchEndHandler: function(event) {
            var endX = event.changedTouches[0].pageX;
            var endY = event.changedTouches[0].pageY;
            var deltaX = endX - this.startPosition.x;
            var deltaY = endY - this.startPosition.y;
            var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            var swipeDirection = this.data.swipeDirection;
            
            if (distance > this.data.swipeDistance * window.innerWidth) {
                if (swipeDirection === 'down' && deltaY > 0) {
                    // Swipe Down
                    this.el.emit('swipe-success');
                } else if (swipeDirection === 'right' && deltaX > 0) {
                    // Swipe Right
                    this.el.emit('swipe-success');
                }
            }
        }
    });
});
