import { isAuthorized } from "./utilities/auth.js";
import { loadGlobalHeaderFooter,initializeSearch } from "./utilities/helpers.js";
import {fetchOrdersFromServer} from "./utilities/services.js";
const loaderElement = document.querySelector('.loading-container');
const ordersListElement = document.getElementById('codebook-orders-list');
async function fetchUserOrders() {

    try{
        loaderElement.classList.remove("d-none");
         const userInfo = JSON.parse(localStorage.getItem('userInfo'));
         const token = isAuthorized();
         const ordersData = await fetchOrdersFromServer(userInfo.userId,token);
         const ordersList = [];
        for(const Key in ordersData)
        {
            ordersList.push(ordersData[Key]);

        }
        renderOrderDataToUI(ordersList);
        
    }
    catch(e){
       ordersListElement.innerText ='sorry unable to fetch orders';
       ordersListElement.style.color = 'red';
       
        console.log("error fetching orders",e.message);
    }
    finally{
        loaderElement.classList.add("d-none");
    }
}
function renderOrderDataToUI(orderList)

{
    if(orderList.length===0){
        ordersListElement.innerText = "No orders placed for this user"
    }
    else{
        
    
    ordersListElement.innerHTML='';
    orderList.forEach(order=>{
        const orderInfoHTML = `<li class="codebook-order-item mb-4">
        <header class="codebook-order-header d-flex justify-content-between">
             <strong>order id:${order.orderId}</strong>
             <strong>Total:${order.orderTotal}</strong>
        </header>
        <ul class="codebook-order-item-products-list ps-0 my-2" type="none">
        ${order.orderItems.map((orderItem)=>{ 
            return `<li class="codebook-order-item-product-item d-flex gap-2 mb-3">
                  <div class="product-img">
                   <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=650&q=40" alt="image">
                  </div>
                  <div class="product-info">
                      <p class="product-title mb-0">Basic to advanced in react</p>
                      <p class="product-info mb-0">$29</p>
                    </div>
             </li>
             <li class="codebook-order-item-product-item d-flex gap-2 mb-3">
                <div class="product-img">
                 <img src="${orderItem.productImg} alt="${orderItem.productName}">
                </div>
                <div class="product-info">
                    <p class="product-title mb-0">${orderItem.productName}</p>
                    <p class="product-info mb-0">${orderItem.productPrice}</p>
                  </div>
           </li>
                                   
            `
        })}    
                      
        </ul>
    </li>
    `
    ordersListElement.innerHTML+=orderInfoHTML;
    })

    }

}

(function init(){
    loadGlobalHeaderFooter();
    initializeSearch(true);
    fetchUserOrders();
})()