var fast = []
var page = 0;
var tape = new Array(3*parseInt(window.innerWidth / (window.innerHeight * 0.1 + 48))).fill(0).map(() => Math.round(Math.random()));
var rintervals = []
if(!(tape.length % 2)) tape.push(Math.round(Math.random()));
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
        new Audio("/vowat/sounds/harp.wav").play();
        var text = [..."London\nJune 17, 1912"]
        var intervals = text.map(() => 50 + Math.random() * 400);
        for(var i=0;i<text.length;i++){
            ((ci) => setTimeout(function(){
                document.querySelector("fullpage[page='1'] > #timecard").textContent += text[ci];
                text[ci].trim().length ? new Audio(`/vowat/sounds/kb/${Math.round(Math.random()*8)}.mov`).play() : new Audio(`/vowat/sounds/kb/${[9, Math.round(Math.random()*8)][Math.round(Math.random())]}.mov`).play();
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
                new Audio("/vowat/sounds/punch.m4a").play();
            }, 1000);
        }, 2000));
        setTimeout(function(){
            document.querySelector("img#pagetransition").setAttribute("active", 1);
        }, fos ? 1 : 5000);
    },
    function(fos){
        rintervals.forEach((i) => clearInterval(i));
        rintervals = [];
        if(fos){
            document.querySelector("fullpage[page='3'] > #landing").setAttribute("active", 0);
            return document.querySelector("fullpage[page='3'] > #content").setAttribute("active", 1);
        }
        document.querySelector("img#pagetransition").setAttribute("active", 2);
        document.querySelector("img#bletchley").setAttribute("active", 1);
        var text = [[..."Bletchley Park"], [..."WWII"]];
        var intervals = [text[0].map(() => 50 + Math.random() * 400), text[1].map(() => 500 + Math.random() * 200)];
        for(var i=0;i<text[0].length;i++){
            ((ci) => setTimeout(function(){
                document.querySelector("fullpage[page='3'] > #landing >#timecard").textContent += text[0][ci];
                text[0][ci].trim().length ? new Audio(`/vowat/sounds/kb/${Math.round(Math.random()*8)}.mov`).play() : new Audio(`/vowat/sounds/kb/${[9, Math.round(Math.random()*8)][Math.round(Math.random())]}.mov`).play();
                if(ci == text[0].length-1){
                    setTimeout(() => {
                        var span = document.createElement("span");
                        span.style.fontSize = "10vh";
                        span.style.fontWeight = "900";
                        document.querySelector("fullpage[page='3'] > #landing > #timecard").appendChild(document.createElement("br"));
                        document.querySelector("fullpage[page='3'] > #landing > #timecard").appendChild(span);
                        new Audio("/vowat/sounds/bass.wav").play();
                    }, 1500)
                }
            }, 1500 + intervals[0].slice(0, i).reduce((a, i) => a + i, 0)))(i);
        }
        for(var i=0;i<text[1].length;i++){
            ((ci) => setTimeout(function(){
                document.querySelector("fullpage[page='3'] > #landing > #timecard > span").textContent += text[1][ci];
                text[0][ci].trim().length ? new Audio(`/vowat/sounds/kb/${Math.round(Math.random()*8)}.mov`).play() : new Audio(`/vowat/sounds/kb/${[9, Math.round(Math.random()*8)][Math.round(Math.random())]}.mov`).play();
                if(ci == text[1].length-1){
                    setTimeout(() => {
                        document.querySelector("fullpage[page='3'] > #landing").setAttribute("active", 0);
                        document.querySelector("fullpage[page='3'] > #content").setAttribute("active", 1);
                    }, 3000);
                }
            }, intervals[1].slice(0, i).reduce((a, i) => a + i, 0) + 3250 + intervals[0].reduce((a, i) => a + i, 0)))(i);
        }
    }
]
document.querySelectorAll("#pagetransition").forEach((e) => e.addEventListener("click", function(){
    document.querySelector(`fullpage[page='${page}']`).setAttribute("active", 0);
    pagetransitions[page](fast.includes(page));
    document.querySelector(`fullpage[page='${page+1}']`).setAttribute("active", 1);
    page++;
}));