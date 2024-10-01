const originalorder = [
    'block1' , 'block2' , 'block3' , 'block4' , 
    'block5' , 'block6' , 'block7' , 'block8' , 'block9'
];

window.onload = function (){
    let parent = document.getElementById('drag')
    let frag = document.createDocumentFragment()
   
    while (parent.children.length){
        frag.appendChild(parent.children[Math.floor (Math.random() * parent.children.length)])
    }
    
    parent.appendChild(frag)

    document.getElementById('resetButton').onclick = function() {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }

        for (let id of originalorder) {
            const newDiv = document.createElement('div')
            newDiv.className = 'dragbox'
            newDiv.innerHTML = `<div class="images" draggable="true" id=${id} style="--img:url('images/${id.split('block')[1]}.png');"></div>`
            parent.appendChild(newDiv)
        }
    };

    const images = document.querySelectorAll('.images')
    const dropbox = document.getElementById('dropbox')

    images.forEach(image => {
        image.addEventListener('dragstart' , dragStart);
        
    }

};
