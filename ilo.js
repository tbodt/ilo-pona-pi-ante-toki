const nena = document.getElementById('o-pali');
const pokiTokiJan = document.getElementById('toki-pana');
const pokiTokiIlo = document.getElementById('toki-kama');

// toki Inli li ike.
Array.prototype.pana = Array.prototype.push;
Array.prototype.jo = Array.prototype.includes;
Object.defineProperty(Array.prototype, 'mute', {
    get() { return this.length; }
});
const lonAla = false;
const lon = true;
const oToki = console.log;
const weka = undefined;

function kipisiENimi(tokiPona) {
    // sitelen .;:?! li kipisi e toki a
    const KIPISI_TOKI = /[.;:?!]/;
    // weka sitelen pi nasin Juniko en sitelen pi awen uta li kipisi e nimi
    // TEKA: o kepeken nasin Juniko a
    const KIPISI_NIMI = /[\s,-]/;
    // sitelen ante ale li nimi.

    tokiPona = tokiPona.split(KIPISI_TOKI).map(toki => toki.split(KIPISI_NIMI));
    tokiPona = tokiPona.map(toki => toki.filter(nimi => nimi !== ""));
    tokiPona = tokiPona.filter(toki => toki.mute !== 0);
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
        let kon = KON_NIMI[nimi.nimi];
        if (kon !== weka) {
            if (kon.nasin !== weka)
                nasin = kon.nasin;
            else if (kon.poki !== weka)
                nasin = "ken poki";
            else if (kon.pokaPali !== weka)
                nasin = "ken poka pali";
        }
        nimi.nasin = nasin;
        tokiNasin.pana(nimi)
    }
    return tokiNasin;
}

