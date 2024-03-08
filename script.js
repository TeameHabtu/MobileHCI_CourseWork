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
            var recognitionTimeout;

            el.addEventListener('swipe-success', function (event) {
                // Display overlay when swipe is successful
                showOverlay();
            });

            el.addEventListener('speech-command', function (event) {
                // Recognize speech command
                clearTimeout(recognitionTimeout);
                var command = event.detail.command;
                speechInputText.innerText = 'Recognized Command: ' + command;
                // Hide overlay after command recognition
                hideOverlay();
            });

            el.addEventListener('speech-ready', function (event) {
                speechInputText.innerText = 'Speak Now...';
            });

            el.addEventListener('speech-not-recognized', function (event) {
                // Handle speech not recognized
                recognitionTimeout = setTimeout(function () {
                    hideOverlay();
                }, 7000);
                speechInputText.innerText = 'Speech Not Recognized. Try Again.';
            });

            el.addEventListener('touchstart', function(event){
                // Hide overlay on touch
                clearTimeout(recognitionTimeout);
                hideOverlay();
            });
        }
    });

    function showOverlay() {
        overlay.setAttribute('visible', true);
    }

    function hideOverlay() {
        overlay.setAttribute('visible', false);
    }
});
