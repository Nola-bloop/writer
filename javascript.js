let WRITER_ELEM = document.getElementById("writer")
let MD_PREVIEW_ELEM = document.getElementById("md-preview")
let START_TIME = undefined
let PAGE = document.getElementById("fg-window")
let TUPPERS = []

setInterval(() => {
  let time = getTimeSince(START_TIME)

  let time_elem = document.getElementById("stat-time")
  time_elem.innerText=""

  if (time.hours > 0) time_elem.innerText += `${Math.floor(time.hours)} hour${time.hours >= 2 ? "s" : ""}, `
  if (time.minutes > 0) time_elem.innerText += `${Math.floor(time.minutes)} minute${time.minutes >= 2 ? "s" : ""}, `
  time_elem.innerText += `${Math.floor(time.seconds)} second${time.seconds >= 2 ? "s" : ""}`


  document.getElementById("stat-chars").innerText = `${WRITER_ELEM.value.length} characters`
  document.getElementById("stat-words").innerText = `${WRITER_ELEM.value.split(" ").filter(s => s !== "").length} words`
}, 50)

setInterval(() => {
  localStorage.setItem("cached_text", WRITER_ELEM.value)
  console.log("Autosave completed! (saved in local storage)")
}, 1000 * 10)


let key_states = {
  "control": false,
  "shift": false,
  "alt":false
}


