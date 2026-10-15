
const layingPictures = [
    "kezdolap_fekvo/F1.jpg",
    "kezdolap_fekvo/F2.jpg",
    "kezdolap_fekvo/F3.JPG",
    "kezdolap_fekvo/F4.jpg",
    "kezdolap_fekvo/F5.jpg",
    "kezdolap_fekvo/F6.jpg",
    "kezdolap_fekvo/F7.jpg",
];

const standingPictures = [
    "kezdolap_allo/A1.jpg",
    "kezdolap_allo/A2.jpg",
    "kezdolap_allo/A3.jpg",
    "kezdolap_allo/A4.jpg",
    "kezdolap_allo/A5.jpg",
    "kezdolap_allo/A6.jpg",
    "kezdolap_allo/A7.jpg",

];

const orientation = window.matchMedia("(orientation: portrait)");

const pictureQueues = new Map();
let lastPicture = null;

function shufflePictures(pictures) {
    const shuffledPictures = [...pictures];

    for (let index = shuffledPictures.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledPictures[index], shuffledPictures[randomIndex]] = [
            shuffledPictures[randomIndex],
            shuffledPictures[index]
        ];
    }

    return shuffledPictures;
}

function getNextPicture(pictures) {
    let pictureQueue = pictureQueues.get(pictures);

    if (!pictureQueue || pictureQueue.length === 0) {
        pictureQueue = shufflePictures(pictures);

        if (pictureQueue.length > 1 && pictureQueue[0] === lastPicture) {
            [pictureQueue[0], pictureQueue[1]] = [pictureQueue[1], pictureQueue[0]];
        }

        pictureQueues.set(pictures, pictureQueue);
    }

    lastPicture = pictureQueue.pop();
    return lastPicture;
}

function changePicture(pictureElement, pictures) {
    const nextPicture = getNextPicture(pictures);
    const oldPicture = pictureElement.cloneNode(true);
    const pictureBounds = pictureElement.getBoundingClientRect();
    const nextImage = new Image();

    pictureElement.style.border = "10px solid #efefef";
    pictureElement.style.borderLeft = "0";

    oldPicture.removeAttribute("id");
    oldPicture.className = "picture-fade-overlay";
    oldPicture.style.left = `${pictureBounds.left}px`;
    oldPicture.style.top = `${pictureBounds.top}px`;
    oldPicture.style.width = `${pictureBounds.width}px`;
    oldPicture.style.height = `${pictureBounds.height}px`;
    oldPicture.style.border = "10px solid #efefef";
    oldPicture.style.borderLeft = "0";
    document.body.appendChild(oldPicture);

    nextImage.onload = () => {
        pictureElement.src = nextPicture;
        pictureElement.style.border = "10px solid #efefef";
        pictureElement.style.borderLeft = "0";
        pictureElement.style.opacity = "1";
        oldPicture.style.opacity = "0";

        setTimeout(() => {
            oldPicture.remove();
        }, 2000);
    };

    nextImage.src = nextPicture;
}

function checkOrientation() {
    const standingPicture = document.getElementById("standingpic");
    const layingPicture = document.getElementById("layingpic");

    if (!standingPicture || !layingPicture) {
        return;
    }

    standingPicture.style.display = "none";
    layingPicture.style.display = "none";

    if (orientation.matches) {
        standingPicture.style.display = "block";
        changePicture(standingPicture, standingPictures);
    }
    else{
        layingPicture.style.display = "block";
        changePicture(layingPicture, layingPictures);
    }
}
orientation.addEventListener("change", checkOrientation);

checkOrientation();
setInterval(checkOrientation, 7000);

function historyBack() {
    window.history.back();
}

const pictureDisplay = document.getElementById("pictureDisplay");

if (pictureDisplay) {
    let startX = 0;
    let startScrollLeft = 0;

    pictureDisplay.addEventListener("wheel", (event) => {
        if (orientation.matches) {
            return;
        }

        if (event.deltaY !== 0) {
            event.preventDefault();
            pictureDisplay.scrollLeft += event.deltaY;
        }
    }, { passive: false });

    pictureDisplay.addEventListener("pointerdown", (event) => {
        if (orientation.matches) {
            return;
        }

        startX = event.clientX;
        startScrollLeft = pictureDisplay.scrollLeft;
        pictureDisplay.classList.add("is-dragging");
        pictureDisplay.setPointerCapture(event.pointerId);
        event.preventDefault();
    });

    pictureDisplay.addEventListener("pointermove", (event) => {
        if (orientation.matches) {
            return;
        }

        if (pictureDisplay.hasPointerCapture(event.pointerId)) {
            pictureDisplay.scrollLeft = startScrollLeft - (event.clientX - startX);
        }
    });

    pictureDisplay.addEventListener("pointerup", (event) => {
        if (orientation.matches) {
            return;
        }

        pictureDisplay.classList.remove("is-dragging");
        pictureDisplay.releasePointerCapture(event.pointerId);
    });

    pictureDisplay.addEventListener("pointercancel", (event) => {
        if (orientation.matches) {
            return;
        }

        pictureDisplay.classList.remove("is-dragging");
        pictureDisplay.releasePointerCapture(event.pointerId);
    });
}