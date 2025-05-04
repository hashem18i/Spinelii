// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Define segment colors to cycle through
    const segmentColors = ['#FFD700', '#FF6347', '#ADFF2F', '#40E0D0', '#EE82EE', '#6A5ACD'];
    let colorIndex = 3; // Start index based on initial segments below

    // Define the wheel configuration
    let theWheel = new Winwheel({
        'canvasId'    : 'spinelliCanvas', // ID of the canvas element
        'numSegments' : 3,              // Initial number of names
        'outerRadius' : 180,            // Radius of the wheel
        'innerRadius' : 30,             // Makes the wheel look like a donut (optional)
        'textFontSize': 16,             // Font size for segment text
        'textFontFamily': 'Arial, sans-serif',
        'textFillStyle': '#333333',     // Darker text color for better contrast
        'lineWidth'   : 1,              // Segment outline width
        'strokeStyle' : '#666666',      // Segment outline color
        'pointerAngle': 0,              // Angle of the pointer if drawn by Winwheel (usually 0 or 90)
        'segments'    :, 'text' : 'Alice'},
           {'fillStyle' : segmentColors, 'text' : 'Bob'},
           {'fillStyle' : segmentColors, 'text' : 'Charlie'}
        ],
        'animation' : {
            'type'     : 'spinToStop',       // Animation type: spins and stops
            'duration' : 8,                // Duration of the spin animation in seconds
            'spins'    : 10,               // Number of times the wheel spins
            'callbackFinished' : alertPrize, // Function to call after spinning stops
            'easing'   : 'Power4.easeOut'  // Example easing (requires GSAP TweenMax.js) - remove if not using GSAP
            // 'callbackSound' : playSound, // Optional: Function for tick sounds 
            // 'soundTrigger'  : 'pin'      // Optional: Trigger sound on pins (requires pins config) 
        },
        'pins' : {                      // Optional: Add pins like Wheel of Fortune 
            'number'     : 16,          // Number of pins
            'fillStyle'  : 'silver',
            'strokeStyle': 'black',
            'strokeWidth': 1,
            'outerRadius': 4,
        }
    });

    // Optional: Load GSAP library if using easing (place script tag in HTML)
    // <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js'></script>

    // Optional: Function to play tick sound 
    // let tickAudio = new Audio('path/to/tick.mp3'); // Load the sound file
    // function playSound(){
    //     tickAudio.pause();
    //     tickAudio.currentTime = 0;
    //     tickAudio.play();
    // }

    // Get references to HTML elements
    const spinButton = document.getElementById('spinButton');
    const resultDisplay = document.getElementById('resultDisplay');
    const nameInput = document.getElementById('nameInput');
    const addButton = document.getElementById('addButton');
    const removeButton = document.getElementById('removeButton');

    // --- Functionality Implementation (Spin, Add, Remove) ---

    // Implement Spin Functionality
    spinButton.addEventListener('click', () => {
      // Ensure there are at least 2 segments to make spinning meaningful
      if (theWheel.numSegments >= 2) {
         // Reset result display and disable button before starting animation
         resultDisplay.textContent = 'Spinning...';
         spinButton.disabled = true;
         theWheel.startAnimation();
      } else {
         alert("Please add at least two names to the wheel!");
      }
    });

    // Callback function executed when the wheel stops spinning
    function alertPrize(indicatedSegment) {
        // indicatedSegment is an object containing details of the winning segment
        resultDisplay.innerHTML = `Winner is: <strong style="color: ${indicatedSegment.fillStyle}; background-color: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 3px;">${indicatedSegment.text}</strong>! 🎉`;
        spinButton.disabled = false; // Re-enable the spin button
    }

    // Implement Adding Names Dynamically
    addButton.addEventListener('click', () => {
        const newName = nameInput.value.trim(); // Get and trim the input value
        if (newName) { // Check if the name is not empty
            // Add the new segment to the wheel
            theWheel.addSegment({
                'text'      : newName,
                'fillStyle' : segmentColors[colorIndex % segmentColors.length] // Cycle through colors
            }); // Adds to the end by default

            colorIndex++; // Increment color index for the next addition
            theWheel.draw(); // IMPORTANT: Redraw the wheel to show the new segment 
            nameInput.value = ''; // Clear the input field
            nameInput.focus(); // Set focus back to input for easy multi-add
        } else {
            alert("Please enter a name."); // Alert if input is empty
        }
    });

    // Allow adding names by pressing Enter in the input field
    nameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if applicable
            addButton.click(); // Trigger the add button's click event
        }
    });

    // Implement Removing Names Dynamically
    removeButton.addEventListener('click', () => {
        // Only allow removal if there are more than 1 segments
        if (theWheel.numSegments > 1) {
            theWheel.deleteSegment(); // Removes the *last* segment added by default 
            theWheel.draw(); // IMPORTANT: Redraw the wheel to reflect the removal 
            colorIndex--; // Decrement color index (optional, keeps color cycle consistent)
        } else {
            alert("Cannot remove the last name."); // Prevent removing the final segment
        }
    });

}); // End DOMContentLoaded listener
