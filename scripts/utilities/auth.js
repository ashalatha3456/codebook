import { makeSereverRequest,saveUserCart,getCartFromServer} from "./services.js";
import { CREATE_NEW_USER_API, LOGIN_PATH, SIGN_IN_USER_API, UPDATE_USER_API, REFRESH_USER_API } from "./constants.js";
import { getCookie, setCookie, deleteCookie } from "./cookies.js";
import { getCartItems } from "../cart.js";
import { showToastMessage } from "./helpers.js";
export async function createOrSignInUser(isCreate,name,email,password)
{
    const payload = {
        email:email,
        password:password,
        returnSecureToken:true
    }
    const options = {
        method:"POST",
        body:JSON.stringify(payload)
    }
    try{
      const url = isCreate ? CREATE_NEW_USER_API : SIGN_IN_USER_API
      const response = await makeSereverRequest(url,options);   
      let updateResponse = null;
      if(isCreate)
        {
            const updatePayload = {
                idToken:response.idToken,
                displayName:name,
                returnSecureToken:true
            }
            const updateOptions = {
                method:"POST",
                body:JSON.stringify(updatePayload)
            }
             updateResponse = await makeSereverRequest(UPDATE_USER_API,updateOptions);
        }
           
        const finalServerResponse = updateResponse ?? response;
        finalServerResponse.idToken = response.idToken;
        finalServerResponse.refreshToken = response.refreshToken;
        if(isCreate)
        {
            await syncLocalCartToServer(finalServerResponse);
        }
        else{
            await handleExistingUserCart(finalServerResponse);
        }
        saveLoginInfo(finalServerResponse);

    }
    catch(er){
       throw er;
    }
    
}
async function syncLocalCartToServer(loginInfo)
{
   const cartItems = getCartItems();//local stroage
   if(cartItems.length > 0)
   {
      await saveUserCart(loginInfo.localId,loginInfo.idToken,cartItems)
   }

}
async function handleExistingUserCart(loginInfo)
{
   const localCart = getCartItems();
   const serverCart = await getCartFromServer(loginInfo.localId,loginInfo.idToken)|| [];
   if(serverCart.length>0 && localCart.length===0)
   {
    localStorage.setItem("cart",JSON.stringify(serverCart));
   }
   else if(localCart.length>0 && serverCart.length===0)
   {
    await syncLocalCartToServer(loginInfo);
   }
   else if(localCart.length > 0 && serverCart.length > 0)
   {
     const mergedCart = localCart.concat(serverCart);
     const productId = mergedCart.map(cartItem=>cartItem.productId);
     const uniqueIds = [...new Set(productId)];
     const finalCart = [];
     uniqueIds.forEach(id=>{
         const  cartItem = mergedCart.find(tmpCartItem =>tmpCartItem.productId === id);
         if(cartItem)
         {
            finalCart.push(cartItem);
         }
     })
     localStorage.setItem('cart',JSON.stringify(finalCart));
     await saveUserCart(loginInfo.localId,loginInfo.idToken, finalCart)
   }
}
function saveLoginInfo(loginInfo) {
    const { displayName, email, idToken, refreshToken, expiresIn, localId } = loginInfo;
    const userInfo = {
        name: displayName,
        email: email,
        userId: localId
    }
    // console.log(loginInfo,"logininfo")
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    const idTokenExpirationTime = new Date();
    const tokenTime = idTokenExpirationTime.getTime() + (parseInt(expiresIn) * 1000);
    idTokenExpirationTime.setTime(tokenTime);

    // idTokenExpirationTime.setDate(idTokenExpirationTime.getDate() + 1);
    console.log("idToken exporation time", idTokenExpirationTime);
    const refreshTokenExpirationTime = new Date();
    refreshTokenExpirationTime.setFullYear(refreshTokenExpirationTime.getFullYear() + 1);
    setCookie({
        name: '_idToken',
        value: idToken,
        expirationTime: idTokenExpirationTime.toUTCString()
    })
    setCookie({
        name: '_refreshToken',
        value: refreshToken,
        expirationTime: refreshTokenExpirationTime
    })
}
export function clearUserInfo()
{
    localStorage.clear();
    sessionStorage.clear();
    deleteCookie('_idToken');
    deleteCookie('_refreshToken');
}
export function isAuthorized()
{
    return getCookie('_idToken');
}

export async function refreshLoginInfo(){

    const refreshToken = getCookie('_refreshToken');
    if(!refreshToken)
        {
         window.location.href=`/${LOGIN_PATH}`;
         return;
        }
    try{
      const response = await fetch(REFRESH_USER_API,{
             method:"POST",
             body:JSON.stringify({
                grant_type:'refresh_token',
                refresh_token:refreshToken

             })
             
      })
       const newLoginInfo = await response.json();
       if(!response.ok)
       {
        throw new Error("unable to fetch");
       }
       const {id_token,expires_in} = newLoginInfo;
       const idTokenExpirationTime = new Date();
       const tokenTime = idTokenExpirationTime.getTime() + (parseInt(expires_in) * 1000);
       idTokenExpirationTime.setTime(tokenTime);
       setCookie({
            name: '_idToken',
            value: id_token,
            expirationTime: idTokenExpirationTime.toUTCString()
       
        })
        return id_token;
    
    }
    catch(e)
    {
        showToastMessage({
             message:'session expired please login again',
             variant:'error',
             duration:1000,
             closeCallback:()=>{
                clearUserInfo();
                window.location.href=`/${LOGIN_PATH}`;
             }

        })

        
    }

}
