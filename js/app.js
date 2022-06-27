const carusel = document.querySelector(".carusel");
const caruselInner = carusel.querySelector(".carusel__inner");
const contents  = document.querySelector(".contents");
const searchBtn = document.querySelector(".search__btn");
const navLogo = document.querySelector(".navbar__logo");
const search = document.querySelector(".search");

const ITEM_WIDTH = 70;
let state = 0;

searchBtn.addEventListener("click", addInput);
carusel.addEventListener("click", caruselControl);


function addInput(e) {
	let inputValue = e.currentTarget.previousElementSibling;

	if(!inputValue.value){
		if(!navLogo.classList.contains("hidden")){
			navLogo.classList.add("hidden");
			search.classList.remove("hidden");
		}else {
			search.classList.add("hidden");
			navLogo.classList.remove("hidden");
		}
	}else {
		getMealSearch(inputValue.value);
	}
}

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
	}
}

getMealRandom();
async function getMealRandom() {
	const URL = "https://www.themealdb.com/api/json/v1/1/random.php";

	try {
		const randomMeal = await fetch(URL);
		let data = await randomMeal.json();
		addMeal(data.meals, true);
	}catch (e) {
		console.log(e.message)
	}
}

async function getMealById(id) {
	const URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;

	try {
		const mealById = await fetch(URL);
		let data = await mealById.json();

		addStoryMeal(data.meals[0]);
	}catch (e) {
		console.log(e.message);
	}
}

async function getMealSearch(trim){
	const URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + trim;

	try {
		const searchMeal = await fetch(URL);
		let data = await searchMeal.json();

		addMeal(data.meals);
	}catch (e){
		console.log(e.message);
	}
}
function addStoryMeal(mealData){
	let carusel__items = document.querySelector(".carusel__items");
	let li = document.createElement("li");
	li.classList.add("carusel__item");
	li.dataset.id = mealData.idMeal;

	li.innerHTML = `
                <a href="#" class="carusel__link">
                	<span class="carusel__clear">
                		<i class="fas fa-close"></i>
                	</span>
                    <div class="carusel__img">
                        <img src="${mealData.strMealThumb}" alt="">
                    </div>
                    <span class="carusel__name">${mealData.strMeal}</span>
                </a>
		`;

	carusel__items.appendChild(li)
	let btns = document.querySelectorAll(".carusel__clear");
	btns.forEach(btn =>{
		btn.addEventListener("click",(e)=>{
		let li = e.currentTarget.parentElement.parentElement;
		removeEL(li.dataset.id);
		removeLS(li.dataset.id);

		document.querySelectorAll(".meel__btn").forEach(btn => {
			if (li.dataset.id === btn.parentElement.parentElement.parentElement.dataset.id) {
				if(btn.classList.contains("active")){
				btn.classList.remove("active")
			}
			}
		})
	})
	})
}
function addMeal(mealData, random=false){
	let meal = mealData.map(data => {
		return `<li class="item" data-id='${data.idMeal}'>
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
    let like = document.querySelectorAll(".meel__btn");
    addBtnEvent(like);
}

function addBtnEvent(like){
	like.forEach(element => {
		element.addEventListener("click",isLike);
	})
}

function isLike(e) {
	let btn = e.currentTarget;
	let parnt = e.currentTarget.parentElement.parentElement.parentElement;
	btn.classList.toggle("active");

	if(!btn.classList.contains('active')){
		removeLS(parnt.dataset.id);
		removeEL(parnt.dataset.id);
	}else {
		addLS(parnt.dataset.id);
		getMealById(parnt.dataset.id);
	}
}

function getLS(){
	let data = localStorage.getItem("mealData");
	data = data ? JSON.parse(localStorage.getItem("mealData")) : [];

	return data;
}

function addLS(id,) {
	let data = getLS();

	let obj = {
		id: id
	}

	data.push(obj);

	localStorage.setItem("mealData",JSON.stringify(data));
}
function removeEL(id) {
	let carusel__items = document.querySelector(".carusel__items");
	let childEl = carusel__items.children;
	for (let i = 0; i < childEl.length; i++){
		if(childEl[i].dataset.id == id){
			childEl[i].remove();
		}
	}
}
function removeLS(id) {
	let data = getLS();

	data = data.filter(mealId=> {
		if (mealId.id != id) {
			return mealId;
		}
	})

	localStorage.setItem("mealData",JSON.stringify(data));
}
getLSEL();
function getLSEL() {
	let data = getLS();

	data.forEach(item => {
		getMealById(item.id);
	})
}
