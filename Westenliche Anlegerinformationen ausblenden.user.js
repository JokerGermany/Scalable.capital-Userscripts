// ==UserScript==
// @name         Westenliche Anlegerinformationen ausblenden
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Westenliche Anlegerinformationen ausblenden
// @author       JokerGermany
// @match        https://de.scalable.capital/broker/security?isin=*
// @icon         https://www.google.com/s2/favicons?domain=scalable.capital
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var Eckdaten = /^Eckdaten$/i;

var divs = document.getElementsByTagName("div");

for (let i = 0;i< divs.length;i++){
   if (Eckdaten.test(divs[i].innerHTML)) {
	divs[i].style.display = "none";
    divs[i+1].style.display = "none";
    divs[i-1].style.display = "none";
   }
}

})();