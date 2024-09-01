const titlegen = {
	emojis: {
		data: "🥇,🏧,🎄,🏯,🎎,👌,🎅,🗽,🦖,🗼,🩹,🎟️,🚡,✈️,⏰,⚗️,👽,👾,🚑,🏺,⚓,🐜,🚗,🥑,🐤,🎒,🥓,🏸,🥯,🥖,⚖️,🎈,🍌,🍒,🌸,🌰,🐔,🐿️,🍫,🎪,🌆,🥂,📬,🌧️,🤡,🍹,🥥,☄️,🧭,🎊,😖,🍚,🍪,🍳,🐄,🦀,🖍️,💳,🏏,🐊,🥐,⚔️,🔮,🥒,🥤,🍛,🍮,🍖,🍡,🍱,🍹,🚲,🌸,🐡,💣,🦴,🔖,📚,🍾,💐,🍜,🎳,🧠,🍞,🥦,🧹,🐞,🚄,🎯,🌯,🚌,🧈,🦋,🌵,🐫,📷,🏕️,🕯️,🍬,🥫,🛶,🗃️,📑,🎠,🎏,🥕,😺,🪑,📈,🧀,🍒,🌸,🌰,🐔,🐿️,🍋,💡,🦎,🦙,🦂,🍇,🍏,🥗,🎸,🍔,🐹,🙉,🦔,🚁,🌿,🌺,🦛,🍯,🐝,☕,🌭,🌋,❄️,🍦,🎃,👖,🕹️,🦘,🛴,👘,🔪,🪁,🥝,🏷️,🐞,💻,🍃,🥬,🍋,💡,🦎,🦙,🦐,🦚,🐄,😱,🥙,🍂,⛴️,🎞️,🔥,🚒,🧯,🐟,⛳,🦩,🔦,💾,🃏,😳,🛸,🥠,🍀,🍟,🍤,🐸,⛽,🎲,🧄,💎,🦒,🥛,👓,🧤,🌟,🐐,🦍,🍇,🍏,🍏,🌧️,🍣,💦,🌮,👕,🥡,🎋,🍊,🍵,☎️,📺,⛺,🧪,🧵,🎫,🐅,🚽,🍅,🧰,🚜,🍹,🐠,🌍,🗞️,🧶,🥱,🤪,🪀"
	},
	words: {
		data: "a,chill,co-working,come watch,comfi,cozy,crai,cuties,don't forget to,drink wawa,eoh,epic,feet,get ready for,hababa,hapi,hehe,heart,in the,is,it's true,kekw,lob,maybe,me,nini,nya,often,orang,pee,post-nap,reveal,sky,sleepy,snacks,socks,soft,strim,time,veri,warm flames,with,wowow,yay,your"
	}
}
const emojiArray = titlegen.emojis.data.split(",");
const wordArray = titlegen.words.data.split(",");

function randomWord() {
    let min = 0;
    let max = wordArray.length-1;
    let i = Math.floor(Math.random() * (max - min + 1)) + min;
    return wordArray[i];
  }
  
  function randomEmoji() {
    let min = 0;
    let max = emojiArray.length-1;
    let i = Math.floor(Math.random() * (max - min + 1)) + min;
    return emojiArray[i];
  }
  
  function printWords() {
    let wordout = "";
    let max = 2;
    for(let w = 0; w < max; w++) {
      wordout += randomWord() + " ";
    }
    wordout += randomWord();
    return wordout;
  }
  
  function printEmojis() {
    let emojiout = "";
    let max = 3;
    for(let w = 0; w < max; w++) {
      emojiout += randomEmoji();
    }
    return emojiout;
  }

  module.exports = {
    printWords,
    printEmojis
  }