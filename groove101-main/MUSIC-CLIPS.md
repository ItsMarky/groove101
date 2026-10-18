# Adding music clips

The three clip spaces are in `index.html`, inside `id="music-samples"`, below the showreel.

For each card:
1. Upload your performance clip to YouTube (public or unlisted, with embedding allowed).
2. Paste its 11-character video ID into `data-video-id=""`. For `https://www.youtube.com/watch?v=ABCDEFGHIJK`, the ID is `ABCDEFGHIJK`.
3. Set `data-video-title` to the song title and artist, followed by “— Groove 101”.
4. Update the card's `<h4>` and description to match the recording.

The script automatically enables the play button and replaces “Clip coming soon” when a valid ID is provided. Leave the `disabled` attribute in place: it prevents an inactive control before the script loads. Empty slots stay visibly marked as coming soon. Videos load only when a visitor presses play.

Optional thumbnail: insert an `<img src="images/your-clip-photo.jpg" alt="" loading="lazy">` inside the button, before the play-button span. Use a real photo from that performance.

Preview each clip before publishing to confirm the recording is available and embedding works.

## Previewing playback locally

YouTube embeds need an HTTP website context. Opening `index.html` directly as a `file://` URL can cause YouTube error 153.

From the project folder, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open `http://localhost:8000/index.html#music-samples`. Keep that terminal running while previewing. Stop it with Ctrl+C when finished.