document.onkeydown = function (e) {
  let startPosition = WRITER_ELEM.selectionStart;
  let endPosition = WRITER_ELEM.selectionEnd;
  let text = WRITER_ELEM.value
  switch (e.key) {
    case "Control": {key_states.control = true; break}
    case "Alt": {key_states.alt = true; break}
    case "Shift": { key_states.shift = true; break }
    case "1": {
      if (key_states.control && key_states.alt) {
        e.preventDefault()
        let brI = getClosestPriorLineBreak(startPosition)

        if (text.slice(brI, brI + 3) === "\n# ") {
          text = text.slice(0, brI+1) +
            text.slice(brI+3)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition-2
          WRITER_ELEM.selectionEnd = endPosition - 2
          refreshMarkdown()
        } else {
          text = text.slice(0, brI+1) +
            "# "+
            text.slice(brI+1)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition+2
          WRITER_ELEM.selectionEnd = endPosition + 2
          refreshMarkdown()
        }

      }
      break
    }
    case "2": {
      if (key_states.control && key_states.alt) {
        e.preventDefault()
        let brI = getClosestPriorLineBreak(startPosition)

        if (text.slice(brI, brI + 4) === "\n## ") {
          text = text.slice(0, brI+1) +
            text.slice(brI+4)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition-3
          WRITER_ELEM.selectionEnd = endPosition - 3
          refreshMarkdown()
        } else {
          text = text.slice(0, brI+1) +
            "## "+
            text.slice(brI+1)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition+3
          WRITER_ELEM.selectionEnd = endPosition + 3
          refreshMarkdown()
        }

      }
      break
    }
    case "3": {
      if (key_states.control && key_states.alt) {
        e.preventDefault()
        let brI = getClosestPriorLineBreak(startPosition)

        if (text.slice(brI, brI + 5) === "\n### ") {
          text = text.slice(0, brI+1) +
            text.slice(brI+5)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition-4
          WRITER_ELEM.selectionEnd = endPosition - 4
          refreshMarkdown()
        } else {
          text = text.slice(0, brI+1) +
            "### "+
            text.slice(brI+1)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition+4
          WRITER_ELEM.selectionEnd = endPosition + 4
          refreshMarkdown()
        }

      }
      break
    }
    case "d": {
      if (key_states.control) {
        e.preventDefault()
        let brI = getClosestPriorLineBreak(startPosition)

        if (text.slice(brI, brI + 4) === "\n-# ") {
          text = text.slice(0, brI+1) +
            text.slice(brI+4)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition-3
          WRITER_ELEM.selectionEnd = endPosition - 3
          refreshMarkdown()
        } else {
          text = text.slice(0, brI+1) +
            "-# "+
            text.slice(brI+1)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition+3
          WRITER_ELEM.selectionEnd = endPosition + 3
          refreshMarkdown()
        }

      }
      break
    }
    case "e": {
      if (key_states.control) {
        e.preventDefault()
        let brI = getClosestPriorLineBreak(startPosition)

        if (text.slice(brI, brI + 3) === "\n> ") {
          text = text.slice(0, brI+1) +
            text.slice(brI+3)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition-2
          WRITER_ELEM.selectionEnd = endPosition - 2
          refreshMarkdown()
        } else {
          text = text.slice(0, brI+1) +
            "> "+
            text.slice(brI+1)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition+2
          WRITER_ELEM.selectionEnd = endPosition + 2
          refreshMarkdown()
        }

      }
      break
    }
    case "E": {
      if (key_states.control && key_states.shift) {
        e.preventDefault()
        let brI = getClosestPriorLineBreak(startPosition)

        if (text.slice(brI, brI + 5) === "\n>>> ") {
          text = text.slice(0, brI+1) +
            text.slice(brI+5)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition-4
          WRITER_ELEM.selectionEnd = endPosition - 4
          refreshMarkdown()
        } else {
          text = text.slice(0, brI+1) +
            ">>> "+
            text.slice(brI+1)
          WRITER_ELEM.value = text
          WRITER_ELEM.selectionStart = endPosition+4
          WRITER_ELEM.selectionEnd = endPosition + 4
          refreshMarkdown()
        }

      }
      break
    }
    case "b": {
      if (key_states.control) {
        e.preventDefault()
        text = text.slice(0, startPosition) +
          "**"+
          text.slice(startPosition, endPosition) +
          "**"+
          text.slice(endPosition)
        WRITER_ELEM.value = text
        WRITER_ELEM.selectionStart = endPosition + 2
        WRITER_ELEM.selectionEnd = endPosition + 2
        refreshMarkdown()
      } break
    }
    case "i": {
      if (key_states.control) {
        e.preventDefault()
        text = text.slice(0, startPosition) +
          "*"+
          text.slice(startPosition, endPosition) +
          "*"+
          text.slice(endPosition)
        WRITER_ELEM.value = text
        WRITER_ELEM.selectionStart = endPosition + 1
        WRITER_ELEM.selectionEnd = endPosition + 1
        refreshMarkdown()
      } break
    }
    case "s": {
      if (key_states.control) {
        e.preventDefault()
        text = text.slice(0, startPosition) +
          "~~"+
          text.slice(startPosition, endPosition) +
          "~~"+
          text.slice(endPosition)
        WRITER_ELEM.value = text
        WRITER_ELEM.selectionStart = endPosition + 2
        WRITER_ELEM.selectionEnd = endPosition + 2
        refreshMarkdown()
      } break
    }
    case "u": {
      if (key_states.control) {
        e.preventDefault()
        text = text.slice(0, startPosition) +
          "__"+
          text.slice(startPosition, endPosition) +
          "__"+
          text.slice(endPosition)
        WRITER_ELEM.value = text
        WRITER_ELEM.selectionStart = endPosition + 2
        WRITER_ELEM.selectionEnd = endPosition + 2
        refreshMarkdown()
      } break
    }
    case "l": {
      if (key_states.control) {
        e.preventDefault()
        text = text.slice(0, startPosition) +
          "||"+
          text.slice(startPosition, endPosition) +
          "||"+
          text.slice(endPosition)
        WRITER_ELEM.value = text
        WRITER_ELEM.selectionStart = endPosition + 2
        WRITER_ELEM.selectionEnd = endPosition + 2
        refreshMarkdown()
      } break
    }
    case "r": {
      if (key_states.control) {
        e.preventDefault()
        text = text.slice(0, startPosition) +
          "`"+
          text.slice(startPosition, endPosition) +
          "`"+
          text.slice(endPosition)
        WRITER_ELEM.value = text
        WRITER_ELEM.selectionStart = endPosition + 1
        WRITER_ELEM.selectionEnd = endPosition + 1
        refreshMarkdown()
      } break
    }
    case "R": {
      if (key_states.control && key_states.shift) {
        e.preventDefault()
        text = text.slice(0, startPosition) +
          "```"+
          text.slice(startPosition, endPosition) +
          "```"+
          text.slice(endPosition)
        WRITER_ELEM.value = text
        WRITER_ELEM.selectionStart = endPosition + 3
        WRITER_ELEM.selectionEnd = endPosition + 3
        refreshMarkdown()
      } break
    }
    default: break
  }
};
document.onkeyup = function (e) {
  switch (e.key) {
    case "Control": {key_states.control = false; break}
    case "Alt": {key_states.alt = false; break}
    case "Shift": { key_states.shift = false; break }
    default: break
  }
};

function refreshMarkdown() {
  MD_PREVIEW_ELEM.innerHTML = discordMarkdownToHtml(WRITER_ELEM.value)
}

