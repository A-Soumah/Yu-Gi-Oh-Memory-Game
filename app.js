


function starGame(){
    const restartButton=document.getElementById("restartButton")

    restartButton.addEventListener("click",restartButtonClick)
    function restartButtonClick(){
        lifepoints=8000
        restartButton.removeEventListener("click", restartButtonClick);
         // Setze die Lebenspunkte beim Neustart zurück
        spielfeld.innerHTML = ""
        clearSpielfeld(); // Lösche das Spielfeld beim Neustart
        heartCountText.innerText = `You have ${lifepoints} Lifepoints`;
        starGame()
    }
    const spielfeld=document.getElementById("spielfeld")
    const winLoseImgContainer=document.getElementById("win-lose-img-container")
    const randomNumberSet = new Set();
    const body=document.querySelector("body")
    const clickedImages = []; // Array zum Speichern der geklickten Bilder

    let url=""
    let countClicks=0
    const urlVergleichsArray=[]
    let lifepoints=8000
    let allImgClicked=true

    const heartCountText=document.getElementById("heartCountText")
    heartCountText.innerText=`You have ${lifepoints} Lifepoints `

    function clearSpielfeld() {
        spielfeld.innerHTML = ""; // Lösche den Inhalt des Spielfelds
        winLoseImgContainer.classList.remove("winLoseImgContainerStyle")
        winLoseImgContainer.innerHTML=""
        body.style.backgroundColor="white"
        heartCountText.style.color="black"
        spielfeld.style.display="grid"
    }


        function randomSort(a, b) {
            return Math.random() - 0.5;
        }


        while (randomNumberSet.size < 8) {
            randomNumberSet.add(1 + Math.floor(Math.random() * 5000));
        }

        const randomNumberArray = [...randomNumberSet];
        const fetchAndGenerateImages = async () => {
            clearSpielfeld()
            const imageArray = [];
            let data;
            try {
                const response = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
                data = await response.json();
            }
            catch (error) {
                console.error("Error fetching card data:", error);
            }

            const UrlArray=randomNumberArray.map(number=>{
                return data.data[number].card_images[0].image_url;
            })
            const doubleUrlArray=[...UrlArray,...UrlArray]

            doubleUrlArray.sort(randomSort)

            for (let i = 0; i < doubleUrlArray.length; i++) {
                spielfeld.innerHTML += `
    <div  class="cardAndSleeveDiv">  
        <div class="front">
          <img id="${i}" class="card-sleeves" src="yu-gi-oh-card-sleeves.jpg"/>
        </div>
        <div class="yuGiCard back">
           <img src="${doubleUrlArray[i]}"/>
        </div> 
    </div>
   
    `
            }


//    return imageArray;
        };

        fetchAndGenerateImages()

        /*spielfeld.addEventListener("click",(e)=>{
            console.log(e.target.parentElement.nextElementSibling.firstElementChild.src)
            urlVergleichsArray.push(e.target.parentElement.nextElementSibling.firstElementChild.src)
            e.target.classList.add("clicked")

            countClicks++
            if (countClicks%2===0 && urlVergleichsArray.length>=2){
                if(urlVergleichsArray[countClicks-1]!==urlVergleichsArray[countClicks-2]){
                    document.getElementById(countClicks-1).classList.remove("clicked")
                    document.getElementById(countClicks - 2).classList.remove("clicked");
                }
            }



        })

         */


        spielfeld.addEventListener("click", (e) => {
            if (e.target.classList.contains("clicked")) {
                return; // Verhindert erneutes Klicken auf dasselbe Bild
            }

            const imageUrl = e.target.parentElement.nextElementSibling.firstElementChild.src;

            // Füge das geklickte Bild zum Array hinzu
            clickedImages.push({ element: e.target, url: imageUrl });
            e.target.classList.add("clicked");

            if (clickedImages.length === 2) {
                // Wenn zwei Bilder geklickt wurden
                allImgClicked = true;

                document.querySelectorAll(".card-sleeves").forEach((img, index) => {
                    if (!img.classList.contains("clicked")) {
                        allImgClicked = false;
                    }
                });

                if (allImgClicked) {
                    heartCountText.innerText = `You Won`;
                    spielfeld.innerHTML=""
                    spielfeld.style.display="none"

                    winLoseImgContainer.classList.add("winLoseImgContainerStyle")
                    winLoseImgContainer.innerHTML=`<img class="win-lose-img" src="StardustDragon.png">`
                    body.style.backgroundColor="black"
                    heartCountText.style.color="white"
                    lifepoints=8000
                }

                if (clickedImages[0].url !== clickedImages[1].url) {
                    // Wenn die URLs nicht übereinstimmen, entferne die Klasse "clicked"
                    setTimeout(() => {
                        clickedImages.forEach((image) => {
                            image.element.classList.remove("clicked");
                        });
                        lifepoints = lifepoints - 1000;
                        heartCountText.innerText = `You have ${lifepoints} Lifepoints`;
                        if (lifepoints === 0) {
                            heartCountText.innerText = `You Lost`;
                            spielfeld.innerHTML=""
                            spielfeld.style.display="none"

                            winLoseImgContainer.classList.add("winLoseImgContainerStyle")
                            winLoseImgContainer.innerHTML=`<img class="win-lose-img" src="RedDragonArchfiend-GFP2-EN-GR-1E.png">`
                            body.style.backgroundColor="black"
                            heartCountText.style.color="white"
                            lifepoints=8000;
                        }
                        clickedImages.length = 0; // Leere das Array
                    }, 1000); // Timeout, um die Bilder kurz anzuzeigen
                } else {
                    clickedImages.length = 0; // Leere das Array
                }
            }
        });





}


starGame()