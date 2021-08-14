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
    let pokiPiTenpoNi = {nimi: "en", insa: []};
    tokiPoki.push(pokiPiTenpoNi);
    for (let nimi of toki) {
        if (nimi.nasin === "ijo") {
            pokiPiTenpoNi.insa.push(nimi);
        } else if (nimi.nasin === "poki") {
            pokiPiTenpoNi = {nimi: nimi.nimi, insa: []};
            tokiPoki.push(pokiPiTenpoNi);
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
        tokiInli.push(...tokiInliEIjo(poki.insa));
    }
    return tokiInli;
}

function tokiInliEIjo(ijo) {
    let tokiInli = [];
    for (let nimi of [...ijo].reverse()) {
        nimi = nimi.nimi;
        let konNimi = KON_NIMI[nimi];
        if (konNimi !== undefined)
            nimi = konNimi.ijo;
        tokiInli.push(nimi);
    }
    return tokiInli;
}

function anteEToki(tokiPona) {
    tokiMute = kipisiENimi(tokiPona);
    tokiInli = '';
    for (let toki of tokiMute) {
        toki = sonaENasinNimi(toki);
        toki = pokiENimi(toki);
        toki = tokiInliEToki(toki);
        toki = toki.join(" ");
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
