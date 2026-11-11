(() => {
  const STORAGE_KEY = "zhang-leyin-language";
  const translations = {
    "Work": "作品",
    "Skip to content": "跳到主要内容",
    "About": "关于",
    "Playground": "互动实验",
    "Illustrations": "插画",
    "Contact": "联系",
    "Portfolio PDF": "作品集 PDF",
    "Navigation / 01-05": "导航 / 01-05",
    "Portfolio 2026": "作品集 2026",
    "BNBU / Game Design": "BNBU / 游戏设计",
    "Emotion Trigger": "情绪触发",
    "EMOTION TRIGGER / PORTFOLIO TRANSMISSION": "情绪触发 / 作品集传送",
    "SCENE 001": "场景 001",
    "BNBU // GAME DESIGN": "BNBU // 游戏设计",
    "Emotion Trigger / Portfolio 2026": "情绪触发 / 作品集 2026",
    "A portfolio by Zhang Leyin": "张乐吟的作品集",
    "Emotional": "情绪",
    "Trigger": "触发",
    "click to watch the video portfolio": "点击观看视频作品集",
    "Selected portfolio": "精选作品集",
    "Game designer / Level designer / Real-time storyteller": "游戏设计师 / 关卡设计师 / 实时叙事创作者",
    "I build expressive worlds in Unreal Engine 5 where mechanics, image and sound connect people through a shared feeling.":
      "我在 Unreal Engine 5 中创造富有表现力的世界，让机制、图像与声音通过共同的情感连接彼此。",
    "Explore selected work": "浏览精选作品",
    "Projects": "项目",
    "Engine": "引擎",
    "Emotion is the mechanic": "情感即机制",
    "Four playable worlds": "四个可玩世界",
    "One point of view": "一种创作视角",
    "SELECTED WORK": "精选作品",
    "MISSION INDEX // 01-04": "任务索引 // 01-04",
    "Worlds built to leave a mark.": "为留下印记而构建的世界。",
    "Four solo projects spanning cinematic storytelling, puzzle design and playable level architecture. Each entry opens a complete design case study.":
      "四个独立项目，涵盖电影化叙事、谜题设计和可玩关卡结构。每个项目都包含完整的设计案例。",
    "Open case study": "打开案例",
    "Real-time short": "实时短片",
    "Puzzle level": "解谜关卡",
    "Adventure level": "冒险关卡",
    "Dual-level shooter": "双关卡射击",
    "02 min": "02 分钟",
    "08 min": "08 分钟",
    "10 min": "10 分钟",
    "Solo": "独立完成",
    "A dialogue-free sci-fi assassination where blue order collapses into a red illusion.":
      "一次没有对白的科幻刺杀：蓝色的秩序最终崩塌为红色的幻象。",
    "Objects, ambient sound and spatial memory drive a level with no dialogue.":
      "物件、环境声音与空间记忆共同驱动一个没有对白的关卡。",
    "A ruined carnival becomes a readable, escalating route from graveyard to Ferris wheel.":
      "废弃嘉年华从墓地延伸至摩天轮，形成一条清晰而不断升级的路线。",
    "Two levels move through one brutalist tower in opposite directions, ending at the boss.":
      "两个关卡以相反方向穿过同一座粗野主义高塔，最终在首领处汇合。",
    "Two levels move through one brutalist sci-fi tower in opposite directions and meet at the boss.":
      "两个关卡以相反方向穿过同一座粗野主义科幻高塔，最终在首领处汇合。",
    "NEXT": "下一个",
    "INDEPENDENT GAME": "独立游戏",
    "IN DEVELOPMENT": "开发中",
    "In development": "开发中",
    "Writer's Block / 写作障碍": "写作障碍 / Writer's Block",
    "Next independent game": "下一款独立游戏",
    "NEXT PROJECT // WRITER'S BLOCK": "下一个项目 // WRITER'S BLOCK",
    "A narrator tells you what to do. You decide whether to obey.":
      "旁白告诉你要做什么，而你决定是否服从。",
    "The next independent game grows out of Play Time and draws inspiration from The Stanley Parable. Its narrator guides the player through a world where following instructions is always a choice.":
      "这款独立游戏从《Play Time》发展而来，并受到《The Stanley Parable》的启发。旁白引导玩家穿过一个世界，而是否遵循指令始终是一种选择。",
    "Beyond the portfolio level, the project adds a complete narrative and stronger connections between levels, with a tone made for players who value distinctive independent games.":
      "在作品集关卡之外，这个项目还会加入完整叙事和更紧密的关卡联系，面向重视独特独立游戏的玩家。",
    "Watch the trailer": "观看预告片",
    "GAME SCREENS // 06": "游戏画面 // 06",
    "Gameplay frames from the next independent game.": "下一款独立游戏的游玩画面。",
    "PROFILE": "个人档案",
    "IDENTITY // ZHANG LEYIN": "身份 // 张乐吟",
    "FRAME 001": "帧 001",
    "Designer / Storyteller": "设计师 / 叙事者",
    "PROFILE DATA // ABOUT ME": "个人资料 // 关于我",
    "I make games because they can make us feel something once in a lifetime.":
      "我制作游戏，因为它们能让我们体验到一生一次的感动。",
    "My name is Zhang Leyin. I am a game designer and level designer working across real-time narrative, environmental storytelling and playable systems.":
      "我是张乐吟，一名游戏设计师与关卡设计师，工作方向包括实时叙事、环境叙事与可玩系统。",
    "From the sinking sunset on another planet to a friendship built across an adventure, games can turn image, sound and interaction into shared emotion. That is the reason I keep making them.":
      "从另一颗星球上沉落的夕阳，到一段冒险中建立的友谊，游戏能把图像、声音与互动转化为共享的情感。这也是我持续创作游戏的原因。",
    "It helps find your people. It is magic. It is emotional trigger.":
      "它帮助我们找到彼此。它是魔法，也是情绪的触发器。",
    "Focus": "方向",
    "Game and level design": "游戏与关卡设计",
    "Toolkit": "工具",
    "UE5 / Blueprints / Level Sequence": "UE5 / 蓝图 / Level Sequence",
    "Education": "教育",
    "Beijing Normal-Hong Kong Baptist University - BNBU": "北京师范大学-香港浸会大学联合国际学院（BNBU）",
    "INTERACTIVE LAB": "互动实验",
    "CAMERA / LIVE": "摄像头 / 实时",
    "FACE MESH // MATRIX BIO-INTERFACE": "面部网格 // MATRIX 生物界面",
    "Your face becomes a signal.": "你的脸成为一个信号。",
    "A live camera experiment that transforms facial geometry into an unstable field of code, light and digital noise.":
      "一个实时摄像头实验，将面部几何转化为由代码、光线与数字噪声构成的不稳定场域。",
    "INPUT / CAMERA": "输入 / 摄像头",
    "MODEL / 478 FACE LANDMARKS": "模型 / 478 个面部关键点",
    "Matrix face interface": "Matrix 人脸界面",
    "Start camera": "启动摄像头",
    "Current state": "当前状态",
    "SEARCHING": "搜索中",
    "Face lock": "人脸锁定",
    "Stop camera": "停止摄像头",
    "Camera off. Nothing is recorded.": "摄像头已关闭，不会录制任何内容。",
    "VISUAL ARCHIVE": "视觉档案",
    "CHARACTER STUDY // SKETCHBOOK": "角色研究 // 速写本",
    "Character studies, visual experiments, fan art.": "角色研究、视觉实验与同人创作。",
    "A separate sketchbook inside the same world-building practice.":
      "同一套世界构建实践中的另一本视觉速写。",
    "View full image": "查看完整图片",
    "FAN ART / 01": "同人创作 / 01",
    "FAN ART / 02": "同人创作 / 02",
    "ORIGINAL / 03": "原创 / 03",
    "ORIGINAL / 04": "原创 / 04",
    "ORIGINAL / 05": "原创 / 05",
    "ORIGINAL / 06": "原创 / 06",
    "FIELD NOTE": "现场笔记",
    "Gamers can feel when developers are passionate about their games. Don't be afraid to hold onto your unique vision: just be aware that it may not turn out exactly how you envisioned.":
      "玩家能感受到开发者是否真正热爱自己的游戏。不要害怕坚持独特的愿景，只需明白最终结果未必完全如你所想。",
    "Level Up! The Guide to Great Video Game Design": "《Level Up! The Guide to Great Video Game Design》",
    "Scott Rogers,": "Scott Rogers，",
    "SEC. 05 / CONTACT": "第 05 节 / 联系",
    "Have an emotion worth triggering?": "有值得被触发的情绪吗？",
    "I am interested in game design, level design and real-time narrative work that treats atmosphere as part of the mechanic.":
      "我希望参与游戏设计、关卡设计与实时叙事项目，尤其是把氛围作为机制一部分的作品。",
    "Watch the work": "观看作品",
    "Download portfolio PDF": "下载作品集 PDF",
    "Writer's Block": "Writer's Block",
    "Back to top": "返回顶部",
    "Site editor": "网站编辑器",
    "Built from the original NTU portfolio": "基于原始 NTU 作品集构建",
    "Case study": "案例研究",
    "Project overview": "项目概述",
    "Selected frames": "精选画面",
    "Selected assets and credits": "素材与鸣谢",
    "Reflection": "反思",
    "Next case study": "下一个案例",
    "Format": "形式",
    "Duration": "时长",
    "Role": "角色",
    "Software": "软件",
    "Real-time short film": "实时短片",
    "2 minutes": "2 分钟",
    "Solo project": "独立项目",
    "Playable puzzle level": "可玩解谜关卡",
    "8 minutes incl. trailer": "8 分钟（含预告）",
    "Third-person adventure level": "第三人称冒险关卡",
    "Two-level action game": "双关卡动作游戏",
    "01 / Real-time short": "01 / 实时短片",
    "02 / Puzzle level": "02 / 解谜关卡",
    "03 / Adventure level": "03 / 冒险关卡",
    "04 / Dual-level shooter": "04 / 双关卡射击",
    "A dialogue-free sci-fi assassination short in which blue order collapses into a red dream.":
      "一部没有对白的科幻刺杀短片，蓝色的秩序在其中崩塌为红色梦境。",
    "On a distant alien planet, an assassin moves through a city ruled by a cold, ordered power. The film opens with an elevator descent, red light flickering across the protagonist, soldiers pursuing from above and blue headlights cutting through smoke. With no dialogue, image and sound carry the story.":
      "在一颗遥远的外星上，一名刺客穿过由冷酷秩序统治的城市。影片从电梯下坠开始，红光掠过主角，士兵从上方追击，蓝色车灯切开烟雾。没有对白，图像与声音承担整个叙事。",
    "The concept": "概念",
    "The plot began with the first Assassin's Creed trailer and the idea of an assassination that crosses into an unreal space. The final sequence takes inspiration from the Red Room in Twin Peaks, using television and dream logic in a future that has otherwise moved beyond them.":
      "故事最初受到《Assassin's Creed》首支预告片启发，并围绕一次进入非现实空间的刺杀展开。最终段落参考《Twin Peaks》的红色房间，在一个已经超越电视的未来中使用电视与梦境逻辑。",
    "The subject is dark, but the feeling underneath is rebellion, hope and passion. I wanted the ending to move from suspense into a state that asks viewers to stop decoding the plot and simply feel it.":
      "题材是黑暗的，但底层情绪是反叛、希望与热情。我希望结尾从悬念转向一种状态，让观众停止解读情节，只是去感受它。",
    "Dialogue-free storytelling through image, editing and sound.": "通过图像、剪辑与声音完成无对白叙事。",
    "Cold blue power against the danger and unknown of red.": "冷蓝色权力与红色的危险、未知形成对抗。",
    "A deliberate collision of futuristic technology and antiquated media.": "未来科技与旧媒介的有意碰撞。",
    "Movement and performance": "动作与表演",
    "The escape moves from running to sliding, then leaping from a building. The camera rotates at the final parkour move to heighten the speed and decisiveness. The movement language gives the assassin agility, but standing perfectly still is the action that best defines the character.":
      "逃亡从奔跑转为滑行，再从建筑跃下。镜头在最后的跑酷动作中旋转，以强化速度与决断。动作语言赋予刺客敏捷感，但完全静止才是最能定义角色的动作。",
    "The final target is framed at the center of a space filled with steam and red light. The audience initially reads control, right up to the moment the environment reveals that the ruler has crossed into the assassin's illusion.":
      "最终目标位于蒸汽与红光包围的空间中央。观众最初会将其理解为掌控，直到环境揭示统治者已经进入刺客的幻象。",
    "Parkour transitions designed as character beats.": "将跑酷转场设计为角色节拍。",
    "Camera rotation used to amplify the escape.": "使用镜头旋转强化逃亡感。",
    "A brief pause before the fatal bullet, followed by an explosion.": "致命子弹前短暂停顿，随后爆发。",
    "Visual and technical": "视觉与技术",
    "The blue-to-red transition carries the theme directly. Blue represents the ruler's ordered dominance; red represents danger, desire and the unknown. Smoke allows both palettes to mix into a hazy, immersive look.":
      "从蓝到红的转变直接承载主题。蓝色代表统治者有秩序的支配，红色代表危险、欲望与未知。烟雾让两种色彩混合成朦胧而沉浸的观感。",
    "Unreal Engine and Level Sequence made rapid cinematic iteration possible. Tripo generated the Artemis statue, while Seedance produced the in-scene footage that pays homage to The Twilight Zone.":
      "Unreal Engine 与 Level Sequence 让电影化迭代得以快速进行。Tripo 生成 Artemis 雕像，Seedance 制作了向《The Twilight Zone》致敬的场景影像。",
    "UE5 Level Sequence for real-time cinematography.": "使用 UE5 Level Sequence 完成实时电影摄影。",
    "Fast cutting and obscured sightlines used to hide transition seams.": "利用快速剪辑与遮挡视线隐藏转场接缝。",
    "Blue and red lighting systems used as narrative language.": "将蓝红灯光系统作为叙事语言。",
    "Concept and visual direction": "概念与视觉方向",
    "Movement study from the final real-time sequence": "最终实时段落的动作研究",
    "Lighting and final-frame development": "灯光与最终画面开发",
    "Key visual": "主视觉",
    "Motion sequence": "动作序列",
    "Final composition": "最终构图",
    "If I remade the film, I would add a sequence establishing the ruler's impact on the city and pair it with poetic narration to deepen the emotional weight. Looking back, the project revealed how strongly I rely on visual impact and musical rhythm over text.":
      "如果重做这部影片，我会增加一段展现统治者对城市影响的序列，并配合诗性旁白来加深情感重量。回看这个项目，它让我意识到自己多么依赖视觉冲击与音乐节奏，而非文字。",
    "Watch Uncivilized": "观看 Uncivilized",
    "An atmospheric level where objects, ambient sound and spatial memory replace dialogue.":
      "一个以物件、环境声与空间记忆取代对白的氛围型关卡。",
    "Play Time is built inside the Horror Engine template, a starting point that gave me a set of mechanics to study and reshape. The level asks players to clear obstacles through item interactions while creating an expressive environment inside a confined space.":
      "《Play Time》建立在 Horror Engine 模板之上，这个起点为我提供了一套可以研究与重塑的机制。关卡要求玩家通过物件交互清除障碍，同时在有限空间中构建富有表现力的环境。",
    "Two mechanics": "两种机制",
    "The design centers on two actions: gathering information by listening to ambient sounds throughout the level, and testing the abilities of different objects by clicking on them. Puzzles and music become the engine of progression.":
      "设计围绕两个动作展开：通过聆听环境声音收集信息，以及点击不同物件测试其能力。谜题与音乐成为推进关卡的引擎。",
    "The project was inspired by the film Playtime and its choreography of space. My criterion for each idea was whether it was interesting and distinctive enough to communicate the project's atmosphere.":
      "项目受到电影《Playtime》及其空间编排的启发。我判断每个想法的标准，是它是否足够有趣、独特，并能传达项目的氛围。",
    "Sound becomes a navigation and puzzle tool.": "声音成为导航与解谜工具。",
    "Object behavior is learned through experimentation.": "通过实验学习物件行为。",
    "Readability is prioritized before surface complexity.": "优先保证可读性，再处理表层复杂度。",
    "Environmental tone and spatial composition": "环境基调与空间构图",
    "From whitebox to playable space": "从白盒到可玩空间",
    "The process moved through three stages: collecting reference images, mood boards and music; building a whitebox and expanding its structure around puzzle logic; then refining specific puzzles with sound design.":
      "制作过程分为三个阶段：收集参考图、情绪板与音乐；搭建白盒并围绕谜题逻辑扩展结构；最后用声音设计细化具体谜题。",
    "A playtest showed that players found the puzzles too difficult, so I lowered the difficulty and made object interactions more intuitive. The role of personal expression stayed important, but player readability and a smooth route to completion came first.":
      "一次试玩显示玩家认为谜题过难，因此我降低难度并让物件交互更直观。个人表达仍然重要，但玩家可读性与顺畅完成路径被放在首位。",
    "Reference and mood-board phase before construction.": "搭建前进行参考与情绪板阶段。",
    "Blueprint-driven platform movement.": "由蓝图驱动的平台移动。",
    "Difficulty revised in response to playtesting.": "根据试玩反馈调整难度。",
    "Level layout and whitebox study": "关卡布局与白盒研究",
    "Sound as architecture": "声音作为建筑",
    "Zone-based triggers start and stop specific sounds as the player enters and leaves an area. Because the game has no text, sound and environment carry the narrative. Candles, red lights, Twin Peaks footage and mysterious patterns build an unstable, dreamlike atmosphere.":
      "区域触发器会在玩家进入和离开时开始或停止特定声音。由于游戏没有文字，声音与环境承担叙事。蜡烛、红光、《Twin Peaks》影像与神秘图案共同营造不稳定、梦境般的氛围。",
    "The most technically demanding parts were the level and sound design. A planned chase sequence was cut because it disrupted the exploratory rhythm and clashed with the overall tone.":
      "技术上最具挑战的部分是关卡与声音设计。原本计划的追逐段落因为破坏探索节奏、与整体基调冲突而被删除。",
    "Area-specific sound triggered by player movement.": "由玩家移动触发区域专属声音。",
    "Radiohead tracks used as structural cues.": "使用 Radiohead 曲目作为结构提示。",
    "A deliberate choice to remove a chase sequence.": "有意移除追逐段落。",
    "Atmosphere, lighting and object interaction": "氛围、灯光与物件交互",
    "Level atmosphere": "关卡氛围",
    "Whitebox and layout": "白盒与布局",
    "Lighting study": "灯光研究",
    "The future development of this game points toward Writer's Block: a narrator tells the player what to do, and the player decides whether to obey. It grows from this portfolio level into the possibility of a standalone indie game inspired by The Stanley Parable.":
      "这款游戏的后续发展指向《Writer's Block》：旁白告诉玩家要做什么，玩家决定是否服从。它从作品集关卡延伸为一款受《The Stanley Parable》启发的独立游戏。",
    "Watch the playthrough": "观看游玩视频",
    "A ruined carnival level that moves from graveyard anxiety to a Ferris wheel assassination.":
      "一个从墓地焦虑推进到摩天轮刺杀的废弃嘉年华关卡。",
    "The level begins in a ruined graveyard, opens into a small circus checkpoint and then reveals a Ferris wheel as its primary visual target. The player can fight, sneak, slide down ropes or find another way around, with every route designed to remain readable.":
      "关卡从废弃墓地开始，进入小型马戏团检查点，随后揭示作为主要视觉目标的摩天轮。玩家可以战斗、潜行、沿绳索滑下或寻找其他路线，每条路径都保持清晰可读。",
    "Gameplay loop": "游玩循环",
    "Players confirm the target at the start, observe enemy locations and decide whether to fight or sneak. Targeting and action reward calm, deliberate aiming, while pathfinding lets players choose between direct combat, elevated rope routes and quieter approaches.":
      "玩家在开始时确认目标，观察敌人位置并决定战斗或潜行。瞄准与行动奖励冷静而果断的瞄准，寻路则允许玩家在正面战斗、高处绳索路线和更安静的路径之间选择。",
    "Grenades support fast elimination of a squad, while bandages help the player recover. Vehicles, torches, balloons and question-mark signs act as navigation cues without interrupting the environmental tone.":
      "手榴弹支持快速清除小队，绷带帮助玩家恢复。载具、火把、气球与问号标牌在不破坏环境基调的前提下充当导航提示。",
    "Observe, decide, target and act.": "观察、判断、瞄准并行动。",
    "Multiple routes with different levels of risk.": "多条具有不同风险等级的路线。",
    "Items used to create tactical and pacing options.": "用道具创造战术与节奏选择。",
    "Combat, targeting and route choice": "战斗、瞄准与路线选择",
    "Level sequence": "关卡序列",
    "The graveyard establishes horror and danger while giving the player room to adjust to the controls. The circus provides a checkpoint and a first main visual target. Lighting the map creates a stronger read on the route ahead.":
      "墓地建立恐怖与危险感，同时给玩家适应操作的空间。马戏团提供检查点与第一个主要视觉目标。点亮地图则让前方路线更易读取。",
    "Ropes turn traversal into a fast, adventurous movement system. The Ferris wheel becomes the most important landmark, then the assassination site. The level ends with a car escape, giving the player a release after the climax.":
      "绳索将移动转化为快速、冒险的动作系统。摩天轮成为最重要的地标，也成为刺杀地点。关卡以汽车逃离结束，在高潮后给玩家释放感。",
    "Graveyard as mood and tutorial space.": "墓地作为氛围与教学空间。",
    "Circus as checkpoint and visual anchor.": "马戏团作为检查点与视觉锚点。",
    "Ferris wheel as destination, climax and payoff.": "摩天轮作为目的地、高潮与回报。",
    "Ferris wheel landmark and route framing": "摩天轮地标与路线构图",
    "Production process": "制作过程",
    "Preliminary research began with a retro PSX direction that I ultimately abandoned in favor of adventure-game language. I replaced the character model, tested parkour features, analyzed level flow and purchased the AGLS plugin for basic feature testing.":
      "前期研究从复古 PSX 方向开始，但我最终放弃它，转向冒险游戏语言。我替换角色模型、测试跑酷功能、分析关卡流程，并购买 AGLS 插件进行基础功能测试。",
    "Environment blockout established the ruins, Ferris wheel and amusement park areas. I designed three optional routes, then repeatedly iterated on AI difficulty, zipline collision and route guidance. The polish phase added a title sequence, trigger-based music, moving vehicles, torches, balloons and question-mark signs.":
      "环境白盒确立了废墟、摩天轮与游乐园区域。我设计三条可选路线，并反复迭代 AI 难度、滑索碰撞与路线引导。打磨阶段加入标题序列、触发式音乐、移动载具、火把、气球与问号标牌。",
    "Research window: 5.15 - 5.21.": "研究阶段：5.15 - 5.21。",
    "Environment blockout: 5.25 - 5.31.": "环境白盒：5.25 - 5.31。",
    "Polish and playable demo: 6.1 - 6.8.": "打磨与可玩演示：6.1 - 6.8。",
    "Production pass and environmental detail": "制作阶段与环境细节",
    "Player route": "玩家路线",
    "Ferris wheel": "摩天轮",
    "The project is deliberately structured around orientation. Three optional paths let players express their play style, but the environment has to keep the destination legible even when the view is dark or obstructed.":
      "项目刻意围绕方向感构建。三条可选路径让玩家表达自己的游玩风格，但即使视野昏暗或被遮挡，环境也必须让目的地保持清晰。",
    "A ruined carnival level from graveyard to Ferris wheel.": "从墓地到摩天轮的废弃嘉年华关卡。",
    "An exploration of a brutalist sci-fi tower and the people inside it.":
      "对一座粗野主义科幻高塔及其内部人物的探索。",
    "Die Hard combines Brutalist architecture with science-fiction action. The first level descends from the top of the building toward the boss; the second climbs from the exterior into a confined third-person shooter sequence. Both levels use the tower as a changing machine.":
      "《Die Hard》将粗野主义建筑与科幻动作结合。第一关从建筑顶部向首领下坠，第二关则从外部攀升进入封闭的第三人称射击段落。两个关卡都把高塔作为一台不断变化的机器。",
    "Inspiration": "灵感",
    "The initial spark came from Kill Bill and a long-standing appreciation for Brutalist architecture. I expanded it with science-fiction elements to enrich and diversify the scene, drawing on Sifu's museum level, Dishonored 2's Clockwork Mansion, Mass Effect's Citadel and Cloud City.":
      "最初的灵感来自《Kill Bill》以及我对粗野主义建筑的长期兴趣。我用科幻元素扩展它，以丰富并多样化场景，同时参考《Sifu》的美术馆关卡、《Dishonored 2》的 Clockwork Mansion、《Mass Effect》的 Citadel 与 Cloud City。",
    "I selected the final concept using three criteria: whether it fit the narrative setting, whether it could showcase core level-design elements and whether it would strengthen immersion.":
      "我用三个标准选择最终概念：是否符合叙事设定、是否能展示核心关卡设计元素，以及是否增强沉浸感。",
    "Brutalist architecture as a playable structure.": "将粗野主义建筑作为可玩结构。",
    "Science fiction used to expand visual possibility.": "用科幻扩展视觉可能性。",
    "Every reference filtered through narrative, design and immersion.": "所有参考都经过叙事、设计与沉浸感过滤。",
    "Tower architecture and level overview": "高塔建筑与关卡概览",
    "Level 1: a descent": "关卡 1：下坠",
    "The player arrives by grappling hook and flying truck, entering the topmost level of the facility. The first meeting with the boss closes the entrance behind the player. From there, the architecture takes over: walls shift, floors move and facilities descend from the level above.":
      "玩家通过抓钩与飞行卡车抵达设施顶层。与首领的第一次会面关闭了身后的入口。从那里开始，建筑接管一切：墙体移动、楼层变化，设施从上层降下。",
    "The player has to adapt to a building that is actively recomposing itself, turning each floor into a new encounter, traversal problem or scripted event.":
      "玩家必须适应一栋不断重组自身的建筑，每一层都会变成新的遭遇、移动问题或脚本事件。",
    "Top-floor arrival creates immediate scale.": "顶层抵达立即建立尺度感。",
    "Environmental shifts force rapid adaptation.": "环境变化迫使玩家快速适应。",
    "The boss is introduced as architecture as much as character.": "首领既是角色，也是建筑本身。",
    "Interior encounter and environmental shift": "室内遭遇与环境变化",
    "Level 2: an ascent": "关卡 2：上升",
    "The second level starts outside the building. Players observe the exterior, defeat turrets and drones, climb a ladder and use a portal before entering the elevator. The elevator triggers a cutscene and moves the player into a more confined shooter space.":
      "第二关从建筑外部开始。玩家观察外观、击败炮塔与无人机、攀爬梯子并使用传送门，随后进入电梯。电梯触发过场，并将玩家带入更封闭的射击空间。",
    "Cover, explosive barrels and environmental traps create tactical high-ground opportunities. The final encounter transitions through a moving door into a boss fight. Fog and flying cars reinforce the Cloud City atmosphere, while camera composition emphasizes the scale difference between the player and the enemies.":
      "掩体、爆炸桶与环境陷阱创造战术制高点。最终遭遇通过移动门过渡到首领战。雾气与飞行汽车强化 Cloud City 氛围，镜头构图则强调玩家与敌人的尺度差异。",
    "Exterior-to-interior structure.": "从外部到内部的结构。",
    "Third-person shooting shaped by cover and verticality.": "由掩体与垂直空间塑造的第三人称射击。",
    "Trigger volumes used for smooth gameplay-to-cinematic transitions.": "使用触发区域实现平滑的游玩到过场过渡。",
    "Exterior approach and enemy scale": "外部接近与敌人尺度",
    "Tower key visual": "高塔主视觉",
    "Boss encounter": "首领遭遇",
    "Interior sequence": "室内序列",
    "The central design challenge was keeping the tower coherent while moving the player through radically different spaces. The level uses verticality, triggered transformations and repeated visual landmarks to make each shift feel surprising but navigable.":
      "核心设计挑战是在让玩家穿过截然不同空间的同时保持高塔的连贯性。关卡利用垂直性、触发式变化与重复视觉地标，让每次转变既出人意料又保持可导航。",
    "Watch the playthrough": "观看游玩视频",
    "Open the Uncivilized case study": "打开 Uncivilized 案例",
    "Open the Play Time case study": "打开 Play Time 案例",
    "Open the Death of the Showman case study": "打开 Death of the Showman 案例",
    "Open the Die Hard case study": "打开 Die Hard 案例",
    "Close case study": "关闭案例",
    "Close image": "关闭图片",
    "Primary navigation": "主导航",
    "Mobile navigation": "移动导航",
    "Open navigation": "打开导航",
    "Close navigation": "关闭导航",
    "Portfolio introduction": "作品集介绍",
    "Design philosophy": "设计理念",
    "Footer navigation": "页脚导航",
    "Illustration preview": "插画预览",
    "Visual archive preview": "视觉档案预览"
  };

  const textOriginals = new WeakMap();
  const attributeOriginals = new WeakMap();
  let language = readStoredLanguage();
  let applying = false;

  function normalize(value) {
    return String(value).replace(/\s+/g, " ").trim();
  }

  function readStoredLanguage() {
    return "zh";
  }

  function persistLanguage() {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The selection still applies for this session.
    }
  }

  function translateValue(value) {
    if (language !== "zh") return value;
    return translations[normalize(value)] || value;
  }

  function shouldSkipElement(element) {
    return Boolean(
      element.closest(
        "script, style, noscript, #portfolio-editor-root, [data-i18n-ignore]"
      )
    );
  }

  function applyTextNode(node) {
    const parent = node.parentElement;
    if (!parent || shouldSkipElement(parent)) return;

    const source = textOriginals.get(node) || node.nodeValue;
    if (!normalize(source)) return;

    if (!textOriginals.has(node)) {
      textOriginals.set(node, node.nodeValue);
    }

    const translated = translateValue(source);
    if (translated !== source) {
      node.nodeValue = translated;
    }
  }

  function restoreTextNode(node) {
    const original = textOriginals.get(node);
    if (original !== undefined) node.nodeValue = original;
  }

  function applyAttributes(element) {
    if (!element || shouldSkipElement(element)) return;
    const names = ["aria-label", "title", "placeholder", "alt"];
    let originals = attributeOriginals.get(element);
    if (!originals) {
      originals = {};
      attributeOriginals.set(element, originals);
    }

    names.forEach((name) => {
      const current = element.getAttribute(name);
      if (!current) return;
      if (!(name in originals)) originals[name] = current;
      element.setAttribute(
        name,
        language === "zh"
          ? translations[normalize(originals[name])] || originals[name]
          : originals[name]
      );
    });
  }

  function walk(root, callback) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      callback(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) {
      return;
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || shouldSkipElement(parent)) {
            return NodeFilter.FILTER_REJECT;
          }
          return normalize(node.nodeValue)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(callback);
  }

  function translateTree(root = document.body) {
    if (!root || document.body.classList.contains("editor-mode")) return;
    applying = true;
    walk(root, language === "zh" ? applyTextNode : restoreTextNode);
    const elements = root.nodeType === Node.ELEMENT_NODE
      ? [root, ...root.querySelectorAll("*")]
      : root.nodeType === Node.DOCUMENT_NODE
        ? [...root.querySelectorAll("*")]
        : [];
    elements.forEach(applyAttributes);
    applying = false;
  }

  function updateToggle() {
    const button = document.querySelector("[data-language-toggle]");
    if (!button) return;
    button.textContent = language === "zh" ? "EN" : "中文";
    button.setAttribute(
      "aria-label",
      language === "zh" ? "Switch to English" : "切换到中文"
    );
  }

  function setLanguage(nextLanguage, persist = true) {
    language = nextLanguage === "zh" ? "zh" : "en";
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = language;
    document.title = language === "zh"
      ? "张乐吟 - 情绪触发"
      : "Zhang Leyin - Emotion Trigger";
    if (persist) persistLanguage();
    translateTree(document.body);
    updateToggle();
    window.dispatchEvent(
      new CustomEvent("portfolio:language-changed", {
        detail: { language }
      })
    );
  }

  function toggleLanguage() {
    setLanguage(language === "zh" ? "en" : "zh");
  }

  function t(english, chinese) {
    return language === "zh" ? chinese : english;
  }

  function init() {
    const toggle = document.querySelector("[data-language-toggle]");
    toggle?.addEventListener("click", toggleLanguage);
    setLanguage(language, false);

    const observer = new MutationObserver((records) => {
      if (applying || language !== "zh") return;
      records.forEach((record) => {
        record.addedNodes.forEach((node) => translateTree(node));
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  window.PortfolioI18n = {
    get language() {
      return language;
    },
    t,
    translate: translateValue,
    translateTree,
    setLanguage,
    toggle: toggleLanguage
  };

  init();
})();
