const projects = {
  uncivilized: {
    title: "Uncivilized",
    eyebrow: "01 / Real-time short",
    lead: "A dialogue-free sci-fi assassination short in which blue order collapses into a red dream.",
    cover: "assets/uncivilized-cover.jpg",
    meta: [
      ["Format", "Real-time short film"],
      ["Duration", "2 minutes"],
      ["Role", "Solo project"],
      ["Software", "Unreal Engine 5"]
    ],
    intro:
      "On a distant alien planet, an assassin moves through a city ruled by a cold, ordered power. The film opens with an elevator descent, red light flickering across the protagonist, soldiers pursuing from above and blue headlights cutting through smoke. With no dialogue, image and sound carry the story.",
    sections: [
      {
        title: "The concept",
        body: [
          "The plot began with the first Assassin's Creed trailer and the idea of an assassination that crosses into an unreal space. The final sequence takes inspiration from the Red Room in Twin Peaks, using television and dream logic in a future that has otherwise moved beyond them.",
          "The subject is dark, but the feeling underneath is rebellion, hope and passion. I wanted the ending to move from suspense into a state that asks viewers to stop decoding the plot and simply feel it."
        ],
        points: [
          "Dialogue-free storytelling through image, editing and sound.",
          "Cold blue power against the danger and unknown of red.",
          "A deliberate collision of futuristic technology and antiquated media."
        ],
        image: "assets/uncivilized-concept.jpg",
        caption: "Concept and visual direction"
      },
      {
        title: "Movement and performance",
        body: [
          "The escape moves from running to sliding, then leaping from a building. The camera rotates at the final parkour move to heighten the speed and decisiveness. The movement language gives the assassin agility, but standing perfectly still is the action that best defines the character.",
          "The final target is framed at the center of a space filled with steam and red light. The audience initially reads control, right up to the moment the environment reveals that the ruler has crossed into the assassin's illusion."
        ],
        points: [
          "Parkour transitions designed as character beats.",
          "Camera rotation used to amplify the escape.",
          "A brief pause before the fatal bullet, followed by an explosion."
        ],
        image: "assets/editor-uploads/uncivilized-image-02.png",
        caption: "Movement study from the final real-time sequence"
      },
      {
        title: "Visual and technical",
        body: [
          "The blue-to-red transition carries the theme directly. Blue represents the ruler's ordered dominance; red represents danger, desire and the unknown. Smoke allows both palettes to mix into a hazy, immersive look.",
          "Unreal Engine and Level Sequence made rapid cinematic iteration possible. Tripo generated the Artemis statue, while Seedance produced the in-scene footage that pays homage to The Twilight Zone."
        ],
        points: [
          "UE5 Level Sequence for real-time cinematography.",
          "Fast cutting and obscured sightlines used to hide transition seams.",
          "Blue and red lighting systems used as narrative language."
        ],
        image: "assets/uncivilized-gallery-02.png",
        caption: "Lighting and final-frame development"
      }
    ],
    gallery: [
      ["assets/editor-uploads/uncivilized-image-04.png", "Key visual"],
      ["assets/editor-uploads/uncivilized-image-05.png", "Motion sequence"],
      ["assets/editor-uploads/uncivilized-image-06.png", "Final composition"]
    ],
    reflection:
      "If I remade the film, I would add a sequence establishing the ruler's impact on the city and pair it with poetic narration to deepen the emotional weight. Looking back, the project revealed how strongly I rely on visual impact and musical rhythm over text.",
    credits: [
      "Mocap Series: Parkour - Mocap Motion Studio",
      "Sliding animation - Nexaframe Production",
      "Teleportation System - Rimaye.Std",
      "Blood Starter VFX Pack - FX Cat UA",
      "Robot 14 - cglib team",
      "Cyber Punk Runner - Raka Samudera",
      "Fluid Flux - ImaginaryBlend",
      "Paragon: Wraith - Epic Games",
      "Sci-Fi Skyscrapers Buildings - No Mad Studios",
      "Sci-Fi Spaceship Hangar - Leartes Studios"
    ],
    link: "https://www.bilibili.com/video/BV1w6at6aEnu/",
    linkLabel: "Watch Uncivilized",
    next: "playtime"
  },
  playtime: {
    title: "Play Time",
    eyebrow: "02 / Puzzle level",
    lead: "An atmospheric level where objects, ambient sound and spatial memory replace dialogue.",
    cover: "assets/playtime-cover.jpg",
    meta: [
      ["Format", "Playable puzzle level"],
      ["Duration", "8 minutes incl. trailer"],
      ["Role", "Solo project"],
      ["Software", "Unreal Engine 5"]
    ],
    intro:
      "Play Time is built inside the Horror Engine template, a starting point that gave me a set of mechanics to study and reshape. The level asks players to clear obstacles through item interactions while creating an expressive environment inside a confined space.",
    sections: [
      {
        title: "Two mechanics",
        body: [
          "The design centers on two actions: gathering information by listening to ambient sounds throughout the level, and testing the abilities of different objects by clicking on them. Puzzles and music become the engine of progression.",
          "The project was inspired by the film Playtime and its choreography of space. My criterion for each idea was whether it was interesting and distinctive enough to communicate the project's atmosphere."
        ],
        points: [
          "Sound becomes a navigation and puzzle tool.",
          "Object behavior is learned through experimentation.",
          "Readability is prioritized before surface complexity."
        ],
        image: "assets/editor-uploads/playtime-image-01.webp",
        caption: "Environmental tone and spatial composition"
      },
      {
        title: "From whitebox to playable space",
        body: [
          "The process moved through three stages: collecting reference images, mood boards and music; building a whitebox and expanding its structure around puzzle logic; then refining specific puzzles with sound design.",
          "A playtest showed that players found the puzzles too difficult, so I lowered the difficulty and made object interactions more intuitive. The role of personal expression stayed important, but player readability and a smooth route to completion came first."
        ],
        points: [
          "Reference and mood-board phase before construction.",
          "Blueprint-driven platform movement.",
          "Difficulty revised in response to playtesting."
        ],
        image: "assets/editor-uploads/playtime-image-02.webp",
        caption: "Level layout and whitebox study"
      },
      {
        title: "Sound as architecture",
        body: [
          "Zone-based triggers start and stop specific sounds as the player enters and leaves an area. Because the game has no text, sound and environment carry the narrative. Candles, red lights, Twin Peaks footage and mysterious patterns build an unstable, dreamlike atmosphere.",
          "The most technically demanding parts were the level and sound design. A planned chase sequence was cut because it disrupted the exploratory rhythm and clashed with the overall tone."
        ],
        points: [
          "Area-specific sound triggered by player movement.",
          "Radiohead tracks used as structural cues.",
          "A deliberate choice to remove a chase sequence."
        ],
        image: "assets/editor-uploads/playtime-image-03.jpg",
        caption: "Atmosphere, lighting and object interaction"
      }
    ],
    gallery: [
      ["assets/editor-uploads/playtime-image-04.webp", "Level atmosphere"],
      ["assets/editor-uploads/playtime-image-05.webp", "Whitebox and layout"],
      ["assets/editor-uploads/playtime-image-06.webp", "Lighting study"]
    ],
    reflection:
      "The future development of this game points toward Writer's Block: a narrator tells the player what to do, and the player decides whether to obey. It grows from this portfolio level into the possibility of a standalone indie game inspired by The Stanley Parable.",
    credits: [
      "Horror Engine - TansuErgene",
      "Cigar Room Environment - Hane Studios",
      "Twin Peaks - David Lynch",
      "Everything In Its Right Place - Radiohead",
      "Dance Of The Dream Man (Instrumental) - Angelo Badalamenti"
    ],
    link: "https://www.bilibili.com/video/BV1Kp3j6QEnY/",
    linkLabel: "Watch the playthrough",
    next: "showman"
  },
  showman: {
    title: "Death of the Showman",
    eyebrow: "03 / Adventure level",
    lead: "A ruined carnival level that moves from graveyard anxiety to a Ferris wheel assassination.",
    cover: "assets/showman-cover.png",
    meta: [
      ["Format", "Third-person adventure level"],
      ["Duration", "10 minutes"],
      ["Role", "Solo project"],
      ["Software", "Unreal Engine 5"]
    ],
    intro:
      "The level begins in a ruined graveyard, opens into a small circus checkpoint and then reveals a Ferris wheel as its primary visual target. The player can fight, sneak, slide down ropes or find another way around, with every route designed to remain readable.",
    sections: [
      {
        title: "Gameplay loop",
        body: [
          "Players confirm the target at the start, observe enemy locations and decide whether to fight or sneak. Targeting and action reward calm, deliberate aiming, while pathfinding lets players choose between direct combat, elevated rope routes and quieter approaches.",
          "Grenades support fast elimination of a squad, while bandages help the player recover. Vehicles, torches, balloons and question-mark signs act as navigation cues without interrupting the environmental tone."
        ],
        points: [
          "Observe, decide, target and act.",
          "Multiple routes with different levels of risk.",
          "Items used to create tactical and pacing options."
        ],
        image: "assets/showman-gallery-01.png",
        caption: "Combat, targeting and route choice"
      },
      {
        title: "Level sequence",
        body: [
          "The graveyard establishes horror and danger while giving the player room to adjust to the controls. The circus provides a checkpoint and a first main visual target. Lighting the map creates a stronger read on the route ahead.",
          "Ropes turn traversal into a fast, adventurous movement system. The Ferris wheel becomes the most important landmark, then the assassination site. The level ends with a car escape, giving the player a release after the climax."
        ],
        points: [
          "Graveyard as mood and tutorial space.",
          "Circus as checkpoint and visual anchor.",
          "Ferris wheel as destination, climax and payoff."
        ],
        image: "assets/editor-uploads/showman-image-02.png",
        caption: "Ferris wheel landmark and route framing"
      },
      {
        title: "Production process",
        body: [
          "Preliminary research began with a retro PSX direction that I ultimately abandoned in favor of adventure-game language. I replaced the character model, tested parkour features, analyzed level flow and purchased the AGLS plugin for basic feature testing.",
          "Environment blockout established the ruins, Ferris wheel and amusement park areas. I designed three optional routes, then repeatedly iterated on AI difficulty, zipline collision and route guidance. The polish phase added a title sequence, trigger-based music, moving vehicles, torches, balloons and question-mark signs."
        ],
        points: [
          "Research window: 5.15 - 5.21.",
          "Environment blockout: 5.25 - 5.31.",
          "Polish and playable demo: 6.1 - 6.8."
        ],
        image: "assets/showman-gallery-04.png",
        caption: "Production pass and environmental detail"
      }
    ],
    gallery: [
      ["assets/showman-cover.png", "Key visual"],
      ["assets/showman-gallery-02.png", "Player route"],
      ["assets/editor-uploads/showman-image-06.jpg", "Ferris wheel"]
    ],
    reflection:
      "The project is deliberately structured around orientation. Three optional paths let players express their play style, but the environment has to keep the destination legible even when the view is dark or obstructed.",
    credits: [
      "AGLS - Jakub W",
      "The Carnival [Theme Park / Amusement Park] - Meshingun Studio",
      "[SCANS] Ruined Crypt - Scans Factory",
      "Apocalypse - Jesper Kyd"
    ],
    link: "https://www.bilibili.com/video/BV1Ns3j6nE9K/",
    linkLabel: "Watch the playthrough",
    next: "diehard"
  },
  diehard: {
    title: "Die Hard",
    eyebrow: "04 / Dual-level shooter",
    lead: "Two levels move through one brutalist sci-fi tower in opposite directions and meet at the boss.",
    cover: "assets/diehard-cover.png",
    meta: [
      ["Format", "Two-level action game"],
      ["Duration", "10 minutes"],
      ["Role", "Solo project"],
      ["Software", "Unreal Engine 5"]
    ],
    intro:
      "Die Hard combines Brutalist architecture with science-fiction action. The first level descends from the top of the building toward the boss; the second climbs from the exterior into a confined third-person shooter sequence. Both levels use the tower as a changing machine.",
    sections: [
      {
        title: "Inspiration",
        body: [
          "The initial spark came from Kill Bill and a long-standing appreciation for Brutalist architecture. I expanded it with science-fiction elements to enrich and diversify the scene, drawing on Sifu's museum level, Dishonored 2's Clockwork Mansion, Mass Effect's Citadel and Cloud City.",
          "I selected the final concept using three criteria: whether it fit the narrative setting, whether it could showcase core level-design elements and whether it would strengthen immersion."
        ],
        points: [
          "Brutalist architecture as a playable structure.",
          "Science fiction used to expand visual possibility.",
          "Every reference filtered through narrative, design and immersion."
        ],
        image: "assets/diehard-gallery-01.png",
        caption: "Tower architecture and level overview"
      },
      {
        title: "Level 1: a descent",
        body: [
          "The player arrives by grappling hook and flying truck, entering the topmost level of the facility. The first meeting with the boss closes the entrance behind the player. From there, the architecture takes over: walls shift, floors move and facilities descend from the level above.",
          "The player has to adapt to a building that is actively recomposing itself, turning each floor into a new encounter, traversal problem or scripted event."
        ],
        points: [
          "Top-floor arrival creates immediate scale.",
          "Environmental shifts force rapid adaptation.",
          "The boss is introduced as architecture as much as character."
        ],
        image: "assets/diehard-gallery-02.png",
        caption: "Interior encounter and environmental shift"
      },
      {
        title: "Level 2: an ascent",
        body: [
          "The second level starts outside the building. Players observe the exterior, defeat turrets and drones, climb a ladder and use a portal before entering the elevator. The elevator triggers a cutscene and moves the player into a more confined shooter space.",
          "Cover, explosive barrels and environmental traps create tactical high-ground opportunities. The final encounter transitions through a moving door into a boss fight. Fog and flying cars reinforce the Cloud City atmosphere, while camera composition emphasizes the scale difference between the player and the enemies."
        ],
        points: [
          "Exterior-to-interior structure.",
          "Third-person shooting shaped by cover and verticality.",
          "Trigger volumes used for smooth gameplay-to-cinematic transitions."
        ],
        image: "assets/editor-uploads/diehard-image-03.webp",
        caption: "Exterior approach and enemy scale"
      }
    ],
    gallery: [
      ["assets/editor-uploads/diehard-image-04.jpg", "Tower key visual"],
      ["assets/editor-uploads/diehard-image-05.jpg", "Boss encounter"],
      ["assets/editor-uploads/diehard-image-06.jpg", "Interior sequence"]
    ],
    reflection:
      "The central design challenge was keeping the tower coherent while moving the player through radically different spaces. The level uses verticality, triggered transformations and repeated visual landmarks to make each shift feel surprising but navigable.",
    credits: [
      "Third Person Kit - Marcin Matuszczyk",
      "Cyber Punk Runner - Raka Samudera",
      "Sci-Fi Skyscrapers Buildings - No Mad Studios",
      "Sci-Fi Spaceship Hangar - Leartes Studios",
      "AGLS - Jakub W",
      "Voyager 3D Model - NASA",
      "Modern Art Museum Environment - PainterNur",
      "Rain Forest Pack - Kaizen Digital Interactive",
      "Wherever You Go - The Avalanchers"
    ],
    link: "https://www.bilibili.com/video/BV1BopM61EGR/",
    linkLabel: "Watch the playthrough",
    next: "uncivilized"
  }
};

