wordcount = Number(cookie_parse("wordcount", 25))
input.focus()

generated = new Generation(wordcount)
generated.display()

isPressedKey = {' ':false}

document.onkeydown = (keyDownEvent) => {
    isPressedKey[keyDownEvent.key] = true
    
    if (!timestamp) start_clock()

    if (isPressedKey[' ']) {
        keyDownEvent.preventDefault()
        word = input.value
        if (word != '') {
            input.value = ''
            generated.set_correct(word == generated.current_word())
            generated.advance()
            if(generated.trace == generated.wordcount) finished()
        }
    }
}

document.onkeyup = (keyUpEvent) => {
    isPressedKey[keyUpEvent.key] = false
}