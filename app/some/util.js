/*DEPRECATED, TODO: It's not Angular way!!!*/

config = {
    context: getContext(),
    component: {path: getComponentPath()}
};


function getContext() {
    var path = window.location.href;
    return path.substring(0, path.lastIndexOf("/") + 1);
}

function getComponentPath() {
    var scripts = document.getElementsByTagName("script");
    var last = scripts[scripts.length - 1].src;
    return last.substring(0, last.lastIndexOf('/') + 1);
}