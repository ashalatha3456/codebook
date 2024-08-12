import { getCartItems } from "./cart.js";
import { isAuthorized } from "./utilities/auth.js";

import { loadGlobalHeaderFooter,initializeSearch } from "./utilities/helpers.js";
import { saveOrderToUserAccount, saveUserCart } from "./utilities/services.js";
const loadingContainer = document.querySelector('.loading-container');
const orderConfirmationEle = document.querySelector('.codebook-order-confirmation');
const orderFailureEle = document.querySelector('.codebook-order-failure');
async function handlePostPaymentSteps(orderId)
{
    try{
           loadingContainer.classList.remove('d-none');
           const cartItems = getCartItems();
           const token = isAuthorized();
           const userInfo  = JSON.parse(localStorage.getItem('userInfo'));
           localStorage.removeItem('cart');
           const orderInfo = {
            orderId:orderId,
            orderTotal:cartItems.reduce((acc,cur) => {
                return acc+Number(cur.productPrice)
            },0),
              orderItems:cartItems
           }
          
           await saveUserCart(userInfo.userId,token,null);
           await saveOrderToUserAccount(userInfo.userId,orderId,token,orderInfo);
           showConfirmationDetails(orderId);
         //  localStorage.removeItem('cart');
    }
    catch(e)
    {
       console.log("order processing failed", e.message);
        orderFailureEle.classList.remove('d-none');
    }
    finally{
        loadingContainer.classList.add('d-none');
        const miniCartCountEle = document.getElementById('minicart--count')
        miniCartCountEle.innerText = 0;
        localStorage.removeItem('cart');
        sessionStorage.removeItem('orderRefId');
        
    }
}

function showConfirmationDetails(orderId)
{
        orderConfirmationEle.classList.remove('d-none')
        
        const userEmailEle = document.getElementById('userEmail');
        const orderIdEle = document.getElementById('orderId');
        const userNameEle = document.getElementById('username');
        const userInfo  = JSON.parse(localStorage.getItem('userInfo'));
        orderIdEle.innerText = orderId;
        userEmailEle.innerText = userInfo.email;
        userNameEle.innerText = userInfo.name;
       
      
}
function validateOrderRefIdPopulateDetails()
{
   
    const orderRefId = new URLSearchParams(window.location.search).get("orderRefId");
    const storedRefId = sessionStorage.getItem("orderRefId");
    if(orderRefId && storedRefId)
    {
       const isValidRefId = dcodeIO.bcrypt.compareSync(orderRefId,storedRefId);
    if(isValidRefId)
    {
        handlePostPaymentSteps(orderRefId);
       
        
    }
    
    else{
        console.log("redirection because of not matching")
         window.location.href="/"
    }
}
    else{
        console.log("redirection because of refid is not there")
        window.location.href="/"
    }

}

(function init(){
   loadGlobalHeaderFooter();
   initializeSearch(true);
   validateOrderRefIdPopulateDetails();

})()