const projectOrder = ["uncivilized", "playtime", "showman", "diehard"];
const projectModal = document.querySelector("#project-modal");
const projectContent = document.querySelector("#project-content");
const modalPosition = document.querySelector("#modal-position");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const header = document.querySelector("#site-header");
const scrollPercent = document.querySelector("#scroll-percent");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

let lastFocusedElement = null;
let activeProject = null;

function arrowIcon(direction = "up-right") {
  const paths = direction === "right" ? "M5 12h14M13 5l7 7-7 7" : "M5 19 19 5M8 5h11v11";
  return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="${paths}"/></svg>`;
}

function projectMarkup(project) {
  const sections = project.sections
    .map(
      (section, index) => `
        <section class="case-section">
          <div class="case-text">
            <h3>${section.title}</h3>
            ${section.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
            <ul>${section.points.map((point) => `<li>${point}</li>`).join("")}</ul>
          </div>
          <figure class="case-visual">
            <img src="${section.image}" alt="${section.caption}">
            <figcaption>${String(index + 1).padStart(2, "0")} / ${section.caption}</figcaption>
          </figure>
        </section>
      `
    )
    .join("");

  const meta = project.meta
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");

  const gallery = project.gallery
    .map(
      ([src, caption]) => `
        <figure>
          <img src="${src}" alt="${caption}">
        </figure>
      `
    )
    .join("");

  const credits = project.credits.map((credit) => `<li>${credit}</li>`).join("");
  const nextProject = projects[project.next];

  return `
    <header class="modal-hero">
      <img src="${project.cover}" alt="">
      <div class="modal-hero-copy">
        <span>${project.eyebrow}</span>
        <h2 id="project-modal-title">${project.title}</h2>
        <p>${project.lead}</p>
      </div>
    </header>
    <div class="modal-body">
      <dl class="modal-meta">${meta}</dl>
      <div class="project-intro">
        <h3>Project overview</h3>
        <p>${project.intro}</p>
      </div>
      ${sections}
      <section class="case-gallery">
        <h3>Selected frames</h3>
        <div class="case-gallery-grid">${gallery}</div>
      </section>
      <section class="credits-box">
        <details>
          <summary>Selected assets and credits</summary>
          <ul class="credits-list">${credits}</ul>
        </details>
      </section>
      <div class="credits-box">
        <details>
          <summary>Reflection</summary>
          <p class="reflection-copy">${project.reflection}</p>
        </details>
      </div>
      <footer class="modal-footer">
        <a href="${project.link}" target="_blank" rel="noreferrer">
          ${project.linkLabel}
          ${arrowIcon()}
        </a>
        <a class="next-project" href="#project-${project.next}" data-project="${project.next}">
          <span>Next case study</span>
          ${nextProject.title} ${arrowIcon("right")}
        </a>
      </footer>
    </div>
  `;
}

function openProject(projectId, updateHistory = true) {
  const project = projects[projectId];
  if (!project) return;

  lastFocusedElement = document.activeElement;
  activeProject = projectId;
  projectContent.innerHTML = projectMarkup(project);
  const position = projectOrder.indexOf(projectId) + 1;
  modalPosition.textContent = `${String(position).padStart(2, "0")} / 04`;
  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.querySelector(".modal-close").focus({ preventScroll: true });
  projectModal.querySelector(".project-modal-panel").scrollTop = 0;

  projectContent.querySelectorAll("[data-project]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openProject(link.dataset.project);
    });
  });

  window.dispatchEvent(
    new CustomEvent("portfolio:project-rendered", {
      detail: { projectId, root: projectContent }
    })
  );

  if (updateHistory) {
    const hash = `#project-${projectId}`;
    try {
      history.pushState({ projectId }, "", hash);
    } catch {
      window.location.hash = hash;
    }
  }
}

