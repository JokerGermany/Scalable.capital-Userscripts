// ==UserScript==
// @name         Mehr Transaktionsinformationen ohne ausklappen
// @namespace    https://github.com/JokerGermany/Scalable.capital-Userscripts
// @version      0.1
// @description  Alle Informationen auf einen Blick, nur noch zum stornieren von offenen Transaktionen muss ausgeklappt werden.
// @author       JokerGermany
// @match        https://de.scalable.capital/broker/security?isin=*
// @icon         https://www.google.com/s2/favicons?domain=scalable.capital
// @grant        none
// ==/UserScript==
function transaktionOrderDurchsuchen(Offen, Ort)
{
    var limitStopPreis;
    //var icon;
    var ausfuehrungsPreis;
    var stueck;
    var gesamt;
    var ordertyp
    if (Ort.querySelector('[data-testid="error-reason"]') == null)
    {
        var findVerkauf = />Verkauf<\/span>/i;
        var findKauf = />Kauf<\/span>/i;
        if (findVerkauf.test(Ort.innerHTML) || findKauf.test(Ort.innerHTML) )
        {
            var limitStopPreisString;
            if (findVerkauf.test(Ort.innerHTML))
            {
                ordertyp="sell";
            }
            else if (findKauf.test(Ort.innerHTML))
            {
                ordertyp="buy";
            }
            else
            {
                 console.log("Achtung: Nicht verkauf oder kauf! Irgendetwas läuft hier gewaltig schief...");
                alarm();
            }

            if (Offen==1 && Ort.querySelector('[data-testid="icon-PENDING"]') != null )
            {
              /*//Icon
              var cancel = Ort.querySelector('[data-testid="cancel-order-button"]');
              cancel.innerHTML = Ort.querySelector('[data-testid="icon-PENDING"]').outerHTML;
              icon=cancel.outerHTML;
              */
              //Beauftragte Stückzahl
              stueck = isNumber(Ort.querySelector('[aria-labelledby="Beauftragte Stückzahl"]').getElementsByTagName("span")[0].innerHTML);
            }
            /*
            else if (Ort.querySelector('[data-testid="icon-SELL"]') != null)
            {
                icon=Ort.querySelector('[data-testid="icon-SELL"]').outerHTML;
            }
            else if (Ort.querySelector('[data-testid="icon-BUY"]') != null)
            {
                icon=Ort.querySelector('[data-testid="icon-BUY"]').outerHTML;
            }
            else
            {
              console.log("Kein Icon gefunden!");
               alarm();
            }*/
            //limitStopPreis
            if (Ort.querySelector('[aria-labelledby="Limitpreis"]') != null)
            {
                limitStopPreis = isNumber(Ort.querySelector('[aria-labelledby="Limitpreis"]').getElementsByTagName("span")[0].innerHTML);
                limitStopPreisString = " Limitpreis: "+limitStopPreis;
            }
            else if (Ort.querySelector('[aria-labelledby="Stoppreis"]') != null)
            {
                limitStopPreis = isNumber(Ort.querySelector('[aria-labelledby="Stoppreis"]').getElementsByTagName("span")[0].innerHTML);
                limitStopPreisString = " Stoppreis: "+limitStopPreis;
            }
             if (Offen == 0 && Ort.querySelector('[data-testid="icon-PENDING"]') == null )
            {
                //ausführungsPreis
                ausfuehrungsPreis = isNumber(Ort.querySelector('[aria-labelledby="Ausführungspreis"]').getElementsByTagName("span")[0].innerHTML);
                //Ausgeführte Stückzahl
                stueck = isNumber(Ort.querySelector('[aria-labelledby="Ausgeführte Stückzahl"]').getElementsByTagName("span")[0].innerHTML);
                //gesamt
                gesamt = isNumber(Ort.querySelector('[aria-labelledby="Kurswert"]').getElementsByTagName("span")[0].innerHTML);
                Ort.querySelector('[data-testid="transaction-subtitle"]').innerHTML = "Stück: "+stueck+" AusfuehrungsPreis: "+ausfuehrungsPreis+limitStopPreisString;
            }
            else if (Offen==1 && Ort.querySelector('[data-testid="icon-PENDING"]') != null )
            {
                Ort.querySelector('[data-testid="transaction-subtitle"]').innerHTML = "Stück: "+stueck+limitStopPreisString;
            }

             //sell.push(testSell);
            //console.log(testSell);
        }
    }
    else if ( Ort.querySelector('[data-testid="error-reason"]') != null && Ort.querySelector('[data-testid="error-reason"]').innerHTML != "Storniert" )
    {
        ordertyp="Storno";
    }
    /*if ( findVerkauf.test(Ort.innerHTML) || findKauf.test(Ort.innerHTML) ||Ort.querySelector('[data-testid="error-reason"]') != null && Ort.querySelector('[data-testid="error-reason"]').innerHTML != "Storniert" )
    {
        //return [icon,limitStopPreis,ausfuehrungsPreis,stueck,gesamt,ordertyp];
        return [limitStopPreis,ausfuehrungsPreis,stueck,gesamt,ordertyp];
    }
        else
    {
        console.log("Achtung: Nicht storniert, verkauf oder kauf!");
        alarm();
    }*/
}

