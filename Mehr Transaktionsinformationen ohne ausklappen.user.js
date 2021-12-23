// ==UserScript==
// @name         Mehr Transaktionsinformationen ohne ausklappen
// @namespace    https://github.com/JokerGermany/Scalable.capital-Userscripts
// @version      0.9
// @description  Alle Informationen auf einen Blick, nur noch zum stornieren von offenen Transaktionen muss die Übersicht aufgerufen werden. Wesentliche Anlegerinformationen werden optional gelöscht.
// @author       JokerGermany
// @match        https://de.scalable.capital/broker/security?isin=*
// @icon         https://www.google.com/s2/favicons?domain=scalable.capital
// @grant        GM_addStyle
// @grant        window.close
// ==/UserScript==
function verkaufKaufKlicken() {
    'use strict';
    var params = new URLSearchParams(window.location.search);
    if (params.get('type') == "SELL")
    {
        params.set('type', "BUY");
    }
    else if (params.get('type') == "BUY")
    {
        params.set('type', "SELL");
    }
    location.search = params.toString();
}

function transaktionOrderDurchsuchen(Ort)
{

    var limitStopPreis;
    var ausfuehrungsPreis;
    var stueck;
    var gesamt;
    var Offen = Ort.childNodes[2].childNodes[1].classList.contains("jss177") && (Ort.childNodes[2].childNodes[1].innerHTML == "Ausstehend")
    var Storno = Ort.childNodes[2].childNodes[1].classList.contains("jss177") && (Ort.childNodes[2].childNodes[1].innerHTML == "Storniert")
    var ETFName = document.getElementsByClassName("jss83")[0].getElementsByTagName("span")[1].innerHTML;
    var transaktionETFNameClass="jss174"
    if ( Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML != ETFName )
    {
     //console.log("Wurde schon bearbeitet"+ETFName+" != "+Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML);
     return;
    }
    if (Offen && Storno)
    {
        alarm();
    }
    if (Storno)
    {
        console.log("Storno");
        return;
    }
    if (Ort.childNodes[1].childNodes[0].classList.contains("jss173"))
    {
        if (Ort.childNodes[1].childNodes[0].innerHTML == "Verkauf" || Ort.childNodes[1].childNodes[0].innerHTML == "Kauf")
        {
            //console.log("Diese Order ist Offen: "+Offen);
            var checkExist;
            var ordertyp = Ort.childNodes[1].childNodes[0].innerHTML;
            var ausgelesenZeit = Ort.getAttribute("aria-labelledby").split('Z')[0]+"Z";
            //console.log("MiliSekunden: "+orderZeit.getMilliseconds());
            //  console.log("ausgelesenZeit: "+ausgelesenZeit+" verlaufZeit: "+verlaufZeit);
            Ort.click();
            var findOrderDatum;
            if (Offen == true)
            {
                findOrderDatum = /^Order erstellt$/i;
            }
            else if (Offen == false)
            {
                findOrderDatum = /^Order ausgeführt$/i;
            }
            else
            {
                console.log("Offen ist weder true noch false!");
                alarm();
            }
            var orderUebersicht = document.getElementsByClassName("MuiDialog-root")
            var orderZeit = new Date(ausgelesenZeit);
            var verlaufZeit = orderZeit.toLocaleDateString('de-DE', {day: '2-digit'})+" "+orderZeit.toLocaleDateString('de-DE', {month: 'short'})+" "+orderZeit.toLocaleDateString('de-DE', {year: 'numeric'})+", "+orderZeit.toLocaleTimeString('de-DE');
            //console.log(orderZeit.getMilliseconds());
            var durchlaufen = 0;
            checkExist = setInterval(function()
            {
                //hoch und runter sind zum loop verhindern
                //var hoch = 0;
                var runter = 0;
                for (let i = 0;i< orderUebersicht.length;i++)
                {
                    var orderVerlauf = document.getElementsByClassName("MuiDialog-root")[i].getElementsByTagName("div");
                    for (let j = 0;j< orderVerlauf.length;j++)
                    {
                        if (findOrderDatum.test(orderVerlauf[j].innerHTML))
                        {
                            //console.log(orderVerlauf[i+1].innerHTML+" "+verlaufZeit);
                            if (orderVerlauf[j+1].innerHTML == verlaufZeit)
                            {
                                if (orderUebersicht[i].querySelector('[data-testid="value-Limitpreis"]') != null)
                                {
                                    var limitPreisString = orderUebersicht[i].querySelector('[data-testid="value-Limitpreis"]').innerHTML;
                                    //console.log("limitPreisString: "+limitPreisString);
                                    Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML = "Limitpreis: "+limitPreisString;
                                }
                                if (orderUebersicht[i].querySelector('[data-testid="value-Stoppreis"]') != null)
                                {
                                    var stopPreisString = orderUebersicht[i].querySelector('[data-testid="value-Stoppreis"]').innerHTML;
                                    //console.log("limitPreisString: "+limitPreisString);
                                    if ( Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML == ETFName )
                                    {
                                        Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML = "Stoppreis: "+stopPreisString;
                                    }
                                    else if ( Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML != ETFName && !(Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML.includes("Stoppreis:")))
                                    {
                                        Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML += "Stoppreis: "+stopPreisString;
                                    }
                                    else
                                    {
                                        console.log("Beim Stoppreis läuft was falsch");
                                        alarm();
                                    }
                                }
                                if (orderUebersicht[i].querySelector('[data-testid="value-Ausführungspreis"]') != null && Offen == false)
                                {
                                    stueck = orderUebersicht[i].querySelector('[data-testid="value-Ausgeführte Stückzahl"]').getElementsByTagName("span")[0].innerHTML;
                                    var kurswert = isNumber(orderUebersicht[i].querySelector('[data-testid="value-Kurswert"]').innerHTML);
                                    console.log("Stück: "+stueck+" Kurswert:"+kurswert);
                                    var ausfuehrungsPreisString = (Number(kurswert)/Number(stueck)).toLocaleString("de-DE",{ maximumFractionDigits: 4 });
                                    if ( Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML == ETFName )
                                    {
                                        Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML = "Ausführungspreis: "+ausfuehrungsPreisString;
                                    }
                                    else
                                    {
                                        Ort.getElementsByClassName(transaktionETFNameClass)[0].innerHTML += " Ausführungspreis: "+ausfuehrungsPreisString;
                                    }
                                }
                                else if (Offen == false)
                                {
                                    console.log("Beim Ausführungspreis läuft was falsch");
                                    alarm();
                                }


                                orderUebersicht[i].getElementsByClassName("MuiButton-label")[0].click();
                                //document.getElementsByClassName("MuiDialog-root")[0].remove();
                                gefunden = true;
                            }
                            //
                        }
                    }
                    if (gefunden == true)
                    {
                        clearInterval(checkExist);
                    }
                    //wenn kleiner 43 Millisekunden und nichts gefunden, dann ziehe eine Sekunde ab.
                    if ( i == (orderUebersicht.length - 1))
                    {
                        if (orderZeit.getMilliseconds() < 43 && durchlaufen > 0 && runter < 3)
                        {
                            orderZeit = new Date(orderZeit-(orderZeit.getMilliseconds()+1));
                            verlaufZeit = orderZeit.toLocaleDateString('de-DE', {day: '2-digit'})+" "+orderZeit.toLocaleDateString('de-DE', {month: 'short'})+" "+orderZeit.toLocaleDateString('de-DE', {year: 'numeric'})+", "+orderZeit.toLocaleTimeString('de-DE');
                            console.log(orderZeit);
                            console.log(verlaufZeit);
                            console.log(orderZeit.getMilliseconds());
                            //debugger;
                            i=0;
                            runter++;
                        }
                        /*else if (orderZeit.getMilliseconds() > 998 && hoch < 3 )
                        {
                            orderZeit = new Date(orderZeit+2);
                            verlaufZeit = orderZeit.toLocaleDateString('de-DE', {day: '2-digit'})+" "+orderZeit.toLocaleDateString('de-DE', {month: 'short'})+" "+orderZeit.toLocaleDateString('de-DE', {year: 'numeric'})+", "+orderZeit.toLocaleTimeString('de-DE');
                            console.log(orderZeit);
                            console.log(verlaufZeit);
                            console.log(orderZeit.getMilliseconds());
                            i=0;

                            hoch++
                        }*/
                        else
                        {
                            //console.log(verlaufZeit);
                        }
                        durchlaufen++;
                    }
                }
            }, 100);
        var gefunden = false;
      
        }
        else
        {
            alarm();
        }
    }

    //console.log("Offen: "+Offen+" Storno: "+Storno);

}

