const carusel = document.querySelector(".carusel");
const caruselInner = carusel.querySelector(".carusel__inner");
const contents  = document.querySelector(".contents");

const ITEM_WIDTH = 70;
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
getMealRandom();
async function getMealRandom() {
	const URL = "https://www.themealdb.com/api/json/v1/1/random.php";

	const randomMeal = await fetch(URL);
	let data = await randomMeal.json();

	addMeal(data.meals, true);
}

async function getMealById(id) {
	const URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;

	const mealById = await fetch(URL);
	let data = await mealById.json();
}

async function getMealSearch(trim){
	const URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + trim;

	const searchMeal = await fetch(URL);
	let data = await searchMeal.json();

	console.log(data)
}

function addMeal(mealData, random=false){
	let meal = mealData.map(data => {
		return `<li class="item">
                    <div class="meel">
                        <div class="meel__head">
                            <img src="${data.strMealThumb}" alt="">
                            ${random? '<span class="meel__disc">Random Meal</span>' : ""}
                        </div>
                        <div class="meel__body">
                            <h3 class="meel__name">${data.strMeal}</h3>
                            <button type="button" class="meel__btn">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </li>`;
	}).join("");

    contents.innerHTML = meal;
}