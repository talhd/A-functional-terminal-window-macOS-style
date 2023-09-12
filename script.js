const window_box = document.getElementById('window');
const title_bar = document.getElementById('title_bar');
const close_button = document.getElementById('close button');
const zoom_button = document.getElementById('zoom');
const minimize_button = document.getElementById('minimize');
const content = document.getElementById('content_box');
const flashingLine = document.getElementById("flashing_line");
let old_top = "0%";
let old_left = "0%";
let old_height = "0%";
let old_width = "0%";
let isMZoomed = false;
let isMinimized = false;
window.onload = () => {
    document.getElementById("current_date").textContent = new Date().toLocaleString();
};

function toggleFlashingLine() {
    flashingLine.toggleAttribute('hidden');
}

function dragElement(elmnt) {
    title_bar.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        if (parseInt(elmnt.style.top) != 0 && parseInt(elmnt.style.left) != 0 && parseInt(elmnt.style.borderRadius) != 8) {
            elmnt.style.borderRadius = "8px";
            content.style.borderRadius = "0px 0px 8px 8px"
            elmnt.style.height = "50%";
            elmnt.style.width = "50%";
            isMZoomed = false;
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function setWindowSize(width, height, top, left, borderRadius) {
    window_box.style.transition = "width 0.3s ease-in-out, height 0.3s ease-in-out, left 0.3s ease-in-out,top 0.3s ease-in-out";
    window_box.style.borderRadius = borderRadius + "px"
    window_box.style.width = width;
    window_box.style.height = height;
    window_box.style.top = top;
    window_box.style.left = left;
}

function handleTransitionEnd(event) {
    if (event.propertyName === 'width') {
        window_box.style.transition = "width 0.3s ease-in-out, height 0.3s ease-in-out";
    }
}
setInterval(toggleFlashingLine, 500);
dragElement(window_box);
close_button.onclick = function() {
    window_box.remove();
}
zoom_button.onclick = function() {
    if (!isMZoomed) {
        old_top = window_box.style.top;
        old_left = window_box.style.left;
        setWindowSize("100%", "100%", "0%", "0%", 0);
        window_box.addEventListener("transitionend", handleTransitionEnd);
        content.style.borderRadius = "0px"
        isMZoomed = true;
    } else {
        setWindowSize("50%", "50%", old_top, old_left, 8);
        window_box.addEventListener("transitionend", handleTransitionEnd);
        content.style.borderRadius = "0px 0px 8px 8px"
        isMZoomed = false;
    }
};

function returnWindowToPlace() {
    if (isMinimized) {
        window_box.style.transition = "width 0.3s ease-in-out, height 0.3s ease-in-out, left 0.3s ease-in-out,top 0.3s ease-in-out";
        if (!isMZoomed) {
            window_box.style.borderRadius = "8px";
        }
        [window_box.style.top, window_box.style.left, window_box.style.height, window_box.style.width] = get_old_values();
        content.toggleAttribute('hidden');
        document.querySelectorAll('.circle').forEach((element) => {
            element.toggleAttribute('hidden');
        });
        window_box.addEventListener("transitionend", (e) => {
            window_box.style.transition = "width 0.2s ease-in-out, height 0.2s ease-in-out";
        }, {
            once: true
        });
        isMinimized = false;
    }
}
minimize_button.onclick = function() {
    if (!isMinimized) {
        content.toggleAttribute('hidden');
        document.querySelectorAll('.circle').forEach((element) => {
            element.toggleAttribute('hidden');
        });
        window_box.style.transition = "width 0.3s ease-in-out, height 0.3s ease-in-out, left 0.3s ease-in-out,top 0.3s ease-in-out";
        save_old_values(getComputedStyle(window_box).top, getComputedStyle(window_box).left, getComputedStyle(window_box).height, getComputedStyle(window_box).width);
        window_box.style.top = "95%";
        window_box.style.left = "0%";
        window_box.style.height = "5%";
        window_box.style.width = "20%";
        window_box.style.borderRadius = "0";
        isMinimized = true;
        window_box.addEventListener("click", returnWindowToPlace, {
            once: true
        });
        event.stopPropagation();
    }
};

function save_old_values(top, left, height, width) {
    old_top = top;
    old_left = left;
    old_height = height;
    old_width = width;
}

function get_old_values() {
    return [old_top, old_left, old_height, old_width];
}
