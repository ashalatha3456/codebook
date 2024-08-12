import {FEATURED_PRODUCTS} from "./utilities/constants.js";
import { loadProductsToUI, initializeSearch, loadGlobalHeaderFooter } from "./utilities/helpers.js";
const featuredBooksLIstEle = document.querySelector('.codebook--featured-books-list')
const faqQuestionElements = document.querySelectorAll('.codebook-faq-question');

(function init(){
    loadGlobalHeaderFooter();
    loadProductsToUI(FEATURED_PRODUCTS,featuredBooksLIstEle)
    // loadCopyRightYear(document.getElementById('copyright-year'));
    initializeSearch(true);
}())
faqQuestionElements.forEach(faqQuestionElement=>{
    faqQuestionElement.addEventListener("click",function(){
        this.parentElement.classList.toggle("active")
    })
})

