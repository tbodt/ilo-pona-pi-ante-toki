const nena = document.getElementById('o-pali');
const pokiTokiJan = document.getElementById('toki-pana');
const pokiTokiIlo = document.getElementById('toki-kama');

function kipisiENimi(tokiPona) {
    // sitelen .;:?! li kipisi e toki a
    const KIPISI_TOKI = /[.;:?!]/;
    // weka sitelen pi nasin Juniko li kipisi e nimi
    // TEKA: o kepeken nasin Juniko a
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
            case "lon": case "tawa": case "tan": case "sama": case "kepeken": nasin = "ken poki"; break;
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
    for (let n = 0; n < toki.length; n++) {
        let nimi = toki[n];
        let nimiPini = toki[n-1];
        let nimiKama = toki[n+1];

        // nimi "lon" en sama li ken ijo li ken poki kin. nasin ni la mi sona:
        // ala li lon insa poki la ken suli la nimi li poki ala.
        // tenpo ni la mi lukin e nimi taso e poki ala. ni la nasin li ni:
        // nimi ni li ken poki la, nimi kama nanpa wan kin li ken, anu nimi kama nanpa wan li lon ala, la nimi ni li poki ala.
        //
        // nasin sin:
        // nimi nanpa pini li lon ala, anu ona li poki li nimi "li" ala, la ken suli la nimi ni li poki ala.
        if (nimi.nasin == "ken poki") {
            if (nimiKama === undefined || ["ken poki", "poki"].includes(nimiKama.nasin))
                nimi.nasin = "ijo";
            else if (nimiPini === undefined || (nimiPini.nasin === "poki" && nimiPini.nimi !== "li"))
                nimi.nasin = "ijo";
            else
                nimi.nasin = "poki";
        }

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

    for (let poki of tokiPoki) {
        // ala li lon insa poki pi nimi "li" la ilo li awen pana e poki nasa pi ijo ala tan ni: nimi "pi" li **ken** lon kama. mi weka e ni.
        if (poki.insa.length == 1 && poki.insa[0].length == 0)
            poki.insa = [];

        // poki li "li" la nimi nanpa wan pi poki "pi" nanpa wan li ken pali.
        if (poki.nimi === "li" && poki.insa.length > 0) {
            let nimiNanpaWan = poki.insa[0][0];
            let konKen = KON_NIMI[nimiNanpaWan.nimi];
            // nimi li ken pali la mi nimi pali e ona.
            // TEKA: ken la tenpo kama la nimi pi ken pali li wile ala pali. nimi "nasin" li wile ijo lon tenpo mute li sama ala "organize". "ni li nasin" li "this organizes" ala.
            if (konKen !== undefined && konKen.pali !== undefined)
                nimiNanpaWan.nasin = "pali";
        }
    }
    console.log(tokiPoki);
    return tokiPoki;
}

function tokiInliEToki(toki) {
    let tokiInli = [];
    for (let nPoki = 0; nPoki < toki.length; nPoki++) {
        let poki = toki[nPoki];
        let wileAnd = false;
        for (let nAlasaWawa = nPoki - 1; nAlasaWawa >= 0 && toki[nAlasaWawa].wawa <= poki.wawa; nAlasaWawa--) {
            if (poki.nimi == toki[nAlasaWawa].nimi) {
                wileAnd = true;
                break;
            }
        }
        if (wileAnd)
            tokiInli.push("and");
        switch (poki.nimi) {
            case "li":
                // poki ni la, nimi li pali lon toki inli la ni o "does". nimi li ijo lon toki inli la ni o "is".
                if (poki.insa.length == 0 || poki.insa[0][0].nasin === "ijo")
                    // TEKA: nimi e li lon la mi wile e nimi sama "make".
                    tokiInli.push("is");
                else
                    tokiInli.push("does");
                break;
            case "e":
                // TEKA: o weka e ni. ni li sona ike.
                tokiInli.push("the");
                break;
            case "en":
                break;

            default:
                if (KON_NIMI[poki.nimi] !== undefined || KON_NIMI[poki.nimi].poki !== undefined) {
                    tokiInli.push(KON_NIMI[poki.nimi].poki);
                    break;
                }
                console.log('mi sona ala toki Inli e lawa pi poki ni', poki);
                break;
        }
        tokiInli.push(...tokiInliEIjo(poki));
    }
    return tokiInli;
}

function tokiInliEIjo(pokiIjo) {
    let tokiInli = [];
    for (let nPoki = pokiIjo.insa.length - 1; nPoki >= 0; nPoki--) {
        let pokiPi = pokiIjo.insa[nPoki];
        let inliPiPokiPi = [];
        for (let nPokiPi = pokiPi.length - 1; nPokiPi >= 0; nPokiPi--) {
            nimi = pokiPi[nPokiPi].nimi;
            let konNimi = KON_NIMI[nimi];
            if (konNimi !== undefined) {
                let nasinKon = 'ijo';
                if (pokiIjo.nimi === "li" && nPoki === 0 && nPokiPi === 0) {
                    // ken suli la, nimi nanpa wan pi poki "li" li pali.
                    nasinKon = 'pali';
                }
                if (konNimi[nasinKon] === undefined)
                    nasinKon = 'ijo';
                nimi = konNimi[nasinKon];
            }

            inliPiPokiPi.push(nimi);
        }
        let insa = "-";
        if (nPoki == 0)
            insa = " ";
        tokiInli.push(inliPiPokiPi.join(insa));
    }
    return tokiInli;
}

function anteEToki(tokiPona) {
    tokiMute = kipisiENimi(tokiPona);
    tokiInli = '';
    for (let toki of tokiMute) {
        toki = sonaENasinNimi(toki);
        let poki = pokiENimi(toki);
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
