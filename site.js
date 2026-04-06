const transcriptContainer = document.getElementById("transcript-content");
const toggleTranscriptButton = document.getElementById("toggle-transcript");
const audioElement = document.getElementById("episode-audio");
const runtimeBadge = document.getElementById("runtime-badge");

function formatRuntime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "Runtime unavailable";
  }

  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function renderTranscript(episode) {
  const markup = episode.segments
    .filter((segment) => segment.type === "speech")
    .map((segment) => {
      const label = episode.voices[segment.speaker]?.name ?? segment.speaker;
      return `
        <article class="transcript-entry">
          <span class="speaker-tag speaker-tag--${segment.speaker}">${label}</span>
          <div class="transcript-line">${segment.text}</div>
        </article>
      `;
    })
    .join("");

  transcriptContainer.innerHTML = markup;
}

async function loadEpisode() {
  try {
    const response = await fetch("episode/science-basically.json");
    if (!response.ok) {
      throw new Error(`Failed to load episode metadata: ${response.status}`);
    }

    const episode = await response.json();
    renderTranscript(episode);
  } catch (error) {
    transcriptContainer.innerHTML = `<p class="transcript-loading">Transcript unavailable. ${error.message}</p>`;
  }
}

toggleTranscriptButton?.addEventListener("click", () => {
  transcriptContainer.classList.toggle("is-collapsed");
  toggleTranscriptButton.textContent = transcriptContainer.classList.contains("is-collapsed")
    ? "Show Transcript"
    : "Collapse Transcript";
});

audioElement?.addEventListener("loadedmetadata", () => {
  runtimeBadge.textContent = formatRuntime(audioElement.duration);
});

loadEpisode();
