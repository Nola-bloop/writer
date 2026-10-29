let WRITER_ELEM = document.getElementById("writer")
let MD_PREVIEW_ELEM = document.getElementById("md-preview")
let START_TIME = undefined
let PAGE = document.getElementById("fg-window")

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

let key_states = {
  "control": false,
  "shift": false,
  "alt":false
}


document.onkeydown = function (e) {
  let startPosition = WRITER_ELEM.selectionStart;
  let endPosition = WRITER_ELEM.selectionEnd;
  let text = WRITER_ELEM.value
  console.log(e.key)
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

MD_PREVIEW_ELEM.innerHTML = discordMarkdownToHtml(WRITER_ELEM.value)

function discordMarkdownToHtml(text) {
    if (!text) return '';

    // Escape HTML entities to prevent XSS attacks
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 1. Multiline Blockquote: >>> text (must be processed before single-line)
    html = html.replace(/^&gt;&gt;&gt; ([\s\S]*)$/gm, '<span class="discord-block-quote discord-multi-quote">$1</span>');

    // 2. Single-line Blockquote: > text (at the start of a line)
    html = html.replace(/^&gt; (.*$)/gm, '<span class="discord-block-quote">$1</span>');

    // 3. Headings: #, ##, ### (at the start of a line)
    html = html.replace(/^### (.*$)/gm, '<span class="discord-heading discord-h3">$1</span>');
    html = html.replace(/^## (.*$)/gm, '<span class="discord-heading discord-h2">$1</span>');
    html = html.replace(/^# (.*$)/gm, '<span class="discord-heading discord-h1">$1</span>');

    // 4. Subtext / Small text: -# text (at the start of a line)
    html = html.replace(/^-\# (.*$)/gm, '<span class="discord-subtext">$1</span>');

    // 5. Code blocks (multiline): ```lang\ncode``` or ```code```
    html = html.replace(/```(?:([a-zA-Z0-9_-]+)\n)?([\s\S]*?)```/g, (match, lang, code) => {
        const langClass = lang ? ` class="discord-code-block lang-${lang}"` : ' class="discord-code-block"';
        return `<pre><code${langClass}>${code.trim()}</code></pre>`;
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

  helper.classList.add("hidden")
  if (pageName === "md-helper") {
    helper.classList.remove("hidden")
  }
}

function HidePage() {
  PAGE.classList.add("hidden")
  document.getElementById("dark-bg").classList.add("hidden")
}
