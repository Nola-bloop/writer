let WRITER_ELEM = document.getElementById("writer")
let MD_PREVIEW_ELEM = document.getElementById("md-preview")
let START_TIME = undefined

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

WRITER_ELEM.addEventListener("input", () => {
  if (!START_TIME) START_TIME = Date.now()
  MD_PREVIEW_ELEM.innerHTML = discordMarkdownToHtml(WRITER_ELEM.value)
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
