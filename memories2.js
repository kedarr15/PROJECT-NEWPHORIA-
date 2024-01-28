document.getElementById("imageForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission
    let name = document.getElementById("name").value;
    let description = document.getElementById("description").value;
    let file = document.getElementById("image").files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function() {
            // Resize image before displaying
            let img = new Image();
            img.onload = function() {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");

                // Define maximum dimensions for resized image
                let maxWidth = 300;
                let maxHeight = 300;

                let width = img.width;
                let height = img.height;

                // Calculate new dimensions to maintain aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                // Resize image
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Display the resized image along with name and description
                let resizedImg = document.createElement("img");
                resizedImg.src = canvas.toDataURL();
                resizedImg.alt = name;
                let caption = document.createElement("figcaption");
                caption.textContent = `${name}: ${description}`;
                let deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", function() {
                    deleteImage(resizedImg); // Delete the image when the button is clicked
                });
                let figure = document.createElement("figure");
                figure.appendChild(resizedImg);
                figure.appendChild(caption);
                figure.appendChild(deleteButton);
                document.getElementById("imageGallery").appendChild(figure);
                
                // Save data to local storage
                let imageData = {
                    name: name,
                    description: description,
                    dataURL: resizedImg.src
                };
                saveImageData(imageData);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});

// Function to save image data to local storage
function saveImageData(imageData) {
    let images = JSON.parse(localStorage.getItem("images")) || [];
    images.push(imageData);
    localStorage.setItem("images", JSON.stringify(images));
}

// Function to delete an image
function deleteImage(imgElement) {
    let images = JSON.parse(localStorage.getItem("images")) || [];
    let index = -1;
    // Find the index of the image data to be deleted
    images.forEach(function(imageData, i) {
        if (imageData.dataURL === imgElement.src) {
            index = i;
            return;
        }
    });
    if (index !== -1) {
        // Remove the image data from local storage
        images.splice(index, 1);
        localStorage.setItem("images", JSON.stringify(images));
        // Remove the image from the gallery
        imgElement.parentNode.parentNode.removeChild(imgElement.parentNode);
    }
}

// Function to display images from local storage
function displayImages() {
    let images = JSON.parse(localStorage.getItem("images")) || [];
    let gallery = document.getElementById("imageGallery");
    
    images.forEach(function(imageData) {
        let resizedImg = document.createElement("img");
        resizedImg.src = imageData.dataURL;
        resizedImg.alt = imageData.name;
        let caption = document.createElement("figcaption");
        caption.textContent = `${imageData.name}: ${imageData.description}`;
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            deleteImage(resizedImg); // Delete the image when the button is clicked
        });
        
        let figure = document.createElement("figure");
        figure.appendChild(resizedImg);
        figure.appendChild(caption);
        figure.appendChild(deleteButton);
        
        gallery.appendChild(figure);
    });
}

// Load and display existing images when the page loads
displayImages();