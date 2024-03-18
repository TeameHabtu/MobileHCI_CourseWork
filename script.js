document.addEventListener('DOMContentLoaded', function () {
    var speechInputText = document.getElementById('speechInputText');
    var overlay = document.getElementById('overlay');

    AFRAME.registerComponent('gesture-detector', {
        schema: {
            swipeDistance: { default: 0.25 }
        },
        init: function() {
            this.startPosition = { x: 0, y: 0 };
            this.touchStartHandler = this.touchStartHandler.bind(this);
            this.touchEndHandler = this.touchEndHandler.bind(this);
            this.swipeSequence = [];
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
            if (distance > this.data.swipeDistance * window.innerWidth) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) {
                        this.swipeSequence.push('right');
                    } else {
                        this.swipeSequence.push('left');
                    }
                } else {
                    if (deltaY > 0) {
                        this.swipeSequence.push('down');
                    } else {
                        this.swipeSequence.push('up');
                    }
                }
                if (this.swipeSequence.join(',') === 'right,right,right,right,up,down') {
                    this.el.emit('konami-code');
                    this.swipeSequence = [];
                }
            }
        }
    });

    AFRAME.registerComponent('speech-overlay', {
        init: function () {
            var el = this.el;

            el.addEventListener('speech-command', function (event) {
                var command = event.detail.command;
                speechInputText.innerText = 'Recognized Command: ' + command;
                showOverlay();
            });

            el.addEventListener('speech-ready', function (event) {
                speechInputText.innerText = 'Speak Now...';
            });

            el.addEventListener('speech-not-recognized', function (event) {
                speechInputText.innerText = 'Speech Not Recognized';
            });

            el.addEventListener('touchstart', function(event){
                hideOverlay();
            });
        }
    });

    function showOverlay(buttonId) {
        var imageElement = document.getElementById(buttonId);
        if (imageElement) {
            imageElement.style.display = "block"; // Show the image
            setTimeout(function () {
                hideOverlay(buttonId); // Hide the image after a certain duration
            }, 5000);
        }
    }

    function hideOverlay(buttonId) {
        var imageElement = document.getElementById(buttonId);
        if (imageElement) {
            imageElement.style.display = "none"; // Hide the image
        }
    }
});
