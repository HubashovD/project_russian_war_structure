const delay = 1000;

let timer = setInterval(function() {
    window.parent.postMessage(
        {
            __texty_iframe_msg__: true, 
            height: document.documentElement.offsetHeight
        },
        "*"         // set target domain
    )} 
    
, delay)