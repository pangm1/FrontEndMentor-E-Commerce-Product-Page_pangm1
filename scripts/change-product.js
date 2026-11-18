// console.log(document);
// console.log('ChangeProduct');

const container = document.querySelector('main > .container');
const product = container.querySelector('header h2');
const productCompany = container.querySelector('header p');
const productDescription = container.querySelector('& > p');
const productCurrentCost = container.querySelector('.cost .current .value');
const productDiscount = container.querySelector('.cost .discount .value');
const productOriginalCost = container.querySelector('.cost .original .value');
const galleryImageList = document.getElementById('gallery-images');
const lightboxImageList = document.getElementById('lightbox-images');

const list = [container, product, productCompany, productDescription, productCurrentCost, productDiscount, productOriginalCost, galleryImageList, lightboxImageList];

const folderName = 'product1';

// console.log(list);

const result = fetch(`./data/${folderName}/data.json`).then(response => response.json()).then(data => {
    // console.log(data);

    product.textContent = data['product'];
    productCompany.textContent = data['company'];
    productDescription.textContent = data['description'];
    productDiscount.textContent = data['discountPercentage'] + '%';
    productOriginalCost.textContent = data['originalCost'];
    productCurrentCost.textContent = calculateCost(data['originalCost'], parseFloat(data['discountPercentage']));

    const images = data['images'];
    // console.log(images);

    const imageElements = createImageElements(images);
    // console.log(imageElements);
    imageElements[0].setAttribute('aria-selected', 'true');

    replaceImages(galleryImageList, imageElements);
    replaceImages(lightboxImageList, imageElements);

    return true;
}).catch(error => console.error('Error loading JSON:', error));


function calculateCost(original, discount) {
    const cost = parseFloat(original.substring(1));
    // console.log(cost, discount);
    return original[0] + (cost * discount / 100.00).toFixed(2);
}

/* 
    <li style="--full-image: url('../images/image-product-1.jpg');" aria-selected="true" tabindex="0">
        <img src="./images/image-product-1-thumbnail.jpg" alt="">
    </li>
*/
function createImageElements(images) {
    return images.map((image) => {
        const li = document.createElement('li');
        li.style = `--full-image: url('../${image['fullSize']}')`;
        li.tabIndex = '0';
        const img = document.createElement('img');
        img.src = image['thumbnail'];
        img.alt = '';
        li.appendChild(img);
        return li;
    });
}

function replaceImages(imageList, images) {
    imageList.replaceChildren(...images.map((element) => { return element.cloneNode(true) }));
}

// console.log(result);
export default await result;