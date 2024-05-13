import { MAX_RATING } from "./constants.js";
function getProductRatings(rating)
{
      const filledStarts = rating;
      const unfilledStars = MAX_RATING - rating;
      let result = '';
      for(let i=1;i<=filledStarts;i++)
      {
        result+='<span class="bi bi-star-fill text-warning me-1"></span>'

      }
      for(let i=1;i<=unfilledStars;i++)
      {
        result+='<span class="bi bi-star text-warning me-1"></span>'
      }
      return result;
    }

export function loadProductsToUI(products,uiContainer)
{
    uiContainer.innerHTML='';
    products.forEach((product,index) => {
        const productcardHTML=` <li class="codebook--book-card">
        <article>
        ${product['best_seller'] ? '<div class="best-seller-tag">Best Seller </div>' :''}
           
           <img class="img img-fluid product-img" 
           src='${product.poster}' 
           alt='${product.name}'/>
           <div class="codebook-book-details p-3">
           <h2 class="product-title">${product.name}</h2>
            <p>${product.overview}</p>
            <div class="product-ratings">
           
            ${getProductRatings(product.rating)}
            </div>
           
            <div class="d-flex align-items-center">
                <span>$${product.price}</span>
                <button class="btn btn-primary ms-auto">Add to Cart +</button>
            </div>
            </div>
           </article>
     </li>`
     uiContainer.innerHTML += productcardHTML;
    });
}

export function loadCopyRightYear(ele)
{
  const currentYear = new Date().getFullYear();
  ele.innerText = currentYear;
}