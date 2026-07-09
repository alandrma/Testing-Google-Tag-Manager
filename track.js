function gv() {
    
}

(function(){
    let pixel = '';
    let affclick = gv()
    if(affclick !== '') pixel += '&afclick=' + affclick;
    if(typeof afid !== 'undefined') pixel += '&afid=' + afid;
    if(typeof afprice !== 'undefined') pixel += '&afprice=' + afprice;
    if(typeof afgoal !== 'undefined') pixel += '&afgoal=' + afgoal;
    if(typeof afstatus !== 'undefined') pixel += '&afstatus=' + afstatus;
    if(typeof afcurrency !== 'undefined') pixel += '&afcurrency=' + afcurrency;
    if(typeof afcomment !== 'undefined') pixel += '&afcomment=' + afcomment;
    if(typeof afsecure !== 'undefined') pixel += '&afsecure=' + afsecure;
    if(typeof afoffer_id !== 'undefined') pixel += '&offer_id=' + afoffer_id;
    if(typeof afpromo_code !== 'undefined') pixel += '&promo_code=' + afpromo_code;
    if(typeof afuser_id !== 'undefined') pixel += '&user_id=' + afuser_id;
    for (let i = 1; i <= 7; i++) {
        if (typeof window['custom_field' + i] !== 'undefined') {
            pixel += '&custom_field' + i + '=' +  window['custom_field' + i];
        }
    }

    if(typeof window['items'] !== 'undefined' && window['items'] instanceof Array) {
        for(let i = 0; i < window['items'].length; i++) {
            if(typeof window['items'][i] == 'undefined') {
                break
            }

            if(typeof window['items'][i]["pf_order_id"] !== 'undefined') pixel += '&items['+i+']+[order_id]=' + window['items'][i]["pf_order_id"];
            if(typeof window['items'][i]["pf_sku"] !== 'undefined') pixel += '&items['+i+'][sku]=' + window['items'][i]["pf_sku"];
            if(typeof window['items'][i]["pf_quantity"] !== 'undefined') pixel += '&items['+i+'][quantity]=' + window['items'][i]["pf_quantity"];
            if(typeof window['items'][i]["pf_price"] !== 'undefined') pixel += '&items['+i+'][price]=' + window['items'][i]["pf_price"];
        }
    }

    let img = document.createElement('img');
    img.src = '//app.adstracking.io/success.jpg?success=1' + pixel;
    img.alt = '';
    img.style.cssText = 'position:absolute; top=-9999px; width:1px; height:1px; border:0';
})();