function kipisiENimiLa(toki) {
    let kulupuPiPokiLa = [];
    let kulupuNi = [];
    kulupuPiPokiLa.pana(kulupuNi);
    for (let nimi of toki) {
        if (nimi.nimi === "la") {
            kulupuNi = [];
            kulupuPiPokiLa.pana(kulupuNi);
        } else {
            kulupuNi.pana(nimi);
        }
    }
    if (kulupuNi.mute === 0)
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
    if (toki[0] !== weka && toki[0].nimi === "taso") {
        if (toki[1] !== weka && !["la", "poki"].jo(toki[1].nasin))
            toki[0].nasin = "nasa";
    }

    let nimiLiLiLon = lonAla;
    for (let nimi of toki) {
        if (nimi.nimi === "li")
            nimiLiLiLon = lon;
    }

    let tokiPoki = [];
    let pokiPiTenpoNi = null;
    function openEPoki(nimi) {
        let wawa = WAWA_POKI[nimi];
        if (wawa === weka)
            wawa = 0;
        pokiPiTenpoNi = {nimi, wawa, insa: [[]], poka: []};
        tokiPoki.pana(pokiPiTenpoNi);
    }
    for (let n = 0; n < toki.mute; n++) {
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
            if (nimiKama === weka || ["ken poki", "poki"].jo(nimiKama.nasin))
                nimi.nasin = "ijo";
            else if (nimiLiLiLon && (nimiPini === weka || ["pi", "nasa"].jo(nimiPini.nasin) || (nimiPini.nasin === "poki" && nimiPini.nimi !== "li")))
                nimi.nasin = "ijo";
            else
                nimi.nasin = "poki";
        }

        if (nimi.nasin === "ken poka pali") {
            // MI SONA ALA A e nasin pona. seme la nimi li pali kin? A
            // ona li poka pali lon tenpo mute la mi pali e ni: ona li poka pali lon tenpo ale. tenpo kama la ni o pona
            if (nimiPini !== weka && (nimiPini.nimi === "li" || nimiPini.nasin === "poka"))
                nimi.nasin = "poka";
            else
                nimi.nasin = "ijo";
        }

        if (nimi.nasin === "ijo") {
            if (pokiPiTenpoNi === null)
                openEPoki("en");
            pokiPiTenpoNi.insa[pokiPiTenpoNi.insa.mute-1].pana(nimi);
        } else if (nimi.nasin === "pi") {
            if (pokiPiTenpoNi === null)
                openEPoki("en");
            pokiPiTenpoNi.insa.pana([]);
        } else if (nimi.nasin === "nasa") {
            if (pokiPiTenpoNi === null || pokiPiTenpoNi.nimi !== "nasa")
                openEPoki("nasa");
            pokiPiTenpoNi.nasa = nimi;
            pokiPiTenpoNi = null;
        } else if (nimi.nasin === "poka") {
            pokiPiTenpoNi.poka.push(nimi);
        } else if (nimi.nasin === "poki") {
            openEPoki(nimi.nimi);
        }
    }

    for (let poki of tokiPoki) {
        // ala li lon insa poki pi nimi "li" la ilo li awen pana e poki nasa pi ijo ala tan ni: nimi "pi" li **ken** lon kama. mi weka e ni.
        if (poki.insa.mute == 1 && poki.insa[0].mute == 0)
            poki.insa = [];

        // poki li "li" la nimi nanpa wan pi poki "pi" nanpa wan li wile pali.
        // ala la ona li wile ijo.
        // nimi ante pi poki pi li wile kule.

        for (let nPokiPi = 0; nPokiPi < poki.insa.mute; nPokiPi++) {
            let pokiPi = poki.insa[nPokiPi];
            for (let nNimi = 0; nNimi < pokiPi.mute; nNimi++) {
                let nimi = pokiPi[nNimi];

                // mi lukin e kon wile pi nimi ni.
                // nimi li nanpa wan ala lon poki pi la ona li wile nimi kule.
                // ala la, ona li lon poki "pi" nanpa wan pi poki "li" la ona li wile nimi pali.
                // ala la, ona li wile ijo.
                let nasinKon;
                if (nNimi !== 0)
                    nasinKon = "kule";
                else if (poki.nimi === "li")
                    nasinKon = "pali";
                else
                    nasinKon = "ijo";

                // TEKA: ken la tenpo kama la nimi pi ken pali li wile ala pali. nimi "nasin" li wile ijo lon tenpo mute li sama ala "organize". "ni li nasin" li "this organizes" ala.

                // nasin kon wile li ken ala la mi kepeken nasin ante ken.
                let konKen = KON_NIMI[nimi.nimi];
                if (konKen !== weka && konKen[nasinKon] === weka) {
                    let konPonaNanpa = ["ijo", "kule", "pali"];
                    for (let kon of konPonaNanpa) {
                        if (kon === nasinKon) continue;
                        if (konKen[kon] !== weka) {
                            nasinKon = kon;
                            break;
                        }
                    }
                }
                nimi.nasin = nasinKon;
            }
        }
    }
    return tokiPoki;
}

function tokiInliEToki(toki) {
    let sitelenInli = "";
    for (let n = 0; n < toki.mute; n++) {
        let tokiInli = [];
        let pokiLa = toki[n];
        if (n !== toki.mute - 1) {
            let pokiLiLiLon = lonAla;
            let pokiEnLiLon = lonAla;
            for (let poki of pokiLa) {
                if (poki.nimi === "li")
                    pokiLiLiLon = lon;
                else if (poki.nimi === "en" && poki.insa.mute > 0)
                    pokiEnLiLon = lon;
            }

            // poki "li" li lon la mi wile e "When" anu ", so" anu seme.
            // ala la poki "en" li lon la mi wile e "In the context of" anu "Given".
            // ala la mi toki e ala. nimi poki li nanpa wan li toki e kon poki li pona.
            if (pokiLiLiLon)
                tokiInli.pana("When");
            else if (pokiEnLiLon)
                tokiInli.pana("In the context of");
        }
        tokiInli.pana(...tokiInliEInsaTeLaTo(pokiLa));
        let inli = tokiInli.join(" ");
        if (n !== toki.mute - 1) {
            inli += ", ";
        }
        sitelenInli += inli;
    }
    sitelenInli = sitelenInli.charAt(0).toUpperCase() + sitelenInli.slice(1) + ". ";
    return sitelenInli;
}

