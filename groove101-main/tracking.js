(() => {
  const send = (name, props = {}) => {
    if (typeof window.plausible === "function") {
      window.plausible(name, { props: { page: window.location.pathname, ...props } });
    }
  };

  document.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (href.startsWith("tel:")) send("Contact Click", { method: "phone" });
    else if (href.includes("wa.me/")) send("Contact Click", { method: "whatsapp" });
    else if (href.includes("#enquire")) send("Check Date Click", { label: link.textContent.trim().slice(0, 80) });
    else if (href.includes("facebook.com/")) send("Social Click", { platform: "facebook" });
    else if (href.includes("instagram.com/")) send("Social Click", { platform: "instagram" });
    else if (href.includes("youtube.com/")) send("Social Click", { platform: "youtube" });
  });

  document.querySelectorAll("[data-video-id]").forEach(videoFacade => {
    const videoId = videoFacade.dataset.videoId.trim();
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;
    const title = videoFacade.dataset.videoTitle || "Groove 101 live showreel";
    videoFacade.disabled = false;
    videoFacade.setAttribute("aria-label", `Play ${title}`);
    const caption = videoFacade.querySelector(".video-caption");
    const icon = videoFacade.querySelector(".play-button");
    if (caption) caption.textContent = "Play live clip";
    if (icon) icon.textContent = "▶";
    videoFacade.addEventListener("click", () => {
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube.com/embed/${videoId}?feature=oembed&autoplay=1&rel=0`;
      frame.title = title;
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      videoFacade.replaceWith(frame);
      send("Video Play", { video: title });
    }, { once: true });
  });

  const disableVimeoCaptions = frame => {
    if (!window.Vimeo?.Player) return;
    const player = new window.Vimeo.Player(frame);
    player.ready().then(() => player.disableTextTrack()).catch(() => {});
  };
  document.querySelectorAll('iframe[src*="player.vimeo.com/video/"]').forEach(disableVimeoCaptions);

  document.querySelectorAll("[data-lightbox-vimeo-id]").forEach(button => {
    const videoId = button.dataset.lightboxVimeoId;
    if (!/^\d+$/.test(videoId)) return;
    button.addEventListener("click", () => {
      const dialog = document.createElement("dialog");
      dialog.className = button.dataset.videoLayout === "landscape" ? "video-lightbox video-lightbox-landscape" : "video-lightbox";
      const title = button.dataset.videoTitle || "Groove 101 live";
      dialog.setAttribute("aria-label", title);
      const close = document.createElement("button");
      close.className = "video-lightbox-close";
      close.type = "button";
      close.textContent = "Close ×";
      close.setAttribute("aria-label", "Close video");
      const frame = document.createElement("iframe");
      const params = new URLSearchParams({ autoplay: "1", badge: "0" });
      if (button.dataset.vimeoHash) params.set("h", button.dataset.vimeoHash);
      frame.src = `https://player.vimeo.com/video/${videoId}?${params}`;
      frame.title = title;
      frame.allow = "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      dialog.append(close, frame);
      document.body.append(dialog);
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.addEventListener("close", () => {
        frame.src = "about:blank";
        dialog.remove();
        document.body.style.overflow = previousOverflow;
        button.focus();
      }, { once: true });
      close.addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", event => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      });
      document.querySelectorAll('iframe[src*="player.vimeo.com/video/"]').forEach(other => {
        if (other !== frame && window.Vimeo?.Player) {
          new window.Vimeo.Player(other).pause().catch(() => {});
        }
      });
      dialog.showModal();
      disableVimeoCaptions(frame);
      close.focus();
      send("Video Play", { video: title, provider: "vimeo" });
    });
  });

  const reviewTrack = document.querySelector("[data-review-track]");
  if (reviewTrack) {
    const cards = [...reviewTrack.querySelectorAll(".review-card")];
    const previous = document.querySelector("[data-review-prev]");
    const next = document.querySelector("[data-review-next]");
    const status = document.querySelector("[data-review-status]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scrollFrame;

    const cardLeft = card => card.offsetLeft - reviewTrack.offsetLeft;
    const currentIndex = () => cards.reduce((nearest, card, index) => (
      Math.abs(cardLeft(card) - reviewTrack.scrollLeft) < Math.abs(cardLeft(cards[nearest]) - reviewTrack.scrollLeft) ? index : nearest
    ), 0);
    const updateControls = () => {
      const index = currentIndex();
      status.textContent = `${index + 1} / ${cards.length}`;
      previous.disabled = reviewTrack.scrollLeft < 4;
      next.disabled = reviewTrack.scrollLeft >= reviewTrack.scrollWidth - reviewTrack.clientWidth - 4;
    };
    const move = direction => {
      const target = Math.max(0, Math.min(cards.length - 1, currentIndex() + direction));
      reviewTrack.scrollTo({ left: cardLeft(cards[target]), behavior: reduceMotion.matches ? "auto" : "smooth" });
    };

    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    reviewTrack.addEventListener("scroll", () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(updateControls);
    }, { passive: true });
    window.addEventListener("resize", updateControls, { passive: true });
    updateControls();
  }
})();
