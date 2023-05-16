const icaoInput = document.getElementById("icaoInput") as HTMLInputElement
const goButton = document.getElementById("goButton") as HTMLButtonElement

goButton.addEventListener("click", () => {
    const icao = icaoInput.value
    window.open(`https://chartfox.org/${icao}`)
})