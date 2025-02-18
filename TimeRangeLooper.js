// ==UserScript==
// @name          TimeRangeLooper
// @version       0.0.0
// @description   Lets you loop media through an start time to an end time.
// @author        Ervum
// @match         *://*/*
// ==/UserScript==



(function() {
    'use strict';


    
    let ApplyButtonClickListener;

    let SavedTimeRange;

    let StartInput;
    let EndInput;
    let ApplyButton;

    let VideoURL;
    let Videos;

    let Start;
    let End;


    
    setTimeout(() => {
        function SetCurrentTime(Input) {
            const PlayingVideo = Array.from(Videos).find((Video) => !(Video.paused));

            if (PlayingVideo) {
                Input.value = PlayingVideo.currentTime;
            } else {
                Input.value = 0;
            }

            ApplyTimeRange();
        }

        Videos = Array.from(document.getElementsByTagName('video'));

        if ((Videos.length) === 0) {
            return;
        }

        VideoURL = (window.location.href);
        SavedTimeRange = JSON.parse(localStorage.getItem(VideoURL));

        StartInput = CreateInput('Start', SavedTimeRange ? (SavedTimeRange.Start) : '');
        EndInput = CreateInput('End', SavedTimeRange ? (SavedTimeRange.End) : '');

        ApplyButton = CreateButton(SavedTimeRange ? 'Re-apply' : 'Apply', ApplyTimeRange);
        const SetStartButton = CreateButton('Set current time as start', () => {
            SetCurrentTime(StartInput);
        });
        const SetEndButton = CreateButton('Set current time as end', () => {
            SetCurrentTime(EndInput);
        });

        if (IsDarkMode()) {
            StyleControlsForDarkMode(StartInput, EndInput, ApplyButton, SetStartButton, SetEndButton);
        }

        const ControlsContainer = CreateControlsContainer([SetStartButton, StartInput, ApplyButton, EndInput, SetEndButton]);
        document.body.appendChild(ControlsContainer);

        ApplyTimeRange();

        function StyleControlsForDarkMode(...Elements) {
            for (const Element of Elements) {
                Element.style.backgroundColor = 'black';
                Element.style.color = 'white';
            }
        }

        function CreateControlsContainer(Children) {
            const Container = document.createElement('div');
            Container.style.position = 'absolute';
            Container.style.top = '95%';
            Container.style.left = '50%';
            Container.style.transform = 'translate(-50%, 0%)';
            Container.style.display = 'flex';
            Container.style.alignItems = 'center';
            Container.style.zIndex = '9999';
            Container.style.position = 'fixed';

            Children.forEach((Child) => Container.appendChild(Child));

            return Container;
        }
    }, 500);

    function IsDarkMode() {
        return (window.matchMedia) && (window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    function CreateButton(Text, OnClickFunction) {
        const Button = document.createElement('button');

        Button.innerText = Text;
        Button.style.cursor = 'pointer';
        Button.style.width = '8vw';
        Button.style.marginRight = '1vw';
        Button.style.marginLeft = '1vw';
        Button.style.borderRadius = '1vh';
        Button.style.fontWeight = 'bold';
        Button.style.textAlign = 'center';
        Button.style.border = '0.1vh solid #fff';
        Button.classList.add('click-animation');
        Button.onclick = OnClickFunction;

        return Button;
    }

    function CreateInput(PlaceHolder, Value) {
        const Input = document.createElement('input');

        Input.type = 'text';
        Input.placeholder = PlaceHolder;
        Input.style.width = '6vw';
        Input.style.marginRight = '1vw';
        Input.style.marginLeft = '1vw';
        Input.style.borderRadius = '1vh';
        Input.style.textAlign = 'center';
        Input.style.border = '0.1vh solid #fff';
        Input.style.margin = '0.5vh';
        Input.classList.add('click-animation');
        Input.value = Value;

        return Input;
    }

    function ApplyTimeRange() {
        Start = parseFloat(StartInput.value);
        End = parseFloat(EndInput.value);

        if (!isNaN(Start) && !isNaN(End)) {
            Videos.forEach((Video) => {
                localStorage.setItem(VideoURL, JSON.stringify({ Start: Start, End: End }));
                Video.setAttribute('loop', '');

                ApplyButtonClickListener = function() {
                    if ((Video.currentTime) < Start || (Video.currentTime) > End) {
                        Video.currentTime = Start;
                    }
                };

                if (SavedTimeRange) {
                    ApplyButton.innerText = 'Re-applied';
                } else {
                    ApplyButton.innerText = 'Applied';
                }

                Video.addEventListener('timeupdate', ApplyButtonClickListener);
                Video.currentTime = Start;

                setTimeout(() => {
                    ApplyButton.innerText = 'Re-apply';
                }, 500);
            });
        }
    }
})();



const Style = document.createElement('style');
Style.innerHTML = `
    .click-animation {
        transition: all 0.2s;
    }

    .click-animation:hover {
        transform: scale(1.1);
    }

    .click-animation:active {
        transform: scale(0.9);
    }
`;



document.head.appendChild(Style);
