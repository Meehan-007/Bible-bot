

const bibleVerse = async () => {
fetch('https://bible-api.com/data/web/random')
            .then(response => response.json()) 
            .then(data => {
                console.log( data);
            }) .catch(error => console.error(error));
        }





module.exports = bibleVerse;