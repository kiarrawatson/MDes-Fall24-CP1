let draggedElement = null;

// Shuffle Puzzle Function
function shufflePuzzle() {
    let parent = document.getElementById('drag');
    let frag = document.createDocumentFragment();

    while (parent.children.length) {
        frag.appendChild(parent.children[Math.floor(Math.random() * parent.children.length)]);
    }

    parent.appendChild(frag);
}

// Drag and Drop Events
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.images');
    const dragboxes = document.querySelectorAll('.dragbox');

    // Handle the start of the drag
    images.forEach(image => {
        image.addEventListener('dragstart', (event) => {
            draggedElement = event.target;
            event.target.style.opacity = 0.5;
            setTimeout(() => {
                event.target.style.display = "none";  // Hide dragged element temporarily
            }, 0);
        });

        image.addEventListener('dragend', (event) => {
            event.target.style.opacity = "";
            event.target.style.display = "";  // Restore visibility of the dragged element
            draggedElement = null;  // Reset dragged element
        });
    });

    // Allow dragboxes to accept dropped items and handle swapping
    dragboxes.forEach(dragbox => {
        dragbox.addEventListener('dragover', (event) => {
            event.preventDefault(); // Necessary to allow a drop
        });

        dragbox.addEventListener('drop', (event) => {
            event.preventDefault();
            
            const targetBox = event.currentTarget.querySelector('.images');
            
            if (draggedElement && targetBox) {
                // Swap the elements if both dragged element and target exist
                const draggedParent = draggedElement.parentElement;
                const targetParent = targetBox.parentElement;

                // Swap the pieces by appending them to each other's parents
                draggedParent.appendChild(targetBox);
                targetParent.appendChild(draggedElement);
            } else if (draggedElement && !targetBox) {
                // If the target box is empty, simply append the dragged element
                event.currentTarget.appendChild(draggedElement);
            }
        });
    });
});

// Shuffle the puzzle when the page loads
window.onload = shufflePuzzle;

// Add event listener to shuffle the puzzle when the button is clicked
document.getElementById('shuffleButton').addEventListener('click', shufflePuzzle);
