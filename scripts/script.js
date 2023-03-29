var fast = []
var page = 0;
var tape = new Array(3*parseInt(window.innerWidth / (window.innerHeight * 0.1 + 48))).fill(0).map(() => Math.round(Math.random()));
if(!(tape.length % 2)) tape.push(Math.round(Math.random()));
var rintervals = []
var morse = new jscw({"wpm": 20});

document.querySelectorAll("tape").forEach(function(e){
    for(i of tape){
        var block = document.createElement("block");
        var h1 = document.createElement("h1");
        h1.innerText = i;
        block.appendChild(h1);
        e.appendChild(block);
    }
});
var pagetransitions = [
    function(fos){
        if(fos){
            document.querySelector("fullpage[page='1'] > #timecard").setAttribute("active", 0);
            return document.querySelector("fullpage[page='1'] > #content").setAttribute("active", 1);
        }
        new Audio("sounds/harp.wav").play();
        var text = [..."London\nJune 17, 1912"]
        var intervals = text.map(() => 50 + Math.random() * 400);
        for(var i=0;i<text.length;i++){
            ((ci) => setTimeout(function(){
                document.querySelector("fullpage[page='1'] > #timecard").textContent += text[ci];
                text[ci].trim().length ? new Audio(`sounds/kb/${Math.round(Math.random()*8)}.mov`).play() : new Audio(`sounds/kb/${[9, Math.round(Math.random()*8)][Math.round(Math.random())]}.mov`).play();
                if(ci == text.length-1){
                    setTimeout(() => {
                        document.querySelector("fullpage[page='1'] > #timecard").setAttribute("active", 0);
                        document.querySelector("fullpage[page='1'] > #content").setAttribute("active", 1);
                    }, 3000)
                }
            }, intervals.slice(0, i).reduce((a, i) => a + i, 0)))(i);
        }
    },
    function(fos){
        document.querySelectorAll("tape").forEach((e) => e.setAttribute("active", 1));
        var i = 0;
        var center = Math.ceil(tape.length / 2);
        rintervals.push(setInterval(function(){
            var ni = 1000;
            while(Math.abs(ni) > tape.length/6 || ni == i){
                ni = i + Math.round(Math.random() * 10 - 5);
            }
            i = ni;
            document.querySelector("fullpage[page='2'] > tape").style.transform = `translate(calc(-50% + ${48*i}px + ${8 * i}vh)`;
            tape[center - i - 1] = 1 - tape[center - i - 1];
            setTimeout(function(){
                document.querySelectorAll("fullpage[page='2'] > tape > block > h1")[center - i - 1].innerText = tape[center - i - 1];
                new Audio("sounds/punch.m4a").play();
            }, 1000);
        }, 2000));
        setTimeout(function(){
            document.querySelector("img#pagetransition").setAttribute("active", 1);
        }, fos ? 1 : 5000);
    },
    function(fos){
        console.log(page);
        rintervals.forEach((i) => clearInterval(i));
        rintervals = [];

        function playMorse(){
            var i = 0;
            var message = ["TOI 15.51 GMT To: Schad, Karl  Report situation", "TOI 22.25 GMT To: WINTER  Maintain position.", "TOI 16.25 GMT From: #GRUPPEWEST To: All  The enemy landing DEAUVILLE-ST.VAAST now in progress is recognisable as a major operation. [1/2]", "TOI 18.32 GMT From: 40th M/S Flotilla To: Subdivision V715  Be at point 344 at 0200/7/6 as 'GB' escort for Z32, Z24 and ZH1 to BREST.", "TOI 15.49 GMT From: Location H.Q. collecting centre NORMANDY To: Location H.Q. Channel  MOST IMMEDIATE. ARROMANCHES base surrounded at 1500. Sets blown up. Communications have broken down.", "TOI 21.38 GMT To: #KARL  Endeavour to reach CHERBOURG. Attack enemy formations as long as ammunition lasts.", "TOI 20.40 GMT From: 3rd Defence Division To: S.O. 2nd M/S Flotilla  MOST IMMEDIATE. Watch out for U-Boats leaving ((BREST)).", "TOI 20.32 GMT From: FOIC Western Defences. To: All FOIC Western Defences Forces  MOST IMMEDIATE . When attacking the landing boats approach as close as possible to them, thereby rendering it very much more difficult for enemy battle forces to [1/2]", "TOI 21.23 GMT From: S.O. S. Boats  MOST IMMEDIATE. 14 own S-Boats leaving CHERBOURG to attack shipping concentrations MARCOUF-BARFLEUR. Returning to port at first light.", "TOI 16.39 GMT From: Admiral SKAGERRAK To: KARL GALSTER', 2nd S-Boat training Flotilla  One hour's notice from sunset until sunrise until further notice.", "TOI 19.44 GMT From: Senior Officer To: Boats on Station  Apropros of large-scale landing on the Channel Coast, surprise appearance of enemy is to be reckoned with in this area also. Heightened vigilance.", "TOI 12.05 GMT From: S.O. #8th Z-Flotilla  MOST IMMEDIATE. In W/T message 1157 alter speed to 24 knots.", "TOI 22.38 GMT From: Location reports collecting station NORMANDY To: S-Boats  MOST IMMEDIATE. At 0016 'FMB' ST. PIERRE EGLISE enemy target line bearing ('STRICHPEILUNG') 66 degrees."].sort((a, b) => 0.5 - Math.random()).join(" ");
            var enigmamessage = enigma().encodeString(message)
            var morsemessage = MorseCode.encode(enigmamessage);
            document.getElementById("morsetape").innerText = morsemessage;
            morse.onCharacterPlay = function(){
                document.getElementById("enigmatape").textContent += enigmamessage[i];
                document.getElementById("decodedtape").textContent += message[i];
                i++;
            }
            morse.setReal(true);
            morse.play(enigmamessage);
            setTimeout(function(){
                document.getElementById("morsetape").style.transition = `${morse.getRemaining().toFixed(1)}s linear`;
                document.getElementById("morsetape").setAttribute("active", 1);
            }, 1500);
        }

        if(fos){
            document.querySelector("fullpage[page='3'] > #landing").setAttribute("active", 0);
            document.querySelector("fullpage[page='3'] > #content").setAttribute("active", 1);
            return playMorse();
        }
        document.querySelector("img#pagetransition").setAttribute("active", 2);
        document.querySelector("img#bletchley").setAttribute("active", 1);
        var text = [[..."Bletchley Park"], [..."WWII"]];
        var intervals = [text[0].map(() => 50 + Math.random() * 400), text[1].map(() => 500 + Math.random() * 200)];
        for(var i=0;i<text[0].length;i++){
            ((ci) => setTimeout(function(){
                document.querySelector("fullpage[page='3'] > #landing >#timecard").textContent += text[0][ci];
                text[0][ci].trim().length ? new Audio(`sounds/kb/${Math.round(Math.random()*8)}.mov`).play() : new Audio(`sounds/kb/${[9, Math.round(Math.random()*8)][Math.round(Math.random())]}.mov`).play();
                if(ci == text[0].length-1){
                    setTimeout(() => {
                        var span = document.createElement("span");
                        span.style.fontSize = "10vh";
                        span.style.fontWeight = "900";
                        document.querySelector("fullpage[page='3'] > #landing > #timecard").appendChild(document.createElement("br"));
                        document.querySelector("fullpage[page='3'] > #landing > #timecard").appendChild(span);
                        new Audio("sounds/bass.wav").play();
                    }, 1500)
                }
            }, 1500 + intervals[0].slice(0, i).reduce((a, i) => a + i, 0)))(i);
        }
        for(var i=0;i<text[1].length;i++){
            ((ci) => setTimeout(function(){
                document.querySelector("fullpage[page='3'] > #landing > #timecard > span").textContent += text[1][ci];
                text[0][ci].trim().length ? new Audio(`sounds/kb/${Math.round(Math.random()*8)}.mov`).play() : new Audio(`sounds/kb/${[9, Math.round(Math.random()*8)][Math.round(Math.random())]}.mov`).play();
                if(ci == text[1].length-1){
                    setTimeout(() => {
                        document.querySelector("fullpage[page='3'] > #landing").setAttribute("active", 0);
                        document.querySelector("fullpage[page='3'] > #content").setAttribute("active", 1);
                        playMorse();
                    }, 3000);
                }
            }, intervals[1].slice(0, i).reduce((a, i) => a + i, 0) + 3250 + intervals[0].reduce((a, i) => a + i, 0)))(i);
        }
    },
    function(){ morse.stop() },
    function(){
        var active = 0;
        document.querySelector("fullpage[page='5'] > h1").setAttribute("active", 1);
        document.querySelectorAll("fullpage[page='5'] > h1").forEach((e) => e.addEventListener("click", () => {
            active = (active + 1) % 3;
            document.querySelectorAll("fullpage[page='5'] > h1").forEach((e, i) => {
                console.log(i, active, +(i==active))
                e.setAttribute("active", +(i == active))
            });
        }));
    }
]

document.querySelectorAll("#pagetransition").forEach((e) => e.addEventListener("click", function(){
    document.querySelector(`fullpage[page='${page}']`).setAttribute("active", 0);
    pagetransitions[page](fast.includes(page));
    document.querySelector(`fullpage[page='${page+1}']`).setAttribute("active", 1);
    page++;
}));