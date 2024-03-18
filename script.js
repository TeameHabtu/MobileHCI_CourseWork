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
                        if (this.swipeSequence.join(',') === 'right,right,right') {
                            var overlayId = this.el.getAttribute('overlay-id');
                            var overlayImage = document.getElementById(overlayId);
                            if (overlayImage) {
                                overlayImage.setAttribute('visible', true);
                                setTimeout(function () {
                                    overlayImage.setAttribute('visible', false);
                                }, 5000);
                            }
                        } else if (this.swipeSequence.join(',') === 'down,down') {
                            var overlayId = this.el.getAttribute('overlay-id');
                            var overlayImage = document.getElementById(overlayId);
                            if (overlayImage) {
                                overlayImage.setAttribute('visible', true);
                                setTimeout(function () {
                                    overlayImage.setAttribute('visible', false);
                                }, 5000);
                            }
                        }
                    }
                }
            });

            AFRAME.registerComponent('speech-input', {
                init: function () {
                    var el = this.el;
                    var speechInputAttempts = 0;

                    el.addEventListener('konami-code', function () {
                        speechInputAttempts = 0; // Reset the speech input attempts
                        el.emit('speech-ready'); // Trigger speech ready event
                    });

                    el.addEventListener('speech-command', function (event) {
                        var command = event.detail.command;
                        if (command === 'call a friend') {
                            speechInputText.innerText = 'Command recognized: Calling a friend...';
                            // Perform action for the recognized command (e.g., call a friend)
                        } else {
                            speechInputAttempts++;
                            if (speechInputAttempts < 3) {
                                speechInputText.innerText = 'Command not recognized. Try again.';
                            } else {
                                speechInputText.innerText = 'Command not recognized. Time out.';
                                setTimeout(function () {
                                    speechInputText.innerText = 'Speak Now...';
                                    speechInputAttempts = 0; // Reset speech input attempts
                                }, 5000); // Reset after 5 seconds
                            }
                        }
                    });
                }
            });
        });