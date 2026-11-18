import result from './change-product.js';

try {
    // console.log(result);
    if (!result) {
        throw error;
    }
} catch {
    console.error('Could not fetch module');
}

// console.log('start main');

// console.log(document);

//*** Image Gallery ***//
const mobilePrevious = document.querySelector(".mobile .prev-icon");
const mobileNext = document.querySelector(".mobile .next-icon");
const mobileGallery = document.getElementById("mobile-gallery");
const desktopGallery = document.getElementById("desktop-gallery");
const galleryImages = document.getElementById("gallery-images");

const lightboxPrevious = document.querySelector(".desktop .prev-icon");
const lightboxNext = document.querySelector(".desktop .next-icon");
const lightboxGallery = document.getElementById("lightbox-gallery");
const lightboxImages = document.getElementById("lightbox-images");

// const list = [mobilePrevious, mobileNext, mobileGallery, desktopGallery, galleryImages, lightboxPrevious, lightboxNext, lightboxGallery, lightboxImages];

// console.log(list);

// mobile gallery only controlled by arrows
connectGallery(mobileGallery, galleryImages, true, [mobilePrevious, mobileNext]);
// desktop gallery only controlled by clicking on image list
connectGallery(desktopGallery, galleryImages, false);
// lightbox controlled by both
connectGallery(lightboxGallery, lightboxImages, true, [lightboxPrevious, lightboxNext]);
connectGallery(lightboxGallery, lightboxImages, false);

// connect click handlers to number inputs
// connect number inputs to list

// lightbox images are a copy of galleryimages, but their functionality is not tied to each other (mutually exclusive)

function connectGallery(gallery, imageList, isArrows, options = []) { // [prev, next], or nothing
    const images = Array.from(imageList.children);

    gallery.addEventListener('input', updateImageList(imageList));
    gallery.setAttribute("max", images.length - 1);
    if (isArrows) {
        options[0].addEventListener('click', stepGallery(gallery, false));
        options[1].addEventListener('click', stepGallery(gallery, true));
    }
    else {
        images.forEach((item, index) => {
            const handler = (event) => {
                // console.log("Selected image", index);
                gallery.value = index;
                
                gallery.dispatchEvent(new Event('input', { bubbles: true }));
            };
            
            item.addEventListener('click', handler);
            item.addEventListener('keydown', (event) => {
                if (event.code === 'Space' || event.code === 'Enter') {
                    handler.call(event);
                }
            })
        });
    }
}

function updateImageList(imageList) {
    return (event) => {
        // console.log("stepGallery", imageList, event.target.valueAsNumber);
        const targetImage = event.target.valueAsNumber;
        const images = Array.from(imageList.children);
        images.forEach((item, index) => {
            if (index === targetImage) {
                item.setAttribute('aria-selected', true);
            }
            else {
                item.removeAttribute('aria-selected');
            }
        });
    }
}

function stepGallery(gallery, increment) {
    return (event) => {
        // console.log(gallery, "+", increment, gallery.valueAsNumber);
        const galleryMax = parseInt(gallery.max) + 1;
        gallery.value = gallery.valueAsNumber + (increment ? 1 : -1);
        if (gallery.valueAsNumber < 0) {
            gallery.valueAsNumber += galleryMax;
        }
        gallery.value = gallery.valueAsNumber % galleryMax;
        // console.log(gallery, "+", increment, gallery.valueAsNumber);

        gallery.dispatchEvent(new Event('input', {bubbles: true}));
    }
}

///*** Cart ***//
const productForm = document.forms['product'];
const quantityMinus = productForm.getElementsByClassName('minus-icon')[0];
const quantityPlus = productForm.getElementsByClassName('plus-icon')[0];
const quantity = productForm.elements['quantity'];

const productTitle = document.querySelector('.container h2.product').textContent;
const productCost = document.querySelector('.container .cost .current .value').textContent;
const productThumbnail = document.getElementById('gallery-images').querySelector(':first-child img');

const cartList = document.getElementById('cart').querySelector('ul');

// const list = [productForm, quantityMinus, quantityPlus, quantity, productTitle, productCost, productThumbnail];

// console.log(list);


quantityMinus.addEventListener('click', (event) => {
    event.preventDefault();
    quantity.stepDown();
    quantity.dispatchEvent(new Event('input', { bubbles: true }));
});
quantityPlus.addEventListener('click', (event) => {
    event.preventDefault();
    quantity.stepUp();
    quantity.dispatchEvent(new Event('input', { bubbles: true }));
});

productForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // console.log('submit');

    try {
        if (quantity.valueAsNumber < 1) {
            throw new Error();
        }

        const newItem = createCartItem(productTitle, productCost, quantity.valueAsNumber, productThumbnail.src);

        cartList.appendChild(newItem);

        reorderCart();
    }
    catch(error) {
    }
});

reorderCart();

/* add as child of cart ul
<li class="" data-item="" data-quantity="3">
    <div class="container">
        <img src="./images/image-product-1-thumbnail.jpg" alt="">
    </div>
    <p class="product" id="item1">
        Fall Limited Edition Sneakers
    </p>
    <p>
        <span class="cost">$125.00</span> &times; <span class="quantity">3</span>
    </p>
    <p class="">
        <span class="total">$375.00</span>
    </p>
    <button type="button" class="svg-button delete-icon" aria-describedby="item1">
        Delete
    </button>
</li>
*/
// do not create if quantity is invalid (0, ?)
function createCartItem(productText, costText, quantity, thumbnailImage) {
    const newItem = document.createElement('li');
    // console.log(productText, costText, quantity, thumbnailImage);

    const thumbnail = document.createElement('img');
    thumbnail.src = thumbnailImage;
    thumbnail.alt = '';
    // console.log(thumbnail);
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('svg-button', 'delete-icon');
    deleteButton.innerText = 'Delete';
    // console.log(deleteButton);
    // const container = document.createElement('div');
    // container.classList.add('container');
    // const img = productThumbnail.cloneNode();
    newItem.innerHTML = `<div class="container">
        ${thumbnail.outerHTML}
    </div>
    <p class="product">
        ${productText}
    </p>
    <p>
        <span class="cost">${costText}</span> &times; <span class="quantity">${quantity}</span>
    </p>
    <p class="">
        <span class="total">${multiplyCurrency(costText, quantity)}</span>
    </p>`;

    newItem.appendChild(deleteButton);

    return newItem;
}

function multiplyCurrency(costText, quantity) {
    const [symbol, cost] = [costText[0], parseFloat(costText.substring(1))];
    return symbol + (cost * quantity).toFixed(2);
}


function reorderCart() {
    // console.log(cartList.children);
    const cartItems = Array.from(cartList.children);
    cartItems.forEach((item, index) => {
        const product = item.querySelector('.product');
        const newID = 'cartItem' + index;

        const deleteButton = item.querySelector('.svg-button.delete-icon');
        // console.log('deleteButton', deleteButton);

        const deleteItem = () => {
            // console.log('delete', item);
            item.outerHTML = '';
            reorderCart();
        };

        product.id = newID;
        deleteButton.setAttribute('aria-describedby', product.id);
        deleteButton.addEventListener('click', deleteItem);
    });
};