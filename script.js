document.addEventListener('DOMContentLoaded', function () {
    var speechInputText = document.getElementById('speechInputText');
    var overlay = document.getElementById('overlay');

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

    AFRAME.registerComponent('speech-overlay', {
        init: function () {
            var el = this.el;
            var speechTrials = 0;
            var recognitionTimeout;

            el.addEventListener('speech-command', function (event) {
                clearTimeout(recognitionTimeout);
                var command = event.detail.command;
                speechInputText.innerText = 'Recognized Command: ' + command;
                showOverlay(); // Display overlay when speech command is recognized
            });

            el.addEventListener('speech-ready', function (event) {
                speechInputText.innerText = 'Speak Now...';
            });

            el.addEventListener('speech-not-recognized', function (event) {
                speechTrials++;
                if (speechTrials < 3) {
                    speechInputText.innerText = 'Try Again';
                } else {
                    recognitionTimeout = setTimeout(function () {
                        hideOverlay();
                        el.removeAttribute('speech-overlay');
                    }, 7000);
                    el.removeAttribute('speech-overlay');
                    el.removeAttribute('gesture-detector');
                    showAllButtons();
                }
            });

            el.addEventListener('swipe-success', function (event) {
                speechInputText.innerText = 'Swiped! Speech Input Fellows';
                setTimeout(function () {
                    el.setAttribute('speech-overlay', '');
                    speechTrials = 0;
                }, 1000);
            });

            el.addEventListener('touchstart', function(event){
                clearTimeout(recognitionTimeout);
                hideOverlay();
            });
        }
    });

    function showOverlay() {
        overlay.setAttribute('visible', true);
        setTimeout(function () {
            hideOverlay();
        }, 7000); // Hide overlay after 7 seconds
    }

    function hideOverlay() {
        overlay.setAttribute('visible', false);
    }

    function showAllButtons() {
        var buttons = document.querySelectorAll('.button');
        buttons.forEach(function(button) {
            button.setAttribute('visible', true);
        });
    }
});