function tokiInliEInsaTeLaTo(toki) {
    let tokiInli = [];
    let pokiELiLon = false;
    for (let poki of toki) {
        if (poki.nimi === "e")
            pokiELiLon = true;
    }
    for (let nPoki = 0; nPoki < toki.mute; nPoki++) {
        let poki = toki[nPoki];
        let wileAnd = lonAla;
        for (let nAlasaWawa = nPoki - 1; nAlasaWawa >= 0 && toki[nAlasaWawa].wawa <= poki.wawa; nAlasaWawa--) {
            if (poki.nimi == toki[nAlasaWawa].nimi) {
                wileAnd = lon;
                break;
            }
        }
        if (wileAnd)
            tokiInli.pana("and");
        switch (poki.nimi) {
            case "li":
                // ken ale:
                // nimi li ijo ala ijo?
                // ala li lon ala lon insa poka?
                // poki E li lon ala lon?
                // ona li wile moku e ijo
                // ijo,  poka ala, E:       it does make-into-food the thing
                // ijo,  poka ala, E ala:   it is red
                // ijo,  poka, E:           it does want to make-into-food the thing
                // ijo,  poka, E ala:       it does want to be food
                // pali, poka ala, E:       it does eat the thing
                // pali, poka ala, E ala:   it does eat
                // pali, poka, E:           it does want to eat the thing
                // pali, poka, E ala:       it does want to eat
                // poki ni la, nimi li pali lon toki inli la ni o "does". nimi li ijo lon toki inli la ni o "is".
                let pokaLiAla = poki.poka.mute === 0;
                let nimiLiIjo = poki.insa.mute === 0 || poki.insa[0][0].nasin !== "pali";
                let nimiLiSamaPali = !nimiLiIjo || pokiELiLon;
                if (!nimiLiSamaPali && pokaLiAla)
                    tokiInli.pana("is");
                else
                    tokiInli.pana("does");
                for (let poka of poki.poka)
                    tokiInli.pana(KON_NIMI[poka.nimi].pokaPali);
                if (nimiLiIjo && pokiELiLon)
                    tokiInli.pana("make-into");
                if (!nimiLiSamaPali && !pokaLiAla)
                    tokiInli.pana("be");
                break;
            case "e":
                // TEKA: o weka e ni. ni li sona ike.
                tokiInli.pana("the");
                break;
            case "en":
                break;

            case "nasa":
                if (poki.nasa.nimi === "taso")
                    tokiInli.pana("but");
                break;

            default:
                if (KON_NIMI[poki.nimi] !== weka && KON_NIMI[poki.nimi].poki !== weka) {
                    tokiInli.pana(KON_NIMI[poki.nimi].poki);
                    break;
                }
                oToki('mi sona ala toki Inli e lawa pi poki ni', poki);
                break;
        }
        tokiInli.pana(...tokiInliEIjo(poki));
    }
    return tokiInli;
}

function tokiInliEIjo(pokiIjo) {
    let tokiInli = [];
    for (let nPoki = pokiIjo.insa.mute - 1; nPoki >= 0; nPoki--) {
        let pokiPi = pokiIjo.insa[nPoki];
        let inliPiPokiPi = [];
        for (let nPokiPi = pokiPi.mute - 1; nPokiPi >= 0; nPokiPi--) {
            let nimi = pokiPi[nPokiPi].nimi;
            let nasinKon = pokiPi[nPokiPi].nasin;
            let konNimi = KON_NIMI[nimi];
            if (konNimi !== weka) {
                // ijo
                // pali
                // kule
                if (konNimi[nasinKon] === weka)
                    nimi = 'PAKALA['+nimi+']';
                else
                    nimi = konNimi[nasinKon];
            }

            inliPiPokiPi.pana(nimi);
        }
        let insa = "-";
        if (nPoki == 0)
            insa = " ";
        tokiInli.pana(inliPiPokiPi.join(insa));
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
