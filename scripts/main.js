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