/*function TransaktionAbschnitt(Offen, Ort)
{
  //Offen bezieht sich darauf, ob diese Funktion die offenen Transaktionen durchsuchen soll oder nicht.
  //return [icon,limitPreis,ausfuehrungsPreis,stueck,gesamt,ordertyp];

    var Order = [];


    /*   var lowSell; // Offen=1 => niedrigste Limit Order; Offen=0 => letzter Verkaufpreis
     var highBuy; // Offen=1 => höchste Limit Order; Offen=0 => letzter Kaufpreis
     var zuletzt; // Wurde zuletzt verkauft oder gekauft?
     var sell = [];
     var buy = [];
     var abbrechen;



     // TODO: Andersrum suchen wenn aktueller Tag
    /* const dheute = new Date();
     const dgestern = new Date();
     const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
     dgestern.setDate(dheute.getDate() - 1);
     //console.log(Ort.innerHTML);
     //Wenn heute oder gestern, dann Suche andersrum!
     if(Ort.innerHTML == dheute.toLocaleDateString('de-DE', options) || Ort.innerHTML == dgestern.toLocaleDateString('de-DE', options))
     {
        for (let i = 0;i< Ort.parentNode.parentNode.childNodes[1].childNodes.length;i++)
        {
             var heuteGestern = transaktionOrderDurchsuchen(Offen, Ort.parentNode.parentNode.childNodes[1].childNodes[i], lowSell, highBuy, zuletzt, sell, buy)
             lowSell = heuteGestern[0];
             highBuy = heuteGestern[1];
             zuletzt = heuteGestern[2];
             abbrechen = heuteGestern[3];
             if (abbrechen == 1)
             {
                 break;
             }
         }
     }
     else
     {
         for (let i = Ort.parentNode.parentNode.childNodes[1].childNodes.length-1;i >= 0;i--)
         {
            var aktuelleOrder = transaktionOrderDurchsuchen(Offen, Ort.parentNode.parentNode.childNodes[1].childNodes[i])

            if (aktuelleOrder[5] == "buy" || aktuelleOrder[5] == "sell")
             {
                 Order.push(aktuelleOrder);
             }
         }
     //}
    return Order;
    //console.log("lowSell:"+lowSell+" highBuy:"+highBuy+" zuletzt:"+zuletzt);
    /*if (Offen == 1)
    {
        return [lowSell, highBuy, sell, buy]; //lowSell,highBuy, Sell-Array, highBuy-Array
    }
    else
    {
        return [lowSell, highBuy, zuletzt];
    }
}*/

function alarm() {
    'use strict';
    console.log('Quelltext hat sich geändert - sc beschleunigen');
   //alert('Quelltext hat sich geändert - Trading');
}
function isNumber(n) {
    'use strict';
    n = n.replace(/\./g, '').replace(',', '.');
    return parseFloat(n);
}

(function()
 {
    'use strict';
    var maxAnzahlTransaktionen;
    //setInterval(function()
    //{
        console.log("Einträge: "+document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160").length+"maxAnzahlTransaktionen: "+maxAnzahlTransaktionen+" BUY:"+!(window.location.href.includes("BUY"))+" Sell:"+!(window.location.href.includes("SELL")));
        //console.log("MaxAnzahlTransaktionen: "+maxAnzahlTransaktionen+" Schleifenlänge: "+document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160").length);
        //if ( maxAnzahlTransaktionen == null && !(window.location.href.includes("BUY")) && !(window.location.href.includes("SELL"))
        //    || maxAnzahlTransaktionen < document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160").length && !(window.location.href.includes("BUY")) && !(window.location.href.includes("SELL")))
        //{
            var findOffen = />Offen<\/span>$/i;
            var Offen = 0;
            var divs = document.getElementsByTagName("div");
            //Kontrollfunktion - Gibt es offene Transaktionen?
            for (let i = 0;i< divs.length;i++)
            {
                if (findOffen.test(divs[i].innerHTML))
                {
                    Offen = 1;
                    break;
                }
            }
            //console.log("Offen? "+document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[0].innerHTML);
            //console.log("Offen: "+Offen);
            //Gibt es Trades? - Aus Sicherheitsgründen funktioniert das Skript nicht, wenn noch keine Order abgegeben wurde.
            if (
                ( document.getElementsByClassName("jss62")[0].innerHTML == "Transaktionen"
                 && Offen == 0
                 && document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss159")[0].innerHTML != "Offen")
                ||
                ( document.getElementsByClassName("jss62")[0].innerHTML == "Transaktionen"
                 && Offen == 1
                 && document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[0].innerHTML == "Offen")
            )
            {
                //ORder schon vorhanden?
                //if (Offen == 1 && document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[0].innerHTML == "Offen")
                //{
                    //TransaktionAbschnitt(1,document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss159")[0].parentNode.parentNode.childNodes[1].childNodes);
                for (let i = document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160").length-1;i >= 0;i--)
                {
                    for (let j = document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[i].parentNode.parentNode.childNodes[1].childNodes.length-1;j >= 0;j--)
                    {
                        if (i != 0)
                        {
                            transaktionOrderDurchsuchen(0, document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[i].parentNode.parentNode.childNodes[1].childNodes[j]);
                        }
                        else
                        {
                            transaktionOrderDurchsuchen(1, document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[i].parentNode.parentNode.childNodes[1].childNodes[j]);
                        }
                    }
                }


                    //var offeneOrder = TransaktionAbschnitt(1,document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[0]).sort(function(a, b){return a[1] - b[1]});
                    //console.log(document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[0].parentNode.parentNode.childNodes[1].childNodes[0].outerHTML);
                    //var sellOpen = lowSellhighBuy[2].sort(function(a, b){return a - b});
                    //var buyOpen = lowSellhighBuy[3].sort(function(a, b){return b - a});
                    /* for (let i = 0; i < sellOpen.length; i++)
                    {
                        console.log(sellOpen[i]);
                    }*/
                    /*var oldOffeneOrder = document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[0].parentNode.parentNode.childNodes[1];
                    oldOffeneOrder.replaceChildren();
                    var teststring = "<table><tr><th>Icon</th><th>Stück</th><th>Limitpreis</th></tr>";
                    //console.log("<table>")
                    //return [icon,limitPreis,ausfuehrungsPreis,stueck,gesamt,ordertyp]
                    //console.log("<tr><th>Icon</th><th>Limitpreis</th><th>Ausführungspreis</th><th>Stück</th><th>Gesamtpreis</th></tr>")
                    //console.log("<tr><th>Icon</th><th>Stück</th><th>Limitpreis</th></tr>")

                    for (let i = 0; i < offeneOrder.length; i++)
                    {
                       teststring += "<tr><td>" + offeneOrder[i][0] + "</td><td>" + offeneOrder[i][3]+ "</td><td>" + offeneOrder[i][1] + "</td></tr>";
                        //console.log("<tr><td>"+offeneOrder[i][0]+"</td><td>"+offeneOrder[i][3]+"</td><td>"+offeneOrder[i][1]+"</td><tr>");
                        //console.log("<tr><td>"+offeneOrder[i][0]+"</td><td>"+offeneOrder[i][1]+"</td>w<td>"+offeneOrder[i][2]+"</td><td>"+offeneOrder[i][3]+"</td><td>"+offeneOrder[i][4]+"</td><tr>");
                       //console.log(buyOpen[i]);
                    }
                   teststring += "</table>";
                    oldOffeneOrder.innerHTML = teststring;*/
                    //console.log("</table>");
                }

                //var dies = document.getElementsByClassName("jss62")[0].parentNode.parentNode
                //dies.replaceChildren()
                //dies.remove();
              /*  //console.log("Gibt trades");
                var lowSell;
                var highBuy;
                var lowSellhighBuy
                var zuletzt;
                var gefunden;
                var i;
                //Order durchsuchen nach letzten Kauf und letzten Verkauf
                while (lowSell == null & highBuy == null)
                {
                    for (i = 0 + Offen;i< document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160").length;i++)
                    {
                        lowSellhighBuy = TransaktionAbschnitt(0,document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[i]);
                        //console.log("Ort = "+document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[i]);
                        if (zuletzt == null)
                        {
                            zuletzt = lowSellhighBuy[2];
                            //console.log("zuletzt:"+zuletzt);
                        }
                        if (lowSell == null && lowSellhighBuy[0] != null)
                        {
                            lowSell = lowSellhighBuy[0];
                            break;
                        }
                        if (highBuy == null && lowSellhighBuy[1] != null)
                        {
                            highBuy = lowSellhighBuy[1];
                            break;
                        }
                    }
                    break;
                }
                maxAnzahlTransaktionen = i+1;
                var schleifenlaenge = document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160").length;
                //console.log("Zaehler: "+i);
                while ( (maxAnzahlTransaktionen+1) <= schleifenlaenge )
                {
                    //console.log("maxAnzahlTransaktionen: "+maxAnzahlTransaktionen);
                    //console.log("i: "+i);
                    i = maxAnzahlTransaktionen;
                    schleifenlaenge = document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160").length;
                    while (i < document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160").length )
                    {

                        //console.log("Zaehler: "+i);
                        //console.log("Datum: "+document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[i].innerHTML);
                        //console.log(document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[i].parentNode.parentNode.innerHTML);
                        document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160")[i].parentNode.parentNode.replaceChildren();
                        i++;
                    }
                    //console.log("schleifenlänge: "+document.getElementsByClassName("jss62")[0].parentNode.parentNode.childNodes[1].getElementsByClassName("jss160").length);
                }*/
            /*}
            else
            {
                console.log("Offen: "+Offen+" Transaktion: "+document.getElementsByClassName("jss62")[0].innerHTML);
                alarm();
            }*/
       //}


        //}
          //      , 30000);
})();