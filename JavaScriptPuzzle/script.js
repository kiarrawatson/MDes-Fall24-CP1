let draggedElement = null;

function shufflePuzzle() {
    let parent = document.getElementById('drag');
    let frag = document.createDocumentFragment();

    while (parent.children.length) {
        frag.appendChild(parent.children[Math.floor(Math.random() * parent.children.length)]);
    }

    parent.appendChild(frag);
}

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.images');
    const dragboxes = document.querySelectorAll('.dragbox');

    images.forEach(image => {
        image.addEventListener('dragstart', (event) => {
            draggedElement = event.target;
            event.target.style.opacity = 0.5;
            setTimeout(() => {
                event.target.style.display = "none";  
            }, 0);
        });

        image.addEventListener('dragend', (event) => {
            event.target.style.opacity = "";
            event.target.style.display = "";  
            draggedElement = null; 
        });
    });

    dragboxes.forEach(dragbox => {
        dragbox.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        dragbox.addEventListener('drop', (event) => {
            event.preventDefault();
            
            const targetBox = event.currentTarget.querySelector('.images');
            
            if (draggedElement && targetBox) {
                const draggedParent = draggedElement.parentElement;
                const targetParent = targetBox.parentElement;

                draggedParent.appendChild(targetBox);
                targetParent.appendChild(draggedElement);
            }
        });
    });
});

window.onload = shufflePuzzle;

document.getElementById('shuffleButton').addEventListener('click', shufflePuzzle);