let h1E1 = document.querySelector("h1");

if (localStorage.antallBesok) {
    localStorage.antallBesok = Number(localStorage.antallBesok) + 1;
    
} else {
    localStorage.antallBesok = 1;
}

h1E1.innerHTML = "Du har besøkt denne siden " + localStorage.antallBesok + "ganger.";