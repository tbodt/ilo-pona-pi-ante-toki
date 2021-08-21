const nena = document.getElementById('o-pali');
const pokiTokiJan = document.getElementById('toki-pana');
const pokiTokiIlo = document.getElementById('toki-kama');

function kipisiENimi(tokiPona) {
    // sitelen .;:?! li kipisi e toki a
    const KIPISI_TOKI = /[.;:?!]/;
    // weka sitelen pi nasin Juniko en sitelen pi awen uta li kipisi e nimi
    // TEKA: o kepeken nasin Juniko a
    const KIPISI_NIMI = /[\s,-]/;
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
            case "la": nasin = "la"; break;
            case "li": case "o": case "e": case "en": nasin = "poki"; break;
            case "lon": case "tawa": case "tan": case "sama": case "kepeken": nasin = "ken poki"; break;
            case "pi": nasin = "pi"; break;
        }
        nimi.nasin = nasin;
        tokiNasin.push(nimi)
    }
    return tokiNasin;
}

function kipisiENimiLa(toki) {
    let kulupuPiPokiLa = [];
    let kulupuNi = [];
    kulupuPiPokiLa.push(kulupuNi);
    for (let nimi of toki) {
        if (nimi.nimi === "la") {
            kulupuNi = [];
            kulupuPiPokiLa.push(kulupuNi);
        } else {
            kulupuNi.push(nimi);
        }
    }
    if (kulupuNi.length === 0)
        kulupuPiPokiLa.pop();
    return kulupuPiPokiLa;
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

function pokiEInsaTeLaTo(toki) {
    // nimi nanpa wan li "taso" la ona li ken nasa. nimi nanpa tu li poki li ken ala poki ala la mi nasa e ona.
    if (toki[0] !== undefined && toki[0].nimi === "taso") {
        if (toki[1] !== undefined && !["la", "poki"].includes(toki[1].nasin))
            toki[0].nasin = "nasa";
    }

    let nimiLiLiLon = false;
    for (let nimi of toki) {
        if (nimi.nimi === "li")
            nimiLiLiLon = true;
    }

    let tokiPoki = [];
    let pokiPiTenpoNi = null;
    function openEPoki(nimi) {
        let wawa = WAWA_POKI[nimi];
        if (wawa === undefined)
            wawa = 0;
        pokiPiTenpoNi = {nimi, wawa, insa: [[]]};
        tokiPoki.push(pokiPiTenpoNi);
    }
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
        // taso poki "li" li lon ala la ona li ken wile poki anu seme
        if (nimi.nasin == "ken poki") {
            if (nimiKama === undefined || ["ken poki", "poki"].includes(nimiKama.nasin))
                nimi.nasin = "ijo";
            else if (nimiLiLiLon && (nimiPini === undefined || nimiPini.nasin === "nasa" || (nimiPini.nasin === "poki" && nimiPini.nimi !== "li")))
                nimi.nasin = "ijo";
            else
                nimi.nasin = "poki";
        }

        if (nimi.nasin === "ijo") {
            if (pokiPiTenpoNi === null)
                openEPoki("en");
            pokiPiTenpoNi.insa[pokiPiTenpoNi.insa.length-1].push(nimi);
        } else if (nimi.nasin === "pi") {
            if (pokiPiTenpoNi === null)
                openEPoki("en");
            pokiPiTenpoNi.insa.push([]);
        } else if (nimi.nasin === "nasa") {
            if (pokiPiTenpoNi === null || pokiPiTenpoNi.nimi !== "nasa")
                openEPoki("nasa");
            pokiPiTenpoNi.nasa = nimi;
            pokiPiTenpoNi = null;
        } else if (nimi.nasin === "poki") {
            openEPoki(nimi.nimi);
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
    return tokiPoki;
}

function tokiInliEToki(toki) {
    let sitelenInli = "";
    for (let n = 0; n < toki.length; n++) {
        let tokiInli = [];
        let pokiLa = toki[n];
        if (n !== toki.length - 1) {
            let pokiLiLiLon = false;
            let pokiEnLiLon = false;
            for (let poki of pokiLa) {
                if (poki.nimi === "li")
                    pokiLiLiLon = true;
                else if (poki.nimi === "en" && poki.insa.length > 0)
                    pokiEnLiLon = true;
            }

            // poki "li" li lon la mi wile e "When" anu ", so" anu seme.
            // ala la poki "en" li lon la mi wile e "In the context of" anu "Given".
            // ala la mi toki e ala. nimi poki li nanpa wan li toki e kon poki li pona.
            if (pokiLiLiLon)
                tokiInli.push("When");
            else if (pokiEnLiLon)
                tokiInli.push("In the context of");
        }
        tokiInli.push(...tokiInliEInsaTeLaTo(pokiLa));
        let inli = tokiInli.join(" ");
        if (n !== toki.length - 1) {
            inli += ", ";
        }
        sitelenInli += inli;
    }
    sitelenInli = sitelenInli.charAt(0).toUpperCase() + sitelenInli.slice(1) + ". ";
    return sitelenInli;
}

function tokiInliEInsaTeLaTo(toki) {
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

            case "nasa":
                if (poki.nasa.nimi === "taso")
                    tokiInli.push("but");
                break;

            default:
                if (KON_NIMI[poki.nimi] !== undefined && KON_NIMI[poki.nimi].poki !== undefined) {
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
        toki = kipisiENimiLa(toki);
        let tokiPoki = toki.map(pokiEInsaTeLaTo);
        tokiInli += tokiInliEToki(tokiPoki);
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