function closeProject(updateHistory = true) {
  if (!projectModal.classList.contains("is-open")) return;

  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeProject = null;

  if (updateHistory && window.location.hash.startsWith("#project-")) {
    try {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch {
      window.location.hash = "";
    }
  }

  if (lastFocusedElement) {
    lastFocusedElement.focus({ preventScroll: true });
  }
}

function openLightbox(src, caption, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt || caption;
  lightboxCaption.textContent = caption;
  lightbox.showModal();
  lightbox.querySelector(".lightbox-close").focus();
}

document.querySelectorAll(".project-card a[data-project]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openProject(link.dataset.project);
  });
});

projectModal.querySelectorAll("[data-close-project]").forEach((button) => {
  button.addEventListener("click", () => closeProject());
});

document.querySelectorAll(".illustration-card").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    openLightbox(button.dataset.src, button.dataset.caption, image.alt);
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (lightbox.open) {
    lightbox.close();
    return;
  }
  closeProject();
});

window.addEventListener("popstate", () => {
  if (window.location.hash.startsWith("#project-")) {
    openProject(window.location.hash.replace("#project-", ""), false);
  } else {
    closeProject(false);
  }
});

function toggleMenu(force) {
  const isOpen = typeof force === "boolean" ? force : !mobileMenu.classList.contains("is-open");
  mobileMenu.classList.toggle("is-open", isOpen);
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.querySelector(".sr-only").textContent = isOpen ? "Close navigation" : "Open navigation";
}

menuToggle.addEventListener("click", () => toggleMenu());

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.13, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 30);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollPercent.textContent = String(Math.round(progress)).padStart(3, "0");
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (window.location.hash.startsWith("#project-")) {
  const initialProject = window.location.hash.replace("#project-", "");
  if (projects[initialProject]) {
    requestAnimationFrame(() => openProject(initialProject, false));
  }
}

window.openPortfolioProject = openProject;
