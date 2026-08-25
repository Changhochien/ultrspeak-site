import type { Locale } from "./config";

export const en = {
  meta: {
    home: {
      title: "ultrspeak — Private, Offline Voice Dictation for Mac and Windows",
      description:
        "Private voice dictation for Mac and Windows. Turn English or Mandarin speech into clear text at your cursor, on-device and offline.",
    },
    contact: {
      title: "Contact — ultrspeak",
      description: "Get in touch with the ultrspeak team.",
    },
    success: {
      title: "Checkout complete — ultrspeak",
      description: "Return to ultrspeak to use your Pro subscription.",
    },
    privacy: {
      title: "Privacy — ultrspeak",
      description: "How ultrspeak handles your data.",
    },
    terms: {
      title: "Terms of Service — ultrspeak",
      description: "The terms that cover your use of ultrspeak.",
    },
  },
  nav: {
    primaryAria: "Primary navigation",
    features: "Features",
    how: "How it works",
    pricing: "Pricing",
    get: "Get ultrspeak",
    language: "Choose language",
  },
  hero: {
    eyebrow: "Private, offline voice dictation for Mac and Windows",
    title: "Your words,",
    titleAccent: "ready at the cursor.",
    body: "Hold one key and speak. ultrspeak turns your voice into clean, formatted text in the app where you're writing—on your device, offline, without uploading your voice.",
    download: "Download",
    seeItWork: "See it work",
    imageAlt: "ultrspeak app, Home screen",
  },
  modes: {
    eyebrow: "Modes",
    title: "One voice. Every register.",
    intro:
      "Pick a mode and ultrspeak shapes the same rambling thought into the tone the moment calls for.",
    labels: ["Formal", "Casual", "Email", "Prompt"],
    youSaid: "You said",
    said: "um so can you send me last quarter's report whenever you get a sec, thanks",
    writes: "ultrspeak writes",
    formal:
      "Could you please send me last quarter's report when you have a moment? Thank you.",
    casual:
      "hey, could you send over last quarter's report when you get a sec? thanks!",
    emailSubject: "Subject: Last quarter's report",
    emailBody:
      "Hi,\nWhen you have a moment, could you send me last quarter's report? No rush. Thanks for your help.",
    prompt:
      "Pull last quarter's report and summarize the key metrics, flagging anything that moved more than 10%.",
    note: "Punctuation, capitalization, and tone, handled.",
  },
  features: {
    eyebrow: "Why ultrspeak",
    title: "Built to feel like thinking out loud.",
    cards: [
      {
        title: "It never leaves your computer",
        body: "Transcription runs on your device with local models. There is no cloud processing and no audio or text upload. ultrspeak works on a plane, in a meeting, anywhere, and your voice stays yours.",
      },
      {
        title: "Hold a key, keep your flow",
        body: "One global shortcut works across supported text inputs in the apps you use. The text lands where your cursor already is.",
      },
      {
        title: "Knows your words",
        body: "Teach it names, jargon, and product terms once. Your custom vocabulary lands right the first time, every time.",
      },
      {
        title: "English and Mandarin",
        body: "Dedicated routing for Mandarin alongside English, with automatic fallback so mixed-language speech stays accurate.",
      },
      {
        title: "Nothing gets lost",
        body: "Every dictation is saved locally and searchable. Find, copy, or reuse anything you have said, then clear it whenever you want.",
      },
    ],
    bytesSent: "0 bytes sent",
    historyAlt: "ultrspeak app, searchable History of past dictations",
  },
  integrations: {
    eyebrow: "Works across your workflow",
    title: "Use your voice in the apps where you write.",
    intro:
      "ultrspeak is one keystroke away across common desktop apps. No integrations to set up, no plugins, no copy and paste.",
    apps: [
      ["Slack", "Mail", "Notes", "Cursor", "VS Code", "Notion"],
      ["Messages", "Safari", "Chrome", "Obsidian", "Linear"],
      ["Gmail", "Figma", "Terminal", "Docs", "Discord"],
    ],
    hold: "Hold Space to dictate",
  },
  comparison: {
    eyebrow: "Local vs cloud",
    title: "Your voice doesn't need a server.",
    intro:
      "ultrspeak transcribes with models running on your machine. That changes a few things compared with dictation that sends your audio elsewhere:",
    columnsUs: "ultrspeak",
    columnsCloud: "Cloud dictation",
    rows: [
      {
        label: "Where audio goes",
        us: "Never leaves your device",
        cloud: "Uploaded for processing",
      },
      {
        label: "Works offline",
        us: "Yes, fully",
        cloud: "No",
      },
      {
        label: "Free words every week",
        us: "8,000, no account needed",
        cloud: "Trial credits, account required",
      },
    ],
    note: "The comparison describes typical cloud dictation services, not any specific product.",
  },
  how: {
    title: "Three seconds, start to finish.",
    live: "Live transcript preview",
    steps: [
      {
        title: "Hold your shortcut",
        body: "A subtle indicator appears. In supported apps, ultrspeak starts listening without making you switch windows.",
        alt: "ultrspeak listening indicator with a live waveform",
      },
      {
        title: "See it stream live",
        body: "Your words appear in the indicator while you speak. Stable text stays crisp while the newest phrase remains visibly in progress.",
        alt: "ultrspeak live transcript preview streaming words while recording",
      },
      {
        title: "Release, it's typed",
        body: "Clean, punctuated text appears instantly at your cursor. Keep working without breaking flow.",
        alt: "ultrspeak delivered indicator",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Honest pricing. No lock-in.",
    intro:
      "Start free, then upgrade through your account when you want unlimited dictation. Cancel any time.",
    free: "Free",
    freeIntro: "Try dictation, no account needed.",
    forever: "forever",
    downloadFree: "Download free",
    freeFeatures: [
      "On-device transcription",
      "English & Mandarin",
      "Global hold-to-talk shortcut",
      "Up to 8,000 words per week",
    ],
    proIntro: "Unlimited, for daily drivers.",    perYear: "USD / year",
    monthly: "about $1.62 per month, billed annually",
    upgrade: "Sign in to upgrade",
    accountPortalNote:
      "You'll sign in at accounts.ultrclick.com — the ultrspeak account portal.",
    paidFeatures: [
      "Everything in Free",
      "Unlimited dictation",
      "All writing modes",
      "Custom vocabulary",
      "Searchable history",
    ],
    checkout:
      "Secure checkout is hosted by Stripe. Manage or cancel your subscription from your account.",
  },
  faq: {
    title: "Questions, answered.",
    items: [
      {
        q: "Does my voice get sent to a server?",
        a: "No. Transcription runs entirely on your computer with on-device models. ultrspeak works offline and never uploads your audio or text.",
      },
      {
        q: "How do I activate my license?",
        a: "Sign in to your ultrspeak account and choose Upgrade to Pro. Checkout is hosted securely by Stripe, and your Pro access is linked to the same account you use in the app.",
      },
      {
        q: "Which devices are supported?",
        a: "ultrspeak runs on Apple Silicon Macs (M1 and newer) with macOS 13 or later, and on Windows 11. On-device models perform best on recent hardware.",
      },
      {
        q: "What languages does it handle?",
        a: "English and Mandarin Chinese today, with dedicated routing for each and graceful fallback for mixed-language speech.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes, 14 days, no questions asked. Email us from the address on your account and we'll process it. Payments are handled securely through Stripe.",
      },
      {
        q: "Is it on the App Store?",
        a: "ultrspeak is sold directly so it can run on-device models without sandbox limits. You download a signed app straight from us, on both Mac and Windows.",
      },
    ],
  },
  footer: {
    title: "Your voice stays on your device —",
    titleAccent: "your words land where you type.",
    intro:
      "Try it free on Mac and Windows, with English and Mandarin dictation.",
    requirements: "Mac: Apple M1 or newer, macOS 13+ · Windows 11",
    downloadMac: "Download for Mac",
    downloadWindows: "Download for Windows",
    recommended: "Recommended",
    macDetected: "Mac detected — this is the recommended download.",
    windowsDetected: "Windows detected — this is the recommended download.",
    choosePlatform: "Choose the computer where you want to install ultrspeak.",
    navAria: "Footer navigation",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    copyright: "© {year} ultrspeak. All rights reserved.",
  },
  contact: {
    heading: "Contact",
    intro:
      "Questions, feedback, or trouble with your account? Send us a note and we'll get back to you, usually within a day.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    message: "Message",
    messagePlaceholder: "How can we help?",
    openDraft: "Open email draft",
    recipientLabel: "To",
    subjectLabel: "Subject",
    draftGuidance:
      "This form opens a prepared draft in your email app. Nothing is sent until you review and send it there.",
    emailSubject: "ultrspeak support request",
    draftOpened:
      "Your draft is ready below. We also tried to open it in your email app. This website has not sent your message.",
    fallbackHeading: "Email draft",
    fallbackIntro:
      "If your email app did not open, copy this draft and send it to hello@ultrspeak.com.",
    copyDraft: "Copy draft",
    copySuccess: "Draft copied. Send it to hello@ultrspeak.com.",
    copyError: "Copy did not work. Select the draft and copy it manually.",
    preferEmail: "Prefer email? Reach us directly at",
    refund:
      ". For refunds, email hello@ultrspeak.com within 14 days of purchase from your checkout address.",
  },
  privacy: {
    heading: "Privacy",
    intro:
      "ultrspeak is built so your voice never leaves your computer. This page explains, plainly, what that means for your data.",
    updatedLabel: "Last updated:",
    updated: "July 29, 2026",
    sections: [
      {
        h: "Your voice stays on your device",
        p: [
          "ultrspeak transcribes speech using models that run entirely on your Mac or Windows PC. Audio recordings and the text they produce are processed locally and are never uploaded to us or to any third party. Dictation works the same whether or not you are connected to the internet.",
        ],
      },
      {
        h: "Dictation history",
        p: [
          "Your dictation history is stored locally on your device so you can search and reuse what you have dictated. It never leaves your machine. You can clear it at any time from within the app, and we have no way to access it.",
        ],
      },
      {
        h: "Accounts and purchases",
        p: [
          "Payments are processed by Stripe through Stripe-hosted checkout. Stripe processes your payment details under its own privacy policy; we do not receive your full card number.",
          "We store the account, subscription, entitlement, and billing status information needed to provide Pro access, prevent abuse, manage refunds, and answer support requests.",
        ],
      },
      {
        h: "Diagnostics and analytics",
        p: [
          "ultrspeak does not collect analytics or telemetry by default. If you choose to send a crash report, it describes the technical state of the app at the moment it failed and contains no audio or transcript content.",
        ],
      },
      {
        h: "Changes to this policy",
        p: [
          "If we change how ultrspeak handles your data, we will update this page and the date below. Because transcription is on-device, changes here are rare by design.",
        ],
      },
      {
        h: "Contact",
        p: [
          "Questions about privacy? Email hello@ultrspeak.com and we will get back to you.",
        ],
      },
    ],
  },
  terms: {
    heading: "Terms of Service",
    intro:
      "Plain-language terms for using ultrspeak. By downloading or buying the app, you agree to what follows.",
    updatedLabel: "Last updated:",
    updated: "July 29, 2026",
    sections: [
      {
        h: "Free and Pro access",
        p: [
          "ultrspeak is desktop software for Mac and Windows. The free tier is available at no cost. A paid Pro subscription unlocks unlimited dictation and the full set of writing modes.",
          "Pro access belongs to your personal account and may be used on your own supported devices. Please do not share, resell, or provide access to your account. We may suspend access that is used in a way these terms do not allow.",
        ],
      },
      {
        h: "Acceptable use",
        p: [
          "Use ultrspeak for lawful purposes. Do not attempt to reverse engineer, decompile, or redistribute the app, and do not use it to break the law or to infringe on someone else's rights.",
        ],
      },
      {
        h: "Payments, billing, and refunds",
        p: [
          "Payments are processed securely by Stripe. Your use of Stripe's checkout and billing portal is also subject to Stripe's applicable terms and privacy policy.",
          "Pro renews automatically at the end of each annual billing period until you cancel. You can cancel at any time, and Pro stays active through the period you have already paid for.",
          "Every purchase is covered by a 14-day refund, no questions asked. Email hello@ultrspeak.com within 14 days and we will arrange it.",
        ],
      },
      {
        h: "Your content",
        p: [
          "Anything you dictate is yours. Transcription runs on your device, your audio and transcripts stay there, and we claim no ownership or rights over what you create with ultrspeak.",
        ],
      },
      {
        h: "Warranty and liability",
        p: [
          "ultrspeak is provided as is, without warranties of any kind. We work hard to make it accurate and reliable, but we cannot guarantee it will be free of errors or fit every use.",
          "To the fullest extent the law allows, ultrspeak and its makers are not liable for indirect or consequential damages arising from use of the app. Where liability cannot be excluded, it is limited to the amount you paid for the service.",
        ],
      },
      {
        h: "Changes to these terms",
        p: [
          "We may update these terms as the product changes. When we do, we will revise the date below. Continuing to use ultrspeak after a change means you accept the updated terms.",
        ],
      },
      {
        h: "Contact",
        p: [
          "Questions about these terms? Email hello@ultrspeak.com and we will get back to you.",
        ],
      },
    ],
  },
  success: {
    eyebrow: "Checkout complete",
    heading: "Welcome to ultrspeak.",
    intro:
      "We are confirming your subscription. Your Pro access is attached to your ultrspeak account automatically.",
    steps: [
      "Return to ultrspeak and open Settings, then Account.",
      "Sign in with the same account you used at checkout.",
      "Refresh your account status if Pro does not appear immediately.",
    ],
    helpBefore: "Need help? Email",
    helpAfter:
      "from the address on your account and we'll take a look.",
    download: "Download the app",
  },
} as const;

type TranslationShape<T> = T extends string
  ? string
  : T extends readonly unknown[]
    ? { readonly [K in keyof T]: TranslationShape<T[K]> }
    : T extends object
      ? { readonly [K in keyof T]: TranslationShape<T[K]> }
      : T;

export type Translation = TranslationShape<typeof en>;

export const zhTW: Translation = {
  meta: {
    home: {
      title: "ultrspeak — 私密離線語音輸入，Mac 與 Windows 適用",
      description:
        "適用於 Mac 與 Windows 的裝置端語音輸入。支援英文與華語，離線也能將語音整理成清楚文字，直接輸入游標所在位置。",
    },
    contact: {
      title: "聯絡我們 — ultrspeak",
      description: "與 ultrspeak 團隊聯絡。",
    },
    success: {
      title: "結帳完成 — ultrspeak",
      description: "返回 ultrspeak 使用你的 Pro 訂閱。",
    },
    privacy: {
      title: "隱私權 — ultrspeak",
      description: "了解 ultrspeak 如何處理你的資料。",
    },
    terms: {
      title: "服務條款 — ultrspeak",
      description: "適用於你使用 ultrspeak 的條款。",
    },
  },
  nav: {
    primaryAria: "主要導覽",
    features: "功能特色",
    how: "使用方式",
    pricing: "價格",
    get: "取得 ultrspeak",
    language: "選擇語言",
  },
  hero: {
    eyebrow: "Mac 與 Windows 的私密離線語音輸入",
    title: "用說的，",
    titleAccent: "寫得更清楚。",
    body: "按住一個鍵，直接說出想法。ultrspeak 會在你的裝置上整理成清楚、格式完整的文字，直接輸入游標所在位置。語音不用上傳，沒有網路也能使用。",
    download: "下載",
    seeItWork: "看看如何運作",
    imageAlt: "ultrspeak 應用程式主畫面",
  },
  modes: {
    eyebrow: "書寫模式",
    title: "同一個聲音，切換各種語氣。",
    intro: "選擇模式，ultrspeak 就能把同一段隨口說出的想法，整理成當下需要的語氣。",
    labels: ["正式", "隨意", "電子郵件", "提示詞"],
    youSaid: "你說",
    said: "嗯，有空的時候可以把上季報告傳給我嗎？謝謝",
    writes: "ultrspeak 寫成",
    formal: "方便時，能否請你將上季報告傳給我？謝謝。",
    casual: "嘿，有空的時候把上季報告傳給我好嗎？謝啦！",
    emailSubject: "主旨：上季報告",
    emailBody: "你好：\n方便時，能否請你將上季報告傳給我？不急，謝謝你的協助。",
    prompt: "讀取上季報告並摘要主要指標，標示變動幅度超過 10% 的項目。",
    note: "標點、大小寫與語氣，全都處理妥當。",
  },
  features: {
    eyebrow: "為什麼選擇 ultrspeak",
    title: "就像把腦中的想法直接說出來。",
    cards: [
      {
        title: "聲音不會離開你的電腦",
        body: "轉錄由本機模型在你的裝置上完成。不使用雲端處理，也不上傳音訊或文字。無論在飛機上、會議中或任何地方，ultrspeak 都能運作，你的聲音始終屬於你。",
      },
      {
        title: "按住按鍵，不打斷思緒",
        body: "一組全域快速鍵可在常用應用程式的支援文字欄位中使用，整理好的文字會直接出現在游標位置。",
      },
      {
        title: "懂得你的用詞",
        body: "只要教它一次人名、術語和產品名稱，自訂詞彙每次都能正確呈現。",
      },
      {
        title: "英文與中文",
        body: "英文與中文各有專用辨識路徑，並能自動回退，讓中英混合語音依然準確。",
      },
      {
        title: "說過的內容都不會遺失",
        body: "每次語音輸入都儲存在本機並可搜尋。你可以尋找、複製或重複使用，也能隨時清除。",
      },
    ],
    bytesSent: "已傳送 0 位元組",
    historyAlt: "ultrspeak 應用程式中可搜尋的歷史語音輸入",
  },
  integrations: {
    eyebrow: "融入日常工作流程",
    title: "在常用的應用程式裡，直接用說的。",
    intro: "ultrspeak 可透過一組快速鍵在多款常用的桌面應用程式中使用。不必設定整合、不必安裝外掛，也不用複製貼上。",
    apps: [
      ["Slack", "郵件", "備忘錄", "Cursor", "VS Code", "Notion"],
      ["訊息", "Safari", "Chrome", "Obsidian", "Linear"],
      ["Gmail", "Figma", "終端機", "文件", "Discord"],
    ],
    hold: "按住空白鍵開始語音輸入",
  },
  comparison: {
    eyebrow: "本機與雲端",
    title: "你的聲音不需要伺服器。",
    intro: "ultrspeak 用你電腦上的模型進行轉錄。與把音訊送到別處處理的語音輸入相比，這帶來幾個不同：",
    columnsUs: "ultrspeak",
    columnsCloud: "雲端語音輸入",
    rows: [
      { label: "音訊去向", us: "不會離開你的裝置", cloud: "上傳到伺服器處理" },
      { label: "離線使用", us: "完整支援", cloud: "不支援" },
      { label: "每週免費字詞", us: "8,000 字詞，無須帳戶", cloud: "試用額度，須註冊帳戶" },
    ],
    note: "此比較描述典型的雲端語音輸入服務，並非針對特定產品。",
  },
  how: {
    title: "三秒鐘，從開口到完成。",
    live: "即時逐字稿預覽",
    steps: [
      {
        title: "按住快速鍵",
        body: "畫面會出現低調的指示器。在支援的應用程式中，ultrspeak 會開始聆聽，不必切換視窗。",
        alt: "ultrspeak 聆聽指示器與即時波形",
      },
      {
        title: "觀看即時轉錄",
        body: "說話時，文字會出現在指示器中。已確認的文字保持清晰，最新片段則會顯示為處理中。",
        alt: "ultrspeak 錄音時串流文字的即時逐字稿預覽",
      },
      {
        title: "放開按鍵，文字已輸入",
        body: "整理好標點的文字立即出現在游標處，讓你不中斷思路繼續工作。",
        alt: "ultrspeak 已完成輸入的指示器",
      },
    ],
  },
  pricing: {
    eyebrow: "價格",
    title: "價格透明，沒有綁約。",
    intro: "先免費開始，需要無限語音輸入時，再從帳戶升級。你可以隨時取消。",
    free: "免費版",
    freeIntro: "不用帳戶即可試用語音輸入。",
    forever: "永久免費",
    downloadFree: "免費下載",
    freeFeatures: ["裝置端轉錄", "英文與中文", "全域按住說話快速鍵", "每週可免費輸入 8,000 字詞"],
    proIntro: "為每天大量使用的人提供無限額度。",
    perYear: "美元／年",
    monthly: "約每月 1.62 美元，按年計費",
    upgrade: "登入並升級",
    accountPortalNote: "你將前往 accounts.ultrclick.com 登入——那是 ultrspeak 的帳戶入口網站。",
    paidFeatures: ["免費版全部功能", "無限語音輸入", "所有書寫模式", "自訂詞彙", "可搜尋的歷史記錄"],
    checkout: "安全結帳由 Stripe 代管。你可以從帳戶管理或取消訂閱。",
  },
  faq: {
    title: "常見問題。",
    items: [
      {
        q: "我的聲音會傳到伺服器嗎？",
        a: "不會。轉錄完全由裝置端模型在你的電腦上進行。ultrspeak 可離線使用，絕不會上傳你的音訊或文字。",
      },
      {
        q: "如何啟用授權？",
        a: "登入 ultrspeak 帳戶並選擇升級至 Pro。結帳由 Stripe 安全代管，Pro 權限會連結到你在應用程式中使用的同一個帳戶。",
      },
      {
        q: "支援哪些裝置？",
        a: "ultrspeak 支援搭載 Apple 晶片（M1 或更新版本）、執行 macOS 13 或更新版本的 Mac，以及 Windows 11。裝置端模型在較新的硬體上表現最佳。",
      },
      {
        q: "它能處理哪些語言？",
        a: "目前支援英文與華語，各有專用辨識路徑，對中英混合語音也能自然回退處理。",
      },
      {
        q: "可以退款嗎？",
        a: "可以，購買後 14 天內無條件退款。請使用帳戶的電子郵件地址聯絡我們，我們會協助處理。付款由 Stripe 安全處理。",
      },
      {
        q: "可以在 App Store 下載嗎？",
        a: "ultrspeak 採直接銷售，才能不受沙盒限制地執行裝置端模型。你可直接從我們這裡下載已簽署的 Mac 或 Windows 應用程式。",
      },
    ],
  },
  footer: {
    title: "聲音留在你的裝置，",
    titleAccent: "文字送到你打字的地方。",
    intro: "Mac 與 Windows 皆可免費使用，支援英文與華語語音輸入。",
    requirements: "Mac：Apple M1 或更新版本、macOS 13 以上 · Windows 11",
    downloadMac: "下載 Mac 版",
    downloadWindows: "下載 Windows 版",
    recommended: "推薦",
    macDetected: "偵測到 Mac，建議下載此版本。",
    windowsDetected: "偵測到 Windows，建議下載此版本。",
    choosePlatform: "選擇要安裝 ultrspeak 的電腦。",
    navAria: "頁尾導覽",
    contact: "聯絡我們",
    privacy: "隱私權",
    terms: "條款",
    copyright: "© {year} ultrspeak。保留一切權利。",
  },
  contact: {
    heading: "聯絡我們",
    intro: "有問題、建議，或帳戶使用上遇到困難嗎？傳訊息給我們，我們通常會在一天內回覆。",
    name: "姓名",
    namePlaceholder: "你的姓名",
    email: "電子郵件",
    emailPlaceholder: "you@example.com",
    message: "訊息",
    messagePlaceholder: "我們能如何協助你？",
    openDraft: "開啟電子郵件草稿",
    recipientLabel: "收件者",
    subjectLabel: "主旨",
    draftGuidance: "此表單會在你的郵件應用程式中開啟預先填好的草稿。請確認內容並在郵件應用程式中送出；網站不會自行傳送訊息。",
    emailSubject: "ultrspeak 客服請求",
    draftOpened: "草稿已在下方準備完成，網站也已嘗試在你的郵件應用程式中開啟。此網站尚未傳送你的訊息。",
    fallbackHeading: "電子郵件草稿",
    fallbackIntro: "如果郵件應用程式沒有開啟，請複製這份草稿並寄至 hello@ultrspeak.com。",
    copyDraft: "複製草稿",
    copySuccess: "草稿已複製。請寄至 hello@ultrspeak.com。",
    copyError: "無法自動複製。請選取草稿並手動複製。",
    preferEmail: "偏好使用電子郵件？請直接寄信至",
    refund:
      "。如需退款，請於購買後 14 天內寄信至 hello@ultrspeak.com，並使用結帳時的電子郵件地址。",
  },
  privacy: {
    heading: "隱私權",
    intro: "ultrspeak 的設計讓你的聲音永遠不會離開電腦。本頁以清楚易懂的方式說明這對你的資料代表什麼。",
    updatedLabel: "最後更新：",
    updated: "2026 年 7 月 29 日",
    sections: [
      {
        h: "你的聲音留在裝置上",
        p: ["ultrspeak 使用完全在 Mac 或 Windows 電腦上執行的模型轉錄語音。錄音及產生的文字都在本機處理，絕不會上傳給我們或任何第三方。無論是否連上網際網路，語音輸入的運作方式都相同。"],
      },
      {
        h: "語音輸入歷史記錄",
        p: ["語音輸入歷史記錄儲存在你的裝置上，方便搜尋及重複使用。資料不會離開你的電腦。你可以隨時在應用程式內清除記錄，而我們無法存取這些內容。"],
      },
      {
        h: "帳戶與購買",
        p: [
          "付款透過 Stripe 代管的結帳頁面由 Stripe 處理。Stripe 依其隱私權政策處理你的付款資料；我們不會收到完整的信用卡號碼。",
          "我們會儲存提供 Pro 權限、防止濫用、管理退款及回應支援請求所需的帳戶、訂閱、權益及帳單狀態資訊。",
        ],
      },
      {
        h: "診斷與分析",
        p: ["ultrspeak 預設不收集分析資料或遙測資料。如果你選擇傳送當機報告，報告只會描述應用程式故障當下的技術狀態，不包含任何音訊或逐字稿內容。"],
      },
      {
        h: "本政策的變更",
        p: ["如果 ultrspeak 處理資料的方式有變更，我們會更新本頁及下方日期。由於轉錄在裝置端進行，這類變更在設計上很少發生。"],
      },
      {
        h: "聯絡方式",
        p: ["對隱私權有疑問嗎？請寄信至 hello@ultrspeak.com，我們會回覆你。"],
      },
    ],
  },
  terms: {
    heading: "服務條款",
    intro: "以下是使用 ultrspeak 的白話條款。下載或購買本應用程式，即表示你同意以下內容。",
    updatedLabel: "最後更新：",
    updated: "2026 年 7 月 29 日",
    sections: [
      {
        h: "免費版與 Pro 權限",
        p: [
          "ultrspeak 是適用於 Mac 與 Windows 的桌面軟體。免費版無須付費。付費 Pro 訂閱可解鎖無限語音輸入及完整書寫模式。",
          "Pro 權限屬於你的個人帳戶，可在你自己的受支援裝置上使用。請勿分享、轉售帳戶或讓他人使用。我們可能暫停不符合本條款之使用方式的帳戶權限。",
        ],
      },
      {
        h: "可接受的使用方式",
        p: ["請將 ultrspeak 用於合法用途。請勿嘗試反向工程、反編譯或重新散布本應用程式，也不得使用本應用程式違法或侵害他人權利。"],
      },
      {
        h: "付款、計費與退款",
        p: [
          "付款由 Stripe 安全處理。你使用 Stripe 的結帳與帳單入口網站時，也須遵守 Stripe 適用的條款及隱私權政策。",
          "Pro 會在每個年度計費週期結束時自動續訂，直到你取消為止。你可以隨時取消，而 Pro 權限會持續到已付款期間結束。",
          "每筆購買皆享有 14 天無條件退款。請在 14 天內寄信至 hello@ultrspeak.com，我們會協助辦理。",
        ],
      },
      {
        h: "你的內容",
        p: ["你所輸入的任何內容都屬於你。轉錄在裝置上執行，音訊和逐字稿留在裝置中；對於你使用 ultrspeak 建立的內容，我們不主張任何所有權或權利。"],
      },
      {
        h: "保固與責任",
        p: [
          "ultrspeak 依現況提供，不附帶任何形式的保固。我們努力確保其準確可靠，但無法保證完全沒有錯誤或適合所有用途。",
          "在法律允許的最大範圍內，ultrspeak 及其製作者不對使用本應用程式所產生的間接或衍生損害負責。若責任依法不得排除，責任上限為你支付的服務費用。",
        ],
      },
      {
        h: "本條款的變更",
        p: ["我們可能隨產品變更而更新本條款，並在更新時修改下方日期。條款變更後繼續使用 ultrspeak，即表示你接受更新後的條款。"],
      },
      {
        h: "聯絡方式",
        p: ["對本條款有疑問嗎？請寄信至 hello@ultrspeak.com，我們會回覆你。"],
      },
    ],
  },
  success: {
    eyebrow: "結帳完成",
    heading: "歡迎使用 ultrspeak。",
    intro: "我們正在確認你的訂閱。Pro 權限會自動連結至你的 ultrspeak 帳戶。",
    steps: [
      "返回 ultrspeak，開啟「設定」，然後選擇「帳戶」。",
      "使用結帳時的同一個帳戶登入。",
      "若 Pro 沒有立即顯示，請重新整理帳戶狀態。",
    ],
    helpBefore: "需要協助嗎？請使用帳戶的電子郵件地址寄信至",
    helpAfter: "，我們會為你查看。",
    download: "下載應用程式",
  },
};

export const zhCN: Translation = {
  meta: {
    home: {
      title: "ultrspeak — 私密离线语音输入，Mac 与 Windows 适用",
      description:
        "适用于 Mac 与 Windows 的本地语音输入。支持英语和普通话，离线也能将语音整理成清晰文字，直接输入光标所在位置。",
    },
    contact: { title: "联系我们 — ultrspeak", description: "联系 ultrspeak 团队。" },
    success: { title: "结账完成 — ultrspeak", description: "返回 ultrspeak 使用你的 Pro 订阅。" },
    privacy: { title: "隐私 — ultrspeak", description: "了解 ultrspeak 如何处理你的数据。" },
    terms: { title: "服务条款 — ultrspeak", description: "适用于你使用 ultrspeak 的条款。" },
  },
  nav: {
    primaryAria: "主导航",
    features: "功能特色",
    how: "使用方式",
    pricing: "价格",
    get: "获取 ultrspeak",
    language: "选择语言",
  },
  hero: {
    eyebrow: "Mac 与 Windows 的私密离线语音输入",
    title: "直接说，",
    titleAccent: "写得更清楚。",
    body: "按住一个键，直接说出想法。ultrspeak 会在你的设备上整理成清晰、格式完整的文字，直接输入光标所在位置。语音无需上传，没有网络也能使用。",
    download: "下载",
    seeItWork: "看看如何工作",
    imageAlt: "ultrspeak 应用程序主界面",
  },
  modes: {
    eyebrow: "写作模式",
    title: "同一个声音，切换各种语气。",
    intro: "选择模式，ultrspeak 就能把同一段随口说出的想法整理成当下需要的语气。",
    labels: ["正式", "随意", "电子邮件", "提示词"],
    youSaid: "你说",
    said: "嗯，有空的时候可以把上季度报告发给我吗？谢谢",
    writes: "ultrspeak 写成",
    formal: "方便时，能否请你把上季度报告发给我？谢谢。",
    casual: "嗨，有空的时候把上季度报告发给我好吗？谢啦！",
    emailSubject: "主题：上季度报告",
    emailBody: "你好：\n方便时，能否请你把上季度报告发给我？不着急，谢谢你的帮助。",
    prompt: "读取上季度报告并总结关键指标，标出变动幅度超过 10% 的项目。",
    note: "标点、大小写和语气，全都处理妥当。",
  },
  features: {
    eyebrow: "为什么选择 ultrspeak",
    title: "就像把脑中的想法直接说出来。",
    cards: [
      { title: "声音不会离开你的电脑", body: "转录由本地模型在你的设备上完成。不使用云端处理，也不上传音频或文字。无论在飞机上、会议中还是任何地方，ultrspeak 都能工作，你的声音始终属于你。" },
      { title: "按住按键，不打断思路", body: "一组全局快捷键可在常用应用程序支持的文本框中使用，整理好的文字会直接出现在光标位置。" },
      { title: "懂得你的用词", body: "只要教它一次人名、术语和产品名称，自定义词汇每次都能正确呈现。" },
      { title: "英文与中文", body: "英文与中文各有专用识别路径，并能自动回退，让中英混合语音依然准确。" },
      { title: "说过的内容都不会丢失", body: "每次语音输入都保存在本地并可搜索。你可以查找、复制或重复使用，也能随时清除。" },
    ],
    bytesSent: "已发送 0 字节",
    historyAlt: "ultrspeak 应用程序中可搜索的历史语音输入",
  },
  integrations: {
    eyebrow: "融入日常工作流程",
    title: "在常用的应用程序里，直接说就行。",
    intro: "ultrspeak 可通过一组快捷键在多款常用桌面应用程序中使用。无需设置集成、无需安装插件，也不用复制粘贴。",
    apps: [
      ["Slack", "邮件", "备忘录", "Cursor", "VS Code", "Notion"],
      ["信息", "Safari", "Chrome", "Obsidian", "Linear"],
      ["Gmail", "Figma", "终端", "文档", "Discord"],
    ],
    hold: "按住空格键开始语音输入",
  },
  comparison: {
    eyebrow: "本地与云端",
    title: "你的声音不需要服务器。",
    intro: "ultrspeak 用你电脑上的模型完成转录。与把音频送到别处处理的语音输入相比，这带来几个不同：",
    columnsUs: "ultrspeak",
    columnsCloud: "云端语音输入",
    rows: [
      { label: "音频去向", us: "不会离开你的设备", cloud: "上传到服务器处理" },
      { label: "离线使用", us: "完整支持", cloud: "不支持" },
      { label: "每周免费字词", us: "8,000 字词，无需账户", cloud: "试用额度，需注册账户" },
    ],
    note: "此比较描述典型的云端语音输入服务，并非针对特定产品。",
  },
  how: {
    title: "三秒钟，从开口到完成。",
    live: "实时转录预览",
    steps: [
      { title: "按住快捷键", body: "界面会出现一个低调的指示器。在支持的应用程序中，ultrspeak 会开始聆听，无需切换窗口。", alt: "ultrspeak 聆听指示器和实时波形" },
      { title: "观看实时转录", body: "说话时，文字会出现在指示器中。已确认的文字保持清晰，最新片段则显示为处理中。", alt: "ultrspeak 录音时流式显示文字的实时转录预览" },
      { title: "松开按键，文字已输入", body: "整理好标点的文字立即出现在光标处，让你不中断思路继续工作。", alt: "ultrspeak 已完成输入的指示器" },
    ],
  },
  pricing: {
    eyebrow: "价格",
    title: "价格透明，没有绑定。",
    intro: "先免费开始，需要无限语音输入时再从账户升级。你可以随时取消。",
    free: "免费版",
    freeIntro: "无需账户即可试用语音输入。",
    forever: "永久免费",
    downloadFree: "免费下载",
    freeFeatures: ["设备端转录", "英文与中文", "全局按住说话快捷键", "每周可免费输入 8,000 字词"],
    proIntro: "为每天大量使用的人提供无限额度。",
    perYear: "美元／年",
    monthly: "约每月 1.62 美元，按年计费",
    upgrade: "登录并升级",
    accountPortalNote: "你将前往 accounts.ultrclick.com 登录——那是 ultrspeak 的账户门户。",
    paidFeatures: ["免费版全部功能", "无限语音输入", "所有写作模式", "自定义词汇", "可搜索的历史记录"],
    checkout: "安全结账由 Stripe 托管。你可以从账户管理或取消订阅。",
  },
  faq: {
    title: "常见问题。",
    items: [
      { q: "我的声音会发送到服务器吗？", a: "不会。转录完全由设备端模型在你的电脑上进行。ultrspeak 可离线使用，绝不会上传你的音频或文字。" },
      { q: "如何激活授权？", a: "登录 ultrspeak 账户并选择升级至 Pro。结账由 Stripe 安全托管，Pro 权限会关联到你在应用程序中使用的同一个账户。" },
      { q: "支持哪些设备？", a: "ultrspeak 支持搭载 Apple 芯片（M1 或更新版本）、运行 macOS 13 或更新版本的 Mac，以及 Windows 11。设备端模型在较新的硬件上表现最佳。" },
      { q: "它能处理哪些语言？", a: "目前支持英文与普通话，各有专用识别路径，对中英混合语音也能自然回退处理。" },
      { q: "可以退款吗？", a: "可以，购买后 14 天内无条件退款。请使用账户的电子邮件地址联系我们，我们会帮助处理。付款由 Stripe 安全处理。" },
      { q: "可以在 App Store 下载吗？", a: "ultrspeak 采用直接销售，才能不受沙盒限制地运行设备端模型。你可以直接从我们这里下载已签名的 Mac 或 Windows 应用程序。" },
    ],
  },
  footer: {
    title: "声音留在你的设备，",
    titleAccent: "文字送到你打字的地方。",
    intro: "Mac 与 Windows 均可免费使用，支持英语和普通话语音输入。",
    requirements: "Mac：Apple M1 或更新版本、macOS 13 及以上 · Windows 11",
    downloadMac: "下载 Mac 版",
    downloadWindows: "下载 Windows 版",
    recommended: "推荐",
    macDetected: "检测到 Mac，建议下载此版本。",
    windowsDetected: "检测到 Windows，建议下载此版本。",
    choosePlatform: "选择要安装 ultrspeak 的电脑。",
    navAria: "页脚导航",
    contact: "联系我们",
    privacy: "隐私",
    terms: "条款",
    copyright: "© {year} ultrspeak。保留所有权利。",
  },
  contact: {
    heading: "联系我们",
    intro: "有问题、建议，或账户使用上遇到困难吗？给我们留言，我们通常会在一天内回复。",
    name: "姓名",
    namePlaceholder: "你的姓名",
    email: "电子邮件",
    emailPlaceholder: "you@example.com",
    message: "留言",
    messagePlaceholder: "我们能如何帮助你？",
    openDraft: "打开邮件草稿",
    recipientLabel: "收件人",
    subjectLabel: "主题",
    draftGuidance: "此表单会在你的邮件应用中打开预先填写的草稿。请确认内容并在邮件应用中发送；网站不会自行发送留言。",
    emailSubject: "ultrspeak 客服请求",
    draftOpened: "草稿已在下方准备好，网站也已尝试在你的邮件应用中打开。此网站尚未发送你的留言。",
    fallbackHeading: "邮件草稿",
    fallbackIntro: "如果邮件应用没有打开，请复制这份草稿并发送至 hello@ultrspeak.com。",
    copyDraft: "复制草稿",
    copySuccess: "草稿已复制。请发送至 hello@ultrspeak.com。",
    copyError: "无法自动复制。请选中草稿并手动复制。",
    preferEmail: "更喜欢电子邮件？请直接发送至",
    refund: "。如需退款，请在购买后 14 天内发送邮件至 hello@ultrspeak.com，并使用结账时的电子邮件地址。",
  },
  privacy: {
    heading: "隐私",
    intro: "ultrspeak 的设计让你的声音永远不会离开电脑。本页用简单明确的方式说明这对你的数据意味着什么。",
    updatedLabel: "最后更新：",
    updated: "2026 年 7 月 29 日",
    sections: [
      { h: "你的声音留在设备上", p: ["ultrspeak 使用完全在 Mac 或 Windows 电脑上运行的模型转录语音。录音和生成的文字都在本地处理，绝不会上传给我们或任何第三方。无论是否连接互联网，语音输入的工作方式都相同。"] },
      { h: "语音输入历史记录", p: ["语音输入历史记录保存在你的设备上，方便搜索和重复使用。数据不会离开你的电脑。你可以随时在应用程序内清除记录，而我们无法访问这些内容。"] },
      { h: "账户与购买", p: ["付款通过 Stripe 托管的结账页面由 Stripe 处理。Stripe 按照其隐私政策处理你的付款信息；我们不会收到完整的银行卡号。", "我们会保存提供 Pro 权限、防止滥用、管理退款和回复支持请求所需的账户、订阅、权益及账单状态信息。"] },
      { h: "诊断与分析", p: ["ultrspeak 默认不收集分析或遥测数据。如果你选择发送崩溃报告，报告只会描述应用程序故障当时的技术状态，不包含任何音频或转录内容。"] },
      { h: "本政策的变更", p: ["如果 ultrspeak 处理数据的方式发生变化，我们会更新本页和下方日期。由于转录在设备端进行，这类变更在设计上很少发生。"] },
      { h: "联系方式", p: ["对隐私有疑问吗？请发送邮件至 hello@ultrspeak.com，我们会回复你。"] },
    ],
  },
  terms: {
    heading: "服务条款",
    intro: "以下是使用 ultrspeak 的通俗条款。下载或购买本应用程序，即表示你同意以下内容。",
    updatedLabel: "最后更新：",
    updated: "2026 年 7 月 29 日",
    sections: [
      { h: "免费版与 Pro 权限", p: ["ultrspeak 是适用于 Mac 与 Windows 的桌面软件。免费版无需付费。付费 Pro 订阅可解锁无限语音输入和完整写作模式。", "Pro 权限属于你的个人账户，可在你自己的受支持设备上使用。请勿分享、转售账户或让他人使用。对于不符合本条款的使用方式，我们可能暂停账户权限。"] },
      { h: "可接受的使用方式", p: ["请将 ultrspeak 用于合法用途。请勿尝试逆向工程、反编译或重新分发本应用程序，也不得使用本应用程序违法或侵犯他人权利。"] },
      { h: "付款、计费与退款", p: ["付款由 Stripe 安全处理。你使用 Stripe 的结账与账单门户时，也须遵守 Stripe 适用的条款和隐私政策。", "Pro 会在每个年度计费周期结束时自动续订，直到你取消为止。你可以随时取消，而 Pro 权限会持续到已付款期间结束。", "每笔购买均享有 14 天无条件退款。请在 14 天内发送邮件至 hello@ultrspeak.com，我们会帮助办理。"] },
      { h: "你的内容", p: ["你输入的任何内容都属于你。转录在设备上运行，音频和转录文本保留在设备中；对于你使用 ultrspeak 创建的内容，我们不主张任何所有权或权利。"] },
      { h: "担保与责任", p: ["ultrspeak 按现状提供，不附带任何形式的担保。我们努力确保其准确可靠，但无法保证完全没有错误或适合所有用途。", "在法律允许的最大范围内，ultrspeak 及其制作者不对使用本应用程序产生的间接或后果性损害负责。若责任依法不能排除，责任上限为你支付的服务费用。"] },
      { h: "本条款的变更", p: ["我们可能随产品变化而更新本条款，并在更新时修改下方日期。条款变更后继续使用 ultrspeak，即表示你接受更新后的条款。"] },
      { h: "联系方式", p: ["对本条款有疑问吗？请发送邮件至 hello@ultrspeak.com，我们会回复你。"] },
    ],
  },
  success: {
    eyebrow: "结账完成",
    heading: "欢迎使用 ultrspeak。",
    intro: "我们正在确认你的订阅。Pro 权限会自动关联到你的 ultrspeak 账户。",
    steps: ["返回 ultrspeak，打开“设置”，然后选择“账户”。", "使用结账时的同一个账户登录。", "如果 Pro 没有立即显示，请刷新账户状态。"],
    helpBefore: "需要帮助吗？请使用账户的电子邮件地址发送至",
    helpAfter: "，我们会为你查看。",
    download: "下载应用程序",
  },
};

export const ja: Translation = {
  meta: {
    home: {
      title: "ultrspeak — プライベートでオフラインの音声入力、Mac・Windows 対応",
      description:
        "Mac・Windows向けのオンデバイス音声入力。英語と中国語（普通話）の音声をカーソル位置で整った文章に。オフラインでも使えます。",
    },
    contact: { title: "お問い合わせ — ultrspeak", description: "ultrspeak チームへのお問い合わせはこちら。" },
    success: { title: "決済完了 — ultrspeak", description: "ultrspeak に戻って Pro サブスクリプションをご利用ください。" },
    privacy: { title: "プライバシー — ultrspeak", description: "ultrspeak におけるデータの取り扱いについて。" },
    terms: { title: "利用規約 — ultrspeak", description: "ultrspeak のご利用に適用される規約です。" },
  },
  nav: {
    primaryAria: "メインナビゲーション",
    features: "特長",
    how: "使い方",
    pricing: "料金",
    get: "ultrspeak を入手",
    language: "言語を選択",
  },
  hero: {
    eyebrow: "Mac・Windows 向けプライベートなオフライン音声入力",
    title: "話すだけで、",
    titleAccent: "伝わる文章に。",
    body: "キーを1つ押しながら話すだけ。ultrspeak が音声を端末上で整った文章に変え、使っているアプリへ直接入力します。音声のアップロードは不要。オフラインでも使えます。",
    download: "ダウンロード",
    seeItWork: "動作を見る",
    imageAlt: "ultrspeak アプリのホーム画面",
  },
  modes: {
    eyebrow: "モード",
    title: "同じ声を、場面に合う文体へ。",
    intro: "モードを選ぶと、ultrspeak が同じ話し言葉を、その場にふさわしいトーンへ整えます。",
    labels: ["フォーマル", "カジュアル", "メール", "プロンプト"],
    youSaid: "話した内容",
    said: "um so can you send me last quarter's report whenever you get a sec, thanks",
    writes: "ultrspeak の文章",
    formal: "Could you please send me last quarter's report when you have a moment? Thank you.",
    casual: "hey, could you send over last quarter's report when you get a sec? thanks!",
    emailSubject: "Subject: Last quarter's report",
    emailBody: "Hi,\nWhen you have a moment, could you send me last quarter's report? No rush. Thanks for your help.",
    prompt: "Pull last quarter's report and summarize the key metrics, flagging anything that moved more than 10%.",
    note: "句読点、大文字・小文字、トーンまで自動で整えます。",
  },
  features: {
    eyebrow: "ultrspeak が選ばれる理由",
    title: "考えたまま話すだけの心地よさ。",
    cards: [
      { title: "声はコンピューターの外へ出ません", body: "ローカルモデルにより、お使いのデバイス上で処理します。クラウド処理は行わず、音声や文章をアップロードしません。飛行機でも会議でもどこでも使え、声はずっとあなたのものです。" },
      { title: "キー1つで、流れを止めない", body: "1つのグローバルショートカットが、普段使うアプリの対応テキスト欄で動作します。整った文章が現在のカーソル位置に入ります。" },
      { title: "あなたの言葉を覚えます", body: "人名、専門用語、製品名を一度登録するだけ。カスタム語彙が毎回正しく入力されます。" },
      { title: "英語と中国語", body: "英語と中国語には専用の認識経路があり、言語が混ざった音声も自動フォールバックで正確に処理します。" },
      { title: "話した内容を見失いません", body: "すべての音声入力はローカルに保存され、検索できます。検索、コピー、再利用ができ、いつでも消去できます。" },
    ],
    bytesSent: "送信 0 バイト",
    historyAlt: "過去の音声入力を検索できる ultrspeak アプリの履歴画面",
  },
  integrations: {
    eyebrow: "いつもの作業にそのまま",
    title: "普段使うアプリで、声から文章へ。",
    intro: "ultrspeak は、多くの一般的なデスクトップアプリでキー1つですぐ使えます。連携設定もプラグインも、コピー＆ペーストも不要です。",
    apps: [
      ["Slack", "メール", "メモ", "Cursor", "VS Code", "Notion"],
      ["メッセージ", "Safari", "Chrome", "Obsidian", "Linear"],
      ["Gmail", "Figma", "ターミナル", "ドキュメント", "Discord"],
    ],
    hold: "Space を押して音声入力",
  },
  comparison: {
    eyebrow: "ローカルとクラウド",
    title: "声にサーバーは要りません。",
    intro:
      "ultrspeak はお使いのマシン上のモデルで文字起こしします。音声を外部に送るクラウド音声入力との違いです：",
    columnsUs: "ultrspeak",
    columnsCloud: "クラウド音声入力",
    rows: [
      { label: "音声の行き先", us: "デバイスの外へ出ません", cloud: "サーバーへアップロード" },
      { label: "オフライン対応", us: "完全対応", cloud: "非対応" },
      { label: "毎週の無料文字数", us: "8,000語・アカウント不要", cloud: "トライアル枠・アカウント必須" },
    ],
    note: "この比較は一般的なクラウド音声入力サービスを念頭にした説明で、特定製品への言及ではありません。",
  },
  how: {
    title: "話し始めて3秒で完了。",
    live: "リアルタイム文字起こし",
    steps: [
      { title: "ショートカットを押し続ける", body: "控えめなインジケーターが表示されます。対応しているアプリなら、ウィンドウを切り替えずに ultrspeak が聞き取りを始めます。", alt: "ライブ波形を表示する ultrspeak の聞き取りインジケーター" },
      { title: "リアルタイムで確認", body: "話した言葉がインジケーターに表示されます。確定した文字は鮮明に保たれ、最新のフレーズは処理中と分かる表示になります。", alt: "録音中の言葉を表示する ultrspeak のリアルタイム文字起こし" },
      { title: "キーを離せば入力完了", body: "句読点まで整った文章がカーソル位置にすぐ入ります。流れを止めずに作業を続けられます。", alt: "入力完了を示す ultrspeak のインジケーター" },
    ],
  },
  pricing: {
    eyebrow: "料金",
    title: "明快な料金。縛りなし。",
    intro: "まずは無料で。音声入力を無制限に使いたくなったら、アカウントからアップグレードできます。いつでも解約可能です。",
    free: "無料",
    freeIntro: "アカウント不要で音声入力を体験。",
    forever: "ずっと無料",
    downloadFree: "無料でダウンロード",
    freeFeatures: ["オンデバイス文字起こし", "英語・中国語", "グローバル長押しショートカット", "週8,000語まで無料"],
    proIntro: "毎日使う方に、無制限で。",
    perYear: "USD／年",
    monthly: "月額換算 約1.62ドル、年払い",
    upgrade: "ログインしてアップグレード",
    accountPortalNote:
      "ログインページ（accounts.ultrclick.com）は ultrspeak のアカウントポータルです。",
    paidFeatures: ["無料版の全機能", "無制限の音声入力", "すべての書き方モード", "カスタム語彙", "検索できる履歴"],
    checkout: "安全な決済は Stripe がホストします。サブスクリプションの管理・解約はアカウントから行えます。",
  },
  faq: {
    title: "よくあるご質問。",
    items: [
      { q: "音声はサーバーに送信されますか？", a: "いいえ。文字起こしはオンデバイスモデルにより、すべてお使いのコンピューター上で行われます。ultrspeak はオフラインで動作し、音声や文章をアップロードしません。" },
      { q: "ライセンスを有効にするには？", a: "ultrspeak アカウントにログインして「Pro にアップグレード」を選択します。決済は Stripe が安全にホストし、Pro の利用権はアプリで使う同じアカウントに紐づきます。" },
      { q: "対応デバイスは？", a: "ultrspeak は Apple シリコン（M1以降）搭載で macOS 13以降の Mac と、Windows 11 に対応しています。オンデバイスモデルは新しいハードウェアほど快適に動作します。" },
      { q: "対応言語は？", a: "現在は英語と中国語に対応し、それぞれ専用の認識経路を備えています。言語が混ざった音声も自然にフォールバック処理します。" },
      { q: "返金はできますか？", a: "はい。購入後14日以内なら理由を問わず返金します。アカウントのメールアドレスからご連絡ください。支払いは Stripe が安全に処理します。" },
      { q: "App Store で入手できますか？", a: "ultrspeak は、サンドボックスの制限なくオンデバイスモデルを動かせるよう直接販売しています。署名済みの Mac・Windows アプリを当サイトからダウンロードできます。" },
    ],
  },
  footer: {
    title: "音声は端末の中に、",
    titleAccent: "文章はいつも入力する場所へ。",
    intro: "Mac・Windows で無料で始められます。音声入力は英語・中国語（普通話）に対応。",
    requirements: "Mac：Apple M1 以降・macOS 13 以上 ／ Windows 11",
    downloadMac: "Mac 版をダウンロード",
    downloadWindows: "Windows 版をダウンロード",
    recommended: "おすすめ",
    macDetected: "Mac を検出しました。このダウンロードがおすすめです。",
    windowsDetected: "Windows を検出しました。このダウンロードがおすすめです。",
    choosePlatform: "ultrspeak をインストールするパソコンを選択してください。",
    navAria: "フッターナビゲーション",
    contact: "お問い合わせ",
    privacy: "プライバシー",
    terms: "利用規約",
    copyright: "© {year} ultrspeak. すべての権利を保有します。",
  },
  contact: {
    heading: "お問い合わせ",
    intro: "ご質問、ご意見、アカウントのトラブルなどがありましたらお知らせください。通常1日以内に返信します。",
    name: "お名前",
    namePlaceholder: "お名前",
    email: "メールアドレス",
    emailPlaceholder: "you@example.com",
    message: "メッセージ",
    messagePlaceholder: "どのようなご用件ですか？",
    openDraft: "メールの下書きを開く",
    recipientLabel: "宛先",
    subjectLabel: "件名",
    draftGuidance: "このフォームは、入力内容を入れた下書きをメールアプリで開きます。内容を確認し、メールアプリから送信してください。ウェブサイトが自動送信することはありません。",
    emailSubject: "ultrspeak サポートへのお問い合わせ",
    draftOpened: "下書きを下に用意し、メールアプリでも開くよう試みました。このウェブサイトからメッセージは送信されていません。",
    fallbackHeading: "メールの下書き",
    fallbackIntro: "メールアプリが開かない場合は、この下書きをコピーして hello@ultrspeak.com へお送りください。",
    copyDraft: "下書きをコピー",
    copySuccess: "下書きをコピーしました。hello@ultrspeak.com へお送りください。",
    copyError: "コピーできませんでした。下書きを選択して手動でコピーしてください。",
    preferEmail: "メールでのお問い合わせは",
    refund: "まで直接ご連絡ください。返金をご希望の場合は、hello@ultrspeak.com 宛に、購入後14日以内に決済時のメールアドレスからお送りください。",
  },
  privacy: {
    heading: "プライバシー",
    intro: "ultrspeak は、声がコンピューターの外へ出ないよう設計されています。このページでは、それがデータにとって何を意味するかを分かりやすく説明します。",
    updatedLabel: "最終更新：",
    updated: "2026年7月29日",
    sections: [
      { h: "声はデバイス内に留まります", p: ["ultrspeak は、Mac または Windows PC 上で完全に動作するモデルを使って音声を文字起こしします。録音と生成された文章はローカルで処理され、当社や第三者にアップロードされることはありません。インターネット接続の有無にかかわらず同じように動作します。"] },
      { h: "音声入力の履歴", p: ["音声入力の履歴は、検索や再利用ができるようデバイス上に保存されます。デバイスの外へ出ることはありません。アプリ内からいつでも消去でき、当社がアクセスする方法はありません。"] },
      { h: "アカウントと購入", p: ["支払いは Stripe がホストする決済ページを通じて Stripe が処理します。Stripe は独自のプライバシーポリシーに基づいて支払い情報を処理し、当社がカード番号全体を受け取ることはありません。", "当社は、Pro の提供、不正利用の防止、返金管理、サポート対応に必要なアカウント、サブスクリプション、利用権、請求状況の情報を保存します。"] },
      { h: "診断と分析", p: ["ultrspeak は初期設定で分析データやテレメトリーを収集しません。クラッシュレポートの送信を選んだ場合、レポートには障害発生時の技術的な状態が記載されますが、音声や文字起こしの内容は含まれません。"] },
      { h: "本ポリシーの変更", p: ["ultrspeak によるデータの取り扱い方法を変更する場合は、このページと下記の日付を更新します。文字起こしがオンデバイスで行われるため、こうした変更は設計上まれです。"] },
      { h: "お問い合わせ", p: ["プライバシーについてのご質問は hello@ultrspeak.com までメールでお問い合わせください。"] },
    ],
  },
  terms: {
    heading: "利用規約",
    intro: "ultrspeak をご利用いただくための分かりやすい規約です。アプリをダウンロードまたは購入すると、以下の内容に同意したものとみなされます。",
    updatedLabel: "最終更新：",
    updated: "2026年7月29日",
    sections: [
      { h: "無料版と Pro の利用", p: ["ultrspeak は Mac・Windows 向けのデスクトップソフトウェアです。無料版は無償で利用できます。有料の Pro サブスクリプションでは、無制限の音声入力とすべての書き方モードを利用できます。", "Pro の利用権は個人アカウントに属し、ご自身の対応デバイスで使用できます。アカウントの共有、転売、第三者への提供はしないでください。本規約で認められていない方法で使用された場合、利用を停止することがあります。"] },
      { h: "認められる利用方法", p: ["ultrspeak は合法的な目的で使用してください。アプリのリバースエンジニアリング、逆コンパイル、再配布を試みたり、違法行為や他者の権利侵害に使用したりしないでください。"] },
      { h: "支払い、請求、返金", p: ["支払いは Stripe が安全に処理します。Stripe の決済ページや請求ポータルの利用には、Stripe の該当する規約とプライバシーポリシーも適用されます。", "Pro は解約するまで、各年間請求期間の終了時に自動更新されます。いつでも解約でき、支払い済みの期間が終了するまで Pro を利用できます。", "すべての購入には、理由を問わない14日間の返金保証があります。14日以内に hello@ultrspeak.com へメールでご連絡ください。"] },
      { h: "お客様のコンテンツ", p: ["音声入力した内容はすべてお客様のものです。文字起こしはデバイス上で行われ、音声と文章はデバイス内に留まります。当社は ultrspeak で作成された内容について、所有権その他の権利を主張しません。"] },
      { h: "保証と責任", p: ["ultrspeak は現状のまま提供され、いかなる保証もありません。正確で信頼できる製品づくりに努めていますが、誤りがないことや、あらゆる用途に適することは保証できません。", "法律で認められる最大限の範囲で、ultrspeak およびその制作者は、アプリの使用から生じる間接的または結果的な損害について責任を負いません。責任を除外できない場合、その上限はお客様がサービスに支払った金額とします。"] },
      { h: "本規約の変更", p: ["製品の変更に伴い、本規約を更新する場合があります。その際は下記の日付を改定します。変更後も ultrspeak を継続して使用した場合、更新後の規約に同意したものとみなされます。"] },
      { h: "お問い合わせ", p: ["本規約についてのご質問は hello@ultrspeak.com までメールでお問い合わせください。"] },
    ],
  },
  success: {
    eyebrow: "決済完了",
    heading: "ultrspeak へようこそ。",
    intro: "サブスクリプションを確認しています。Pro の利用権は ultrspeak アカウントに自動で紐づきます。",
    steps: ["ultrspeak に戻り、「設定」から「アカウント」を開きます。", "決済時に使用したものと同じアカウントでログインします。", "Pro がすぐに表示されない場合は、アカウントの状態を更新します。"],
    helpBefore: "お困りですか？アカウントのメールアドレスから",
    helpAfter: "へご連絡ください。こちらで確認します。",
    download: "アプリをダウンロード",
  },
};

export const translations = {
  en,
  "zh-TW": zhTW,
  "zh-CN": zhCN,
  ja,
} as const satisfies Record<Locale, Translation>;

export function getTranslations(locale: Locale): Translation {
  return translations[locale];
}
