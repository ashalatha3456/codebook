import {FEATURED_PRODUCTS} from "./constants.js";
import { loadCopyRightYear, loadProductsToUI } from "./helpers.js";
const featuredBooksLIstEle = document.querySelector('.codebook--featured-books-list')
const faqQuestionElements = document.querySelectorAll('.codebook-faq-question');

faqQuestionElements.forEach(faqQuestionElement=>{
    faqQuestionElement.addEventListener("click",function(){
        this.parentElement.classList.toggle("active")
    })
})
loadProductsToUI(FEATURED_PRODUCTS,featuredBooksLIstEle)
loadCopyRightYear(document.getElementById('copyright-year'));