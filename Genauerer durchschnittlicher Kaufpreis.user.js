// ==UserScript==
// @name         Genauerer durchschnittlicher Kaufpreis
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Genaueren durchschnittlichen Kaufpreis mit 4 Nachkommastellen wie in der App anzeigen. Der originale Wert bleibt absichtlich unangetastet!
// @author       JokerGermany
// @match        https://de.scalable.capital/broker/security?isin=*
// @icon         https://www.google.com/s2/favicons?domain=scalable.capital
// @grant        none
// ==/UserScript==
function alarm() {
    'use strict';
   alert('Quelltext hat sich geändert - Genauerer durchschnittlicher Kaufpreis');
}

function isNumber(n) {
    'use strict';
    n = n.replace(/\./g, '').replace(',', '.');
    return parseFloat(n);
}

function genau(save)
{
    try
    {
        if (!(window.location.href.includes("BUY")) && !(window.location.href.includes("SELL")) && save != document.getElementsByClassName("MuiGrid-root jss149 MuiGrid-item")[2].innerHTML)
        {
            //Stück bestimmen - Check ob sich die Webseite geändert hat.
            if(document.getElementsByClassName("MuiGrid-root jss141 MuiGrid-container MuiGrid-item MuiGrid-direction-xs-column")[0].innerHTML.includes("Stück</div>"))
            {
                var Stueck = document.getElementsByClassName("MuiGrid-root jss141 MuiGrid-container MuiGrid-item MuiGrid-direction-xs-column")[0].getElementsByTagName("span")[0].innerHTML
            }
            else
            {
                alarm();
            }

            //Kaufpreis bestimmen - Check ob sich die Webseite geändert hat.
            if ( document.getElementsByClassName("MuiGrid-root jss149 MuiGrid-item")[0].innerHTML.includes("bei Kauf"))
            {
                var Kaufpreis = isNumber(document.getElementsByClassName("MuiGrid-root jss149 MuiGrid-item")[0].getElementsByTagName("span")[1].innerHTML);
            }
            else
            {
                alarm();
            }
            var Ergebnis = (Number(Kaufpreis)/Number(Stueck)).toLocaleString("de-DE",{ minimumFractionDigits: 4 });
            ///Durchschnitt mit 4 Nachkommastellen hinzufügen - Check ob sich die Webseite geändert hat.
            if ( document.getElementsByClassName("MuiGrid-root jss149 MuiGrid-item")[2].innerHTML.includes("bei Kauf"))
            {
                document.getElementsByClassName("MuiGrid-root jss149 MuiGrid-item")[2].innerHTML += "<br>"+Ergebnis;
                save = document.getElementsByClassName("MuiGrid-root jss149 MuiGrid-item")[2].innerHTML;
            }
            else
            {
                alarm();
            }
        }
    }
    catch(err)
    {
        alarm();
    }
    return save;
}

(function()
 {
    'use strict';
    save = genau(save);
    console.log(!(window.location.href.includes("BUY")) && !(window.location.href.includes("SELL")) && save != document.getElementsByClassName("MuiGrid-root jss149 MuiGrid-item")[2].innerHTML);
    var save;
    setInterval(genau(save), 60000);
})();