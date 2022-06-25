const carusel = document.querySelector(".carusel");
const caruselInner = carusel.querySelector(".carusel__inner");

const ITEM_WIDTH = 70;
let items = 55;

let state = 0;
carusel.addEventListener("click", caruselControl);

function caruselControl(e) {
	let element = e.target.parentElement;
	// let items = document.querySelectorAll(".carusel__item")

	if(element.classList.contains("carusel__btn--left")){
		caruselPreve();
	}else if(element.classList.contains("carusel__btn--right")){
		caruselNext();
	}else {
		return;
	}
}

function caruselPreve() {
	let innerLeft = caruselInner.offsetLeft;

	if(innerLeft < 0){
		state--;
		caruselInner.style.left = `-${state * ITEM_WIDTH}px`;
	}
}

function caruselNext() {
	let rightWrapper = carusel.getBoundingClientRect().right;
	let rightInner = caruselInner.getBoundingClientRect().right;
	
	if(rightInner > rightWrapper + ITEM_WIDTH){
		state++;
		caruselInner.style.left = `-${state * ITEM_WIDTH}px`;
	}else {
		return;
	}
}