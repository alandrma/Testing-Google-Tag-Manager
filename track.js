function gv() {
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf("affclick=") == 0) {
            return c.substring("affclick=".length, c.length);
        }
    }
    if (localStorage.getItem('affclick')) {
        return localStorage.getItem('affclick');
    }
    return "";
}