function alarm() {
    'use strict';
    console.log('Quelltext hat sich geändert - Mehr Transaktionsinformationen ohne ausklappen');
    //alert('Quelltext hat sich geändert - Trading');
}
function isNumber(n) {
    'use strict';
    n = n.replace(/\./g, '').replace(',', '.');
    return parseFloat(n);
}
function doagain([durchschnitt, produktdetailsGefunden])
{
    if ( !(window.location.href.includes("BUY")) && !(window.location.href.includes("SELL")) && !(document.getElementsByClassName("MuiButton-label")[0].innerHTML == "Schließen") )
    {
        //console.log(document.getElementsByClassName("MuiButton-label jss129")[1].innerHTML);
        var wesentlicheAnlegerinformationenAusblendenVar = 1;
        var alteTransaktionenAusblenden = 1;
        var genauererDurchschnittlicherKaufpreis = 1;
        const d = new Date();
        let day = d.getDay()
        let hour = d.getHours()
        var oeffnungszeiten = day != 0 && day !=6 && hour < 22 && hour > 7;

        //oeffnungszeiten = true;

        var divs = document.getElementsByTagName("div");

        var erwartetTransaktionen;
        console.log(produktdetailsGefunden);
        if (wesentlicheAnlegerinformationenAusblendenVar == 1 && oeffnungszeiten && produktdetailsGefunden != true)
        {
            erwartetTransaktionen = document.getElementsByClassName("jss150")[1];
            var Produktdetails = /^Produktdetails$/i;
            for (let i = 0;i< divs.length;i++)
            {
                if (Produktdetails.test(divs[i].innerHTML))
                {
                    //Doppelcheck!
                    if (divs[i-1].innerHTML.includes("Produktdetails"))
                    {
                        if (divs[i+1].innerHTML.includes("Wesentlichen Anlegerinformationen"))
                        {
                            divs[i+1].remove();
                        }
                        divs[i-2].remove();
                        divs[i-1].remove();
                    }
                    produktdetailsGefunden = true;
                    break;
                }
            }
            erwartetTransaktionen = document.getElementsByClassName("jss150")[1];
        }
        if (wesentlicheAnlegerinformationenAusblendenVar != 1 || oeffnungszeiten == false )
        {
            erwartetTransaktionen = document.getElementsByClassName("jss150")[2];
        }
        //divs = document.getElementsByTagName("div");



        //console.log("jss150"+document.getElementsByClassName("jss150")[1].innerHTML);


        //console.log(erwartetTransaktionen);


        //check ob vorher BUY/Sell FEnster offen war + Kontrollfunktion - Gibt es offene Transaktionen?
        var findTransaktionen = /^Transaktionen$/i;
        var findOffen = /^Offen$/i;
        var transaktionGefunden=0;
        var Offen = 0;



        //while(transaktionGefunden==0)
        //{
        for (let i = 0;i< divs.length;i++)
        {
            if (findOffen.test(divs[i].innerHTML))
            {
                Offen = 1;
            }
            if (findTransaktionen.test(divs[i].innerHTML))
            {
                transaktionGefunden=1;
                if (erwartetTransaktionen == null || erwartetTransaktionen.innerHTML != "Transaktionen")
                {
                    //Wenn Transaktion gefunden, aber nicht in Element jss62, dann neu Laden
                    //window.open(location.href);
                    //window.close();
                    location.reload();
                    console.log("neustart - Mehr Transaktionsinformationen ohne ausklappen");
                    console.log(erwartetTransaktionen.innerHTML);
                    //alert('neustart - Mehr Transaktionsinformationen ohne ausklappen');
                    //window.open(location.href);
                    //window.close();
                    //das Beste wäre, wenn man das script hier killen könnte...
                }
                if (Offen == 1)
                {
                    break;
                }
            }
            else if (i == (divs.length-1) & transaktionGefunden==0)
            {
                i=0;
                console.log("keine Transaktion gefunden. Sollte dies häufiger vorkommen ist das Skript defekt!");
            }
        }

        if (genauererDurchschnittlicherKaufpreis == 1)
        {
            var erwartetesDurchschnittsKaufpreisFeld = document.getElementsByClassName("MuiGrid-root jss152 MuiGrid-item");
            //console.log("Durchschnitt: "+erwartetesDurchschnittsKaufpreisFeld[2].outerHTML);
            if (!(window.location.href.includes("BUY")) && !(window.location.href.includes("SELL")) && erwartetesDurchschnittsKaufpreisFeld[2].outerHTML.includes("bei Kauf</div>"))
            {
                //console.log("stück: "+document.getElementsByClassName("MuiGrid-root jss143 MuiGrid-container MuiGrid-item MuiGrid-direction-xs-column")[0].innerHTML);
                var erwartetesStueckFeld = document.getElementsByClassName("MuiGrid-root jss143 MuiGrid-container MuiGrid-item MuiGrid-direction-xs-column")[0];
                //Stück bestimmen - Check ob sich die Webseite geändert hat.
                if(erwartetesStueckFeld.innerHTML.includes("Stück</div>"))
                {
                    var Stueck = erwartetesStueckFeld.getElementsByTagName("span")[0].innerHTML
                }
                else
                {
                    alarm("Stück");
                }

                //Kaufpreis bestimmen - Check ob sich die Webseite geändert hat.
                if ( erwartetesDurchschnittsKaufpreisFeld[0].innerHTML.includes("bei Kauf"))
                {
                    var Kaufpreis = isNumber(erwartetesDurchschnittsKaufpreisFeld[0].getElementsByTagName("span")[1].innerHTML);
                }
                else
                {
                    alarm("Kaufpreis");
                }
                durchschnitt = (Number(Kaufpreis)/Number(Stueck)).toLocaleString("de-DE",{ maximumFractionDigits: 4 });
                //console.log("Durchschnitt: "+durchschnitt);
                ///Durchschnitt mit 4 Nachkommastellen hinzufügen - Check ob sich die Webseite geändert hat.
                if ( erwartetesDurchschnittsKaufpreisFeld[2].outerHTML.includes("bei Kauf</div>"))
                {
                    erwartetesDurchschnittsKaufpreisFeld[2].innerHTML += "<br>"+durchschnitt;
                }
                else
                {
                    alarm("Ergebnis eintragen");
                }
                //console.log("Stück: "+Stueck+" Kaufpreis: "+Kaufpreis+" Durchschnitt: "+erwartetesDurchschnittsKaufpreisFeld[2].innerHTML);
            }
        }

        
        var erwartetTagClass = "jss165";
        var erwartetTag = erwartetTransaktionen.parentNode.childNodes[1].getElementsByClassName(erwartetTagClass);
        //console.log("Offen: "+erwartetTag[0].innerHTML);
//console.log(erwartetTag[0].innerHTML);
        //Gibt es Trades? - Aus Sicherheitsgründen funktioniert das Skript nicht, wenn noch keine Order abgegeben wurde.
        if (
            ( erwartetTransaktionen.innerHTML == "Transaktionen"
             && Offen == 0
             && erwartetTag[0].innerHTML != "Offen")
            ||
            ( erwartetTransaktionen.innerHTML == "Transaktionen"
             && Offen == 1
             && erwartetTag[0].innerHTML == "Offen")
        )
        {
            //console.log(document.getElementsByClassName("jss158")[0].getElementsByTagName("div").length);
            var divTransaktion = document.getElementsByClassName("jss163")[0].childNodes[0].childNodes[0].childNodes;
            //console.log(divTransaktion.length);
            //var offenJetzt;
            for (let i = 0;i< divTransaktion.length;i++)
            {
                if (!(divTransaktion[i].childNodes[0].classList.contains(erwartetTagClass)))
                {
                    //console.log(divTransaktion[i].innerHTML);
                    transaktionOrderDurchsuchen(divTransaktion[i])
                    //i = divTransaktion.length
                }
            }
        }

    }
    else if ( (window.location.href.includes("BUY")) || (window.location.href.includes("SELL")) )
    {
        var checkExist = setInterval(function()
        {
            if (document.querySelector('[data-testid="NUMBER_OF_SHARES"]') != null)
            {
                document.querySelector('[data-testid="NUMBER_OF_SHARES"]').click();
                clearInterval(checkExist);
            }
        }, 100); // check every 100ms

        // Ort.querySelector('[aria-labelledby="Limitpreis"]').getElementsByTagName("span")[0].innerHTML
        var spans = document.getElementsByTagName("span");

        var findKauf = /^Kauf$/i;
        var findVerkauf = /^Verkauf$/i;
        for (let i = 0;i< spans.length;i++)
        {

            if (findKauf.test(spans[i].innerHTML) || findVerkauf.test(spans[i].innerHTML))
            {
                spans[i].addEventListener("click", verkaufKaufKlicken);
                spans[i].setAttribute("id", "portal")
                GM_addStyle("#portal { cursor: crosshair; }");
            }
        }
        console.log();


    }
    return [durchschnitt, produktdetailsGefunden];
}


(function()
 {
    'use strict';
    var durchschnitt;
    var produktdetailsGefunden = false;
    var vars = [durchschnitt,produktdetailsGefunden]
    //load Funktion, sonst stellt das Skript von SC die wesentlichen Anlegerinformationen wieder her nachdem es das Skript gelöscht hat
    window.addEventListener('load', function() {
    doagain(vars)
    }, false);
    setInterval(function(){doagain(vars);}, 15000);
})();