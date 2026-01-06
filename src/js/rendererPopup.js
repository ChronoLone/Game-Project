const countDiv = document.getElementById("counter");
const openButton = document.getElementById("openButton");

openButton.addEventListener("click", () => {
    openButton.remove();
    let number = 3;
    countDiv.textContent = number; //show "3" on screen

    //runs every 1 second
    const countdown = setInterval(() => {
        number--;
        if (number > 0) {
            countDiv.textContent = number;
        } else if (number != -2) {
            countDiv.textContent = "SURPRISE!!";
        } else {
            clearInterval(countdown); //close window after 5 seconds
            window.electronAPI.closePopup();
        }
    }, 1000); //1000ms = 1s
});