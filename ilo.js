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
    tokiPona = tokiPona.map(toki => toki.filter(nimi => nimi !== ""));
    tokiPona = tokiPona.filter(toki => toki.length !== 0);
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
            case "li": case "o": case "e": case "en": nasin = "poki"; break;
            case "pi": nasin = "pi"; break;
        }
        nimi.nasin = nasin;
        tokiNasin.push(nimi)
    }
    return tokiNasin;
}

// ijo ni li tawa sona ni: nimi "and" li wile ala wile lon open poki?
// ilo li lukin e nimi nanpa pini li tawa pini. ona li kama lukin e poki pi
// wawa sama la nimi "and" li wile. poki pini li wawa mute tawa poki ni la
// lukin li pini.
// nasin li nasa. taso ona li sona pona.
const WAWA_POKI = {
    "en": 3,
    "li": 2,
    "o": 2,
    "e": 1,
};

function pokiENimi(toki) {
    let tokiPoki = [];
    let pokiPiTenpoNi = {nimi: "en", wawa: WAWA_POKI["en"], insa: [[]]};
    tokiPoki.push(pokiPiTenpoNi);
    for (let nimi of toki) {
        if (nimi.nasin === "ijo") {
            pokiPiTenpoNi.insa[pokiPiTenpoNi.insa.length-1].push(nimi);
        } else if (nimi.nasin === "poki") {
            let wawa = WAWA_POKI[nimi.nimi];
            if (wawa === undefined)
                wawa = 0;
            pokiPiTenpoNi = {nimi: nimi.nimi, wawa, insa: [[]]};
            tokiPoki.push(pokiPiTenpoNi);
        } else if (nimi.nasin === "pi") {
            pokiPiTenpoNi.insa.push([]);
        }
    }
    return tokiPoki;
}

function tokiInliEToki(toki) {
    let tokiInli = [];
    for (let nPoki = 0; nPoki < toki.length; nPoki++) {
        let poki = toki[nPoki];
        let wileAnd = false;
        for (let nAlasaWawa = nPoki - 1; nAlasaWawa >= 0 && toki[nAlasaWawa].wawa <= poki.wawa; nAlasaWawa--) {
            if (poki.wawa == toki[nAlasaWawa].wawa) {
                wileAnd = true;
                break;
            }
        }
        if (wileAnd)
            tokiInli.push("and");
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
