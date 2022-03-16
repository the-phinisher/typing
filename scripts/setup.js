input = document.getElementById('input')
header = document.getElementById('header')
result = document.getElementById('result')
output = document.getElementById('output')
redo = document.getElementById('redo')

function set_wordcount(count) {
    wordcount = count
    set_cookie("wordcount", count)
    refresh()
}

function custom_wordcount() {
    string = input.value
    if (input.value == '') input.value = 'Specify the word-count here'
    count = Number(string)
    if (Number.isInteger(count) && count > 0) {
        wordcount = count
        set_cookie("wordcount", count)
        refresh()
    }
}

timestamp = null

function start_clock() {
    timestamp = new Date()
}

function stop_clock() {
    final_time = new Date()
    elapsed_time = final_time - timestamp
    timestamp = null
    return elapsed_time
}

function display_result() {
    wpm = Math.round(wordcount * 60000 / stop_clock())
    acc = Math.round(count_wrong() * 100 / wordcount)

    final_text = 'wpm : ' + wpm + ' acc : ' + acc
    result.innerText = final_text
}

function count_wrong() {
    evaluation = generated.word_correct
    count = 0
    for (let check of evaluation) {
        if (check) count++
    }
    return count
}

function finished() {
    display_result()
    redo.focus()
}

function refresh() {
    generated = new Generation(wordcount)
    generated.display()
    input.focus()
    input.value = ''
}

function feedback() {
    correct = feedbackeval()
    if (correct) input.classList.remove("feedbackwrong")
    else input.classList.add("feedbackwrong")
}

function feedbackeval() {
    trace_word = input.value
    target_word = generated.current_word()
    for (let i = trace_word.length - 1; i >= 0; i--) {
        if (trace_word[i] != target_word[i]) return false
    }
    return true
}


class Generation {
    constructor(wordcount) {
        this.wordcount = wordcount
        this.word_list = generate_words(wordcount)
        this.word_correct = new Array(wordcount).fill(false)
        this.trace = 0
    }

    display() {
        let display_text = ''
        
        for (let i = 0; i < this.wordcount; i++) {
            if(i < this.trace) {
                if(this.word_correct[i]) {
                    display_text += '<span class="correct">'+this.word_list[i]+' </span>'
                } else {
                    display_text += '<span class="wrong">'+this.word_list[i]+' </span>'
                }
            }
            else if (i == this.trace) {
                display_text += '<span class="current">'+this.word_list[i]+' </span>'
            }
            else {
                display_text += this.word_list[i] + ' '
            }
        }
        
        output.innerHTML = display_text
    }

    current_word() {
        return this.word_list[this.trace]
    }

    set_correct(is_correct) {
        this.word_correct[this.trace] = is_correct
    }

    advance() {
        this.trace += 1
        this.display()
    }
}

function generate_words(wordcount) {
    word_list = []
    previous = ''
    while (word_list.length != wordcount) {
        random_word = words[Math.floor(Math.random() * words.length)]
        if (random_word === previous) continue
        word_list.push(random_word)
        previous = random_word
    }
    return word_list
}



function cookie_parse(cname, default_value) {
    value = get_cookie(cname)
    if (value === "") {
        set_cookie(cname, String(default_value))
    } else return value
}

function get_cookie(cname) {
    let name = cname + "="
    decodedCookie = decodeURIComponent(document.cookie)
    ca = decodedCookie.split(';')
    for(let i = 0; i< ca.length;i++) {
        c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

function set_cookie(cname, cvalue) {
    const d = new Date()
    d.setTime(d.getTime() + (30*24*60*60*1000))
    let expires = "expires="+d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}