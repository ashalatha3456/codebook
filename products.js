import { loadCopyRightYear, loadProductsToUI } from "./helpers.js";
import { PRODUCTS_LIST_URL } from "./constants.js";
const productsListEle = document.querySelector('ul.codebook--products-list');
const booksCountEle = document.getElementById('books-count');
const loaderElement = document.querySelector(".loading-container");
const showFiltersBtn = document.getElementById("show-filters");
const closeFiltersBtn = document.getElementById("close-filters");
const filtersContainer = document.querySelector(".codebook--filters-container");
const sortByPriceElements = document.querySelectorAll('input[type="radio"][name="sortByPrice"]');
const filterByRatingElements = document.querySelectorAll('input[type="radio"][name="filterByRating"]');
const filterByCategoryElements = document.querySelectorAll('input[type="checkbox"][name="filterByCategory"]')
const clearFiltersBtn = document.querySelector('.clear-filters');
let PRODUCTS_DATA = [];
let filterCategories = [];
let sortType = null;
let minRating = 1;
filterByCategoryElements.forEach(ele=>{
  ele.addEventListener('change',function(){
    if(this.checked)
      {
        filterCategories.push(this.value)
      }
      else{
        filterCategories = filterCategories.filter(category => category !== this.value);
      }
      applyFilters();
      //filterProductsByCategory(filterCategories);
  });

})
function filterProductsByCategory(categories,collection){
let filteredProducts = collection;
categories.forEach(category => {
 filteredProducts = filteredProducts.filter(product =>product[category] === true) 
})
return filteredProducts;
}
filterByRatingElements.forEach(ele=>{
  ele.addEventListener('change',function(){
    minRating = Number(this.value);
    applyFilters();
    //filterProductsByRating(Number(this.value));
  });

})
sortByPriceElements.forEach(ele=>{
  ele.addEventListener('change',function(){
    sortType = this.value;
    applyFilters();
    //sortProductsByPrice(this.value);
  })

})
showFiltersBtn.addEventListener("click",function(){
filtersContainer.classList.remove('d-none');

});
closeFiltersBtn.addEventListener("click",function(){
  filtersContainer.classList.add('d-none');
});
clearFiltersBtn.addEventListener("click",resetFilters);

function resetFilters(){
  filterCategories=[];
  minRating = 1;
  sortType = null;
  updateUI( PRODUCTS_DATA)
}
function sortProductsByPrice(sortType, collection){
   const sortedData = JSON.parse(JSON.stringify(collection)).sort((a,b)=>{
    if(sortType === "asc")
      {
        return a.price - b.price;
      }
      return b.price - a.price;
   })
   return sortedData;
}
function applyFilters(){
  let results = PRODUCTS_DATA;
  if(sortType) {
    results = sortProductsByPrice(sortType, results);
  }
  if(minRating>1)
    {
      results = filterProductsByRating(minRating,results);
    }
    if(filterCategories.length > 0){
      results = filterProductsByCategory(filterCategories, results);
    }
    updateUI(results);
  }

function filterProductsByRating(rating,collection){
   const filteredData = collection.filter(product=>{
    return product.rating >= rating;
  })
  return filteredData;
}

function updateUI(data){
    booksCountEle.innerText = '';
  if(data && data.length>0){
    booksCountEle.innerText = `(${data?.length})`;
    loadProductsToUI(data,productsListEle);
  }
}
async function fetchProducts(){
     try{
         loaderElement.classList.remove('d-none');
         const response = await fetch(PRODUCTS_LIST_URL)
         const data = await response.json();
         PRODUCTS_DATA = data;
         updateUI(data);
        }
     catch(e){
               console.log(e,"error while fetching");
     }
     finally{
           loaderElement.classList.add('d-none');
     }
}
fetchProducts();
loadCopyRightYear(document.getElementById('copyright-year'));