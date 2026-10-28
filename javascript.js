let WRITER_ELEM = document.getElementById("writer")
let MD_PREVIEW_ELEM = document.getElementById("md-preview")
let START_TIME = undefined
let HISTORY = []
let HISTORY_CURSOR = 0

setInterval(() => {
  let time = getTimeSince(START_TIME)

  let time_elem = document.getElementById("stat-time")
  time_elem.innerText=""

  if (time.hours > 0) time_elem.innerText += `${Math.floor(time.hours)} hour${time.hours >= 2 ? "s" : ""}, `
  if (time.minutes > 0) time_elem.innerText += `${Math.floor(time.minutes)} minute${time.minutes >= 2 ? "s" : ""}, `
  time_elem.innerText += `${Math.floor(time.seconds)} second${time.seconds >= 2 ? "s" : ""}`


  document.getElementById("stat-chars").innerText = `${WRITER_ELEM.value.length} characters`
  document.getElementById("stat-words").innerText=`${WRITER_ELEM.value.split(" ").filter(s=>s!=="").length} words`
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
  switch (e.key) {
    case "Control": {key_states.control = true; break}
    case "Alt": {key_states.alt = true; break}
    case "Shift": { key_states.shift = true; break }
    case "Space": {
      //memorize words
      break
    }
    case "z": {
      if (key_states.control) {
        //undo
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


WRITER_ELEM.addEventListener("input", () => {
  if (!START_TIME) START_TIME = Date.now()
  if (WRITER_ELEM.value === "") START_TIME = undefined
  MD_PREVIEW_ELEM.innerHTML = discordMarkdownToHtml(WRITER_ELEM.value)
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
    html = html.replace(/\|\|(.+?)\|\|/g, '<span class="discord-spoiler"><span>$1</span></span>');

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
