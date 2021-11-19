// ==UserScript==
// @name         Genauerer durchschnittlicher Kaufpreis
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Genaueren durchschnittlichen Kaufpreis mit 4 Nachkommastellen wie in der App anzeigen. Der originale Wert bleibt absichtlich unangetastet!
// @author       JokerGermany
// @match        https://de.scalable.capital/broker/security?isin=*
// @icon         https://www.google.com/s2/favicons?domain=scalable.capital
// @grant        none
// ==/UserScript==
function isNumber(n) {
    'use strict';
    n = n.replace(/\./g, '').replace(',', '.');
    return parseFloat(n);
}
(function() {
    'use strict';
    var findDurchschnittKauf = /bei Kauf$/i;
    var findStueck = /^Stück$/i;

var divs = document.getElementsByTagName("div");

//Stückzahlen ermitteln
for (let i = 0;i< divs.length;i++)
{
   if (findStueck.test(divs[i].innerHTML))
   {
    var Stueck = parseFloat(divs[i-1].getElementsByTagName("span")[0].innerHTML);
   }
}




var found = 0
for (let i = 0;i< divs.length;i++)
{
    if (findDurchschnittKauf.test(divs[i].innerHTML) && found == 1)
   {
      //Durchschnitt errechnen
      let Ergebnis = Number(Kaufpreis)/Number(Stueck)
      //Durchschnitt mit 4 Nachkommastellen hinzufügen
      divs[i].getElementsByTagName("span")[1].innerHTML += "<br>"+Ergebnis.toLocaleString("de-DE",{ minimumFractionDigits: 4 });

   }
   //Kaufpreis ermitteln
   if (findDurchschnittKauf.test(divs[i].innerHTML) && found == 0)
   {
      found = 1;
      var Kaufpreis = isNumber(divs[i].getElementsByTagName("span")[1].innerHTML);
   }

}

})();