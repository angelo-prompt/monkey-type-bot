
const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://monkeytype.com/');

    //Function to grab the current '.word.active' tag:
    async function getActiveWord(){

        //Interact with the DOM to return a value:
        const characters = await page.evaluate(() => {

            //Take the tag of the current active word:
            const activeWordTag = document.querySelector('.word.active');

            /* Check if the grabbed tag isn't null,
            in that case it means that the timer is over: */
            if(activeWordTag != null){

                //Take its text and add a space:
                const activeWord = activeWordTag.innerText + ' ';

                //Split the string into an array of characters:
                const characters = activeWord.split('');

                return characters;

            }else{

                return '';
            }
        })

        return characters;
    }


    //Select the characters of the first active word:
    const characters = await getActiveWord();

    //Print them:
    console.log(characters);

    /* Check if the current character is not undefined
    to ensure that no key is pressed afterward
    the timer expires: */
    for(let i = 0; characters[i] !== undefined; ++i){

        //Type the current character in the array:
        await page.keyboard.press(characters[i], { delay: 0 });

        /* If the current character is a space
        (which means it has finished typing the
        current active word), grab the next word and
        add its characters to the main character array: */
        if(characters[i] === ' '){

            const newCharacters = await getActiveWord();
            characters.push(...newCharacters);

            console.log(newCharacters);
        }
    }

    //This pic goes hard 🤨📷
    await page.screenshot({ path: './result.png' });

    await browser.close();

})();




