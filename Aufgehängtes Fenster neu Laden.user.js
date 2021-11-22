// ==UserScript==
// @name         Aufgehängtes Fenster neu Laden
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Leider bleibt SC öfters mal stehen und lädt keine Seite. Ist der Chart mehr als 2 Minuten in der Vergangenheit soll der Tab neu geladen werden.
// @author       JokerGermany
// @match        https://de.scalable.capital/broker/security?isin=*
// @icon         https://www.google.com/s2/favicons?domain=scalable.capital
// @grant        none
// ==/UserScript==
/* Hängt Tab auf
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
*/



(function()
 {
   //  console.log(window.location.href);
   //  console.log(!(window.location.href.includes("BUY")));
   'use strict';
    var marker1 = null;
    var marker2 = null;
    var zaehler = 0;
    setInterval(function()
    {
        console.log("marker1:"+marker1+" marker2:"+marker2);
        const d = new Date();
        let day = d.getDay()
        let hour = d.getHours()
        if ( day != 0 && day !=6 && hour < 22 && hour > 7 && !(window.location.href.includes("BUY")) && !(window.location.href.includes("SELL")) )
        {
            if (marker1 == null) //&& marker2 == null)
            {
               marker1 = document.getElementById("liveTickerLine").getAttribute("x1");
               console.log("marker1");
            }
            else // if (marker1 =! null && marker2 == null)
            {
                     var marker2 = document.getElementById("liveTickerLine").getAttribute("x1");
                     console.log("marker2");
                     if (marker1 == marker2)
                     {
                         location.reload();
                     }
                     marker1 = marker2;
                     marker2 = null;
            }
        }

        zaehler++;
      }, 60000);

// <line id="liveTickerLine" class="jss205" x1="363.65992063492064" y1="134.03536184210483" x2="484" y2="134.03536184210483" stroke-width="1" style="stroke-dasharray: 3, 4;"></line>


})();