WRITER_ELEM.addEventListener("input", () => {
  if (!START_TIME) START_TIME = Date.now()
  if (WRITER_ELEM.value === "") START_TIME = undefined
  refreshMarkdown()
})

WRITER_ELEM.addEventListener("scroll", () => {
  let scrollPercent = WRITER_ELEM.scrollTop / WRITER_ELEM.scrollHeight
  MD_PREVIEW_ELEM.scrollTop = MD_PREVIEW_ELEM.scrollHeight * scrollPercent
})

MD_PREVIEW_ELEM.addEventListener("scroll", () => {
  let scrollPercent = MD_PREVIEW_ELEM.scrollTop / MD_PREVIEW_ELEM.scrollHeight
  WRITER_ELEM.scrollTop = WRITER_ELEM.scrollHeight * scrollPercent
})

document.getElementById("stat-time").addEventListener("click", () => {
  if (document.getElementById("stat-time").classList.contains("hidden-text")) {
    document.getElementById("stat-time").classList.remove("hidden-text")
  }
  else {
    document.getElementById("stat-time").classList.add("hidden-text")
  }
})

let tupper_text_indexes = []
MD_PREVIEW_ELEM.innerHTML = discordMarkdownToHtml(WRITER_ELEM.value)


function discordMarkdownToHtml(text) {
  tupper_text_indexes = []
  if (!text) return '';
  let html = text.trim()

  //GROUP TUPPERS
  let separatedHTML = ""
  let flag = false
  let start = 0
  let count = 0
  for (let i = 0; i < html.length; i++){
    TUPPERS.forEach((t, ti) => {
      if (html.slice(i, i + t.prefix.length) === t.prefix)
      {
        if (flag) {
          separatedHTML += "</div>"
          tupper_text_indexes.push({
            start:start,
            end: i
          })
          start = i
        }
        separatedHTML += `<p class="tupper-name">${t.name}</p><div class="tupper-text" id="tupper-text-${ti}" onclick="CopyTupperText(${count++})">\n`
        flag = true
        i+=t.prefix.length
      }
    })
    separatedHTML += html[i]
  }
  if (flag) {
    separatedHTML += "</div>"
    tupper_text_indexes.push({
      start:start,
      end: html.length
    })
  }
  html = separatedHTML.trim()

  html = html.replace(/\r?\n[ ]*/g, "\n")

  // 1. Multiline Blockquote: >>> text (must be processed before single-line)
  html = html.replace(/\r?\n&gt;&gt;&gt; ([\s\S]*)$/g, '<div class="discord-block-quote discord-multi-quote">$1</div>');

  // 2. Single-line Blockquote: > text (at the start of a line)
  html = html.replace(/\r?\n&gt; ([^\r\n]*)/g, '<br><span class="discord-block-quote">$1</span>');

  // 3. Headings: #, ##, ### (at the start of a line)
  html = html.replace(/(?:^|\r?\n)### ([^\r\n]*)/g, '<span class="discord-heading discord-h3">$1</span>');
  html = html.replace(/(?:^|\r?\n)## ([^\r\n]*)/g, '<span class="discord-heading discord-h2">$1</span>');
  html = html.replace(/(?:^|\r?\n)# ([^\r\n]*)/g, '<span class="discord-heading discord-h1">$1</span>');

  // 4. Subtext / Small text: -# text (at the start of a line)
  html = html.replace(/(?:^|\r?\n)-# ([^\r\n]*)/g, '<br><span class="discord-subtext">$1</span>');

  // 5. Code blocks (multiline): ```lang\ncode``` or ```code```
  html = html.replace(/```(?:([a-zA-Z0-9_-]+)\n)?([\s\S]*?)```/g, (match, lang, code) => {
      const langClass = lang ? ` class="discord-code-block lang-${lang}"` : ' class="discord-code-block"';
      return `<div${langClass}>${code.trim()}</div>`;
  });

  // 6. Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<span class="discord-inline-code">$1</span>');

  // 7. URLs: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="discord-link">$1</a>');

  // 8. Spoilers: ||text||
  html = html.replace(/\|\|(.+?)\|\|/g, '<span class="discord-spoiler">$1</span>');

  // 9. Bold + Italic: ***text*** or ___text___
  html = html.replace(/(\*\*\*|___)(?=\S)(.+?)(?<=\S)\1/g, '<span class="discord-bold discord-italic">$2</span>');

  // 10. Bold: **text**
  html = html.replace(/\*\*(?=\S)(.+?)(?<=\S)\*\*/g, '<span class="discord-bold">$1</span>');

  // 11. Underline: __text__
  html = html.replace(/__(?=\S)(.+?)(?<=\S)__/g, '<span class="discord-underline">$1</span>');

  // 12. Italic: *text* or _text_
  html = html.replace(/(?<!\w)(\*|_)(?=\S)(.+?)(?<=\S)\1(?!\w)/g, '<span class="discord-italic">$2</span>');

  // 13. Strikethrough: ~~text~~
  html = html.replace(/~~(?=\S)(.+?)(?<=\S)~~/g, '<span class="discord-strikethrough">$1</span>');

  //remove unnecessary characters
  // html = html.trim()
  // html = html.replace(/<div (?:[^<>])*>\r?\n/g, '<div $1>');

  // Convert newlines to <br> tags for proper display
  html = html.replace(/\r?\n/g, '<br>');

  return html;
}

function getClosestPriorLineBreak(index) {
  for (let i = index; i >= 0; i--){
    if (WRITER_ELEM.value.at(i) === "\n") {
      return i
    }
  }
  return 0
}

function getTimeSince(pastTimestamp) {

    // Get current time and find the difference in milliseconds
    const now = Date.now();
    const diffMs = Math.max(0, now - (pastTimestamp ?? Date.now())); // Prevent negative numbers

    // Convert milliseconds to total seconds
    const totalSeconds = Math.floor(diffMs / 1000);

    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
}

function ShowPage(pageName) {
  PAGE.classList.remove("hidden")
  document.getElementById("dark-bg").classList.remove("hidden")
  let helper = document.getElementById("md-helper")
  let tuppers = document.getElementById("tupper-list")

  helper.classList.add("hidden")
  if (pageName === "md-helper") {
    helper.classList.remove("hidden")
  }

  tuppers.classList.add("hidden")
  if (pageName === "tupper-list") {
    tuppers.classList.remove("hidden")
  }
}

function HidePage() {
  PAGE.classList.add("hidden")
  document.getElementById("dark-bg").classList.add("hidden")
}

function AddTupper() {
  TUPPERS.push({
    prefix: "",
    name: ""
  })
  PopulateTuppers()
}

function PopulateTuppers() {
  let container = document.getElementById("tupper-list-container")
  container.innerHTML = ""
  TUPPERS.forEach((t, i) => {
    container.innerHTML+= `
      <div class="tupper">
        <input oninput="SetTupperPrefix(${i})" id="i-tupper-prefix-${i}" class="i-tupper-prefix" type=text value="${t.prefix}"></input>
        <input oninput="SetTupperName(${i})" id="i-tupper-name-${i}" class="i-tupper-name" type=text value="${t.name}"></input>
        <p onclick="RemoveTupper(${i})" class="i-tupper-delete nf nf-fa-minus button"></p>
      </div>
    `
  })
  SaveTuppers()
}
function RemoveTupper(i) {
  TUPPERS.splice(i, 1)
  PopulateTuppers()
}

function SetTupperPrefix(i) {
  TUPPERS[i].prefix = document.getElementById("i-tupper-prefix-" + i).value
  SaveTuppers()
}
function SetTupperName(i) {
  TUPPERS[i].name = document.getElementById("i-tupper-name-" + i).value
  SaveTuppers()
}

function SaveTuppers() {
  let savedString = ""
  let separator1 = "_`_"
  let separator2 = "+`+"
  TUPPERS.forEach((t, i) => {
    savedString += `${t.prefix}${separator1}${t.name}`

    if (i !== TUPPERS.length-1) savedString += separator2
  })
  localStorage.setItem("tupper_config", savedString)
}

function CopyTupperText(i) {
  // let text = document.getElementById("tupper-text-" + i).innerHTML
  // text = text.replaceAll("<br>", "\n")
  // text = text.replaceAll(/<[^<>]*>/gi, "")
  let text = WRITER_ELEM.value.slice(tupper_text_indexes[i].start,tupper_text_indexes[i].end)
  navigator.clipboard.writeText(text);
  console.log(text)
}

//load saved text
WRITER_ELEM.value = localStorage.getItem("cached_text") ?? ""

//load tuppers
let tupper_config = localStorage.getItem("tupper_config")
if (tupper_config) {
  let tupper_config_tuppers = tupper_config.split("+`+")
  tupper_config_tuppers.forEach(t => {
    let attributes = t.split("_`_")
    TUPPERS.push({
      prefix: attributes[0],
      name: attributes[1]
    })
  })
  PopulateTuppers()
}
refreshMarkdown()
