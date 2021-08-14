const nena = document.getElementById('o-pali');
const pokiTokiJan = document.getElementById('toki-pana');
const pokiTokiIlo = document.getElementById('toki-kama');

function kipisiENimi(tokiPona) {
    // sitelen .;:?! li kipisi e toki a
    const KIPISI_TOKI = /[.;:?!]/;
    // weka sitelen pi nasin Juniko li kipisi e nimi
    // WILE: o kepeken nasin Juniko a
    const KIPISI_NIMI = /\s/;
    // sitelen ante ale li nimi.

    tokiPona = tokiPona.split(KIPISI_TOKI).map(toki => toki.split(KIPISI_NIMI));
    return tokiPona;
}

function sonaENasinNimi(toki) {
    // nasin nimi seme li lon?
    // - poki suli: la
    // - poki: li, o, e
    // - pi
    // - ijo
    let tokiNasin = [];
    for (let nimi of toki) {
        nimi = {nimi};
        let nasin = "ijo";
        switch (nimi.nimi) {
                //case "la": nasin = "la"; break;
            case "li": case "o": case "e": nasin = "poki"; break;
            case "pi": nasin = "pi"; break;
        }
        nimi.nasin = nasin;
        tokiNasin.push(nimi)
    }
    return tokiNasin;
}

function pokiENimi(toki) {
    let tokiPoki = [];
    let pokiPiTenpoNi = {nimi: "en", insa: [[]]};
    tokiPoki.push(pokiPiTenpoNi);
    for (let nimi of toki) {
        if (nimi.nasin === "ijo") {
            pokiPiTenpoNi.insa[pokiPiTenpoNi.insa.length-1].push(nimi);
        } else if (nimi.nasin === "poki") {
            pokiPiTenpoNi = {nimi: nimi.nimi, insa: [[]]};
            tokiPoki.push(pokiPiTenpoNi);
        } else if (nimi.nasin === "pi") {
            pokiPiTenpoNi.insa.push([]);
        }
    }
    return tokiPoki;
}

function tokiInliEToki(toki) {
    let tokiInli = [];
    for (let poki of toki) {
        if (poki.nimi === "li") {
            tokiInli.push("does");
        } else if (poki.nimi === "e") {
            tokiInli.push("the");
        }
        tokiInli.push(...tokiInliEIjo(poki));
    }
    return tokiInli;
}

function tokiInliEIjo(pokiIjo) {
    let tokiInli = [];
    for (let nPoki = pokiIjo.insa.length; nPoki--; nPoki >= 0) {
        let pokiPi = pokiIjo.insa[nPoki];
        let inliPiPokiPi = [];
        for (let nimi of [...pokiPi].reverse()) {
            nimi = nimi.nimi;
            let konNimi = KON_NIMI[nimi];
            if (konNimi !== undefined) {
                let nasinKon = 'ijo';
                if (pokiIjo.nimi === "li" && nPoki === 0) {
                    // ken suli la, nimi nanpa wan pi poki "li" li pali.
                    nasinKon = 'pali';
                }
                if (konNimi[nasinKon] === undefined)
                    nasinKon = 'ijo';
                nimi = konNimi[nasinKon];
            }

            inliPiPokiPi.push(nimi);
        }
        tokiInli.push(inliPiPokiPi.join("-"));
    }
    return tokiInli;
}

function anteEToki(tokiPona) {
    tokiMute = kipisiENimi(tokiPona);
    tokiInli = '';
    for (let toki of tokiMute) {
        toki = sonaENasinNimi(toki);
        let poki = pokiENimi(toki);
        console.log(poki);
        let inli = tokiInliEToki(poki);
        toki = inli.join(" ");
        toki = toki.charAt(0).toUpperCase() + toki.slice(1);
        tokiInli += toki + '. ';
    }
    return tokiInli;
}

function paliEAnteToki() {
    pokiTokiIlo.innerText = anteEToki(pokiTokiJan.value);
}
document.getElementById('o-pali').addEventListener('click', function() {
    paliEAnteToki();
});
paliEAnteToki();
