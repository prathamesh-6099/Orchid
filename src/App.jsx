import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import {
  FiActivity,
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCompass,
  FiGlobe,
  FiMic,
  FiMoon,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiSettings,
  FiSun,
  FiVolume2,
  FiZap,
} from 'react-icons/fi'
import './App.css'

const samplePrompts = [
  'How is AI demand affecting Indian IT services stocks?',
  'Compare TCS and Infosys for a long-term investor.',
  'What changed in renewable energy markets this week?',
  'Explain the current fintech opportunity in India in Hindi.',
]

const sourceLibrary = [
  {
    title: 'GNews market digest',
    type: 'News',
    freshness: '14 min ago',
    confidence: 91,
    note: 'Recent sector headlines and narrative movement.',
  },
  {
    title: 'Yahoo Finance quote stream',
    type: 'Market data',
    freshness: 'live snapshot',
    confidence: 88,
    note: 'Price movement, volume, and comparative performance.',
  },
  {
    title: 'Moneycontrol fundamentals',
    type: 'Financials',
    freshness: 'intraday',
    confidence: 86,
    note: 'Indian market context and company-level fundamentals.',
  },
  {
    title: 'ORCHIDE reasoning trace',
    type: 'Validation',
    freshness: 'current run',
    confidence: 94,
    note: 'Cross-checks contradictions, stale claims, and missing context.',
  },
]

const agentSteps = [
  {
    agent: 'Intent',
    action: 'Classifies language, market domain, and complexity.',
    icon: FiCompass,
  },
  {
    agent: 'Planner',
    action: 'Builds a tool-first investigation path.',
    icon: FiZap,
  },
  {
    agent: 'Research',
    action: 'Collects market, news, and financial signals.',
    icon: FiSearch,
  },
  {
    agent: 'Reasoning',
    action: 'Checks consistency and separates evidence from inference.',
    icon: FiCheckCircle,
  },
  {
    agent: 'Response',
    action: 'Shapes the final answer for language, tone, and modality.',
    icon: FiGlobe,
  },
]

const marketSignals = [
  { label: 'Source coverage', value: '92%', tone: 'good' },
  { label: 'Routing confidence', value: '95%', tone: 'good' },
  { label: 'Research latency', value: '4.2s', tone: 'neutral' },
  { label: 'LLM calls saved', value: '51%', tone: 'good' },
]

const languageOptions = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati']

function generateResearch(query, language = 'English') {
  const normalized = query.toLowerCase()
  const isComparison = normalized.includes('compare') || normalized.includes(' vs ')
  const isIndia = normalized.includes('india') || normalized.includes('indian') || normalized.includes('tcs') || normalized.includes('infosys')
  const isHindi = language === 'Hindi' || normalized.includes('hindi')
  const sector = normalized.includes('renewable')
    ? 'renewable energy'
    : normalized.includes('fintech')
      ? 'fintech'
      : normalized.includes('it') || normalized.includes('tcs') || normalized.includes('infosys')
        ? 'IT services'
        : 'market'

  const thesis = isComparison
    ? 'The comparison should be read as a difference in resilience, margin quality, and near-term narrative exposure rather than a simple winner-takes-all call.'
    : `The ${sector} question is best treated as a live trend, not a static summary. Recent data, sector narratives, and company positioning need to be read together.`

  const bullets = [
    isIndia
      ? 'Indian market context matters: domestic sentiment often reacts differently from global technology narratives, especially when currency, export exposure, and enterprise spending cycles are involved.'
      : 'The strongest signal is the relationship between recent news flow and measurable market movement, not either one in isolation.',
    'The research trace found enough evidence for a directional view, but not enough to remove uncertainty around timing.',
    isComparison
      ? 'A useful comparison should separate business durability, valuation expectations, and current market sentiment.'
      : 'The opportunity appears strongest where narrative momentum is supported by real adoption, revenue visibility, or policy movement.',
    'The next best research step is to watch whether new headlines are confirmed by financial data over the next few sessions.',
  ]

  const answer = isHindi
    ? `संक्षेप में: ${thesis} ORCHIDE ने पहले स्रोतों से संकेत लिए, फिर उन्हें बाजार संदर्भ और जोखिमों के साथ मिलाया.`
    : thesis

  return {
    id: crypto.randomUUID(),
    query,
    language,
    createdAt: new Date().toISOString(),
    intent: isComparison ? 'company_comparison' : 'market_research',
    summary: answer,
    bullets,
    confidence: isComparison ? 87 : 84,
    sources: sourceLibrary.slice(0, isIndia ? 4 : 3),
    trace: [
      'Intent classified and language preference detected.',
      'Planner selected news, market data, and financial context before response generation.',
      'Research layer prioritized structured sources over model memory.',
      'Reasoning layer checked for stale claims and unsupported conclusions.',
      'Response layer compressed the result into a decision-oriented brief.',
    ],
  }
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('orchide-theme') || 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('orchide-theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <div className="app-shell">
        <TopNav theme={theme} onThemeChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/orchide-voice" element={<VoicePage />} />
            <Route path="/settings" element={<SettingsPage theme={theme} onThemeChange={setTheme} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function TopNav({ theme, onThemeChange }) {
  return (
    <header className="top-nav">
      <NavLink to="/" className="brand" aria-label="ORCHIDE home">
        <img src="/logo.png" alt="" />
        <span>ORCHIDE</span>
      </NavLink>
      <nav aria-label="Primary navigation">
        <NavLink to="/chat">Research</NavLink>
        <NavLink to="/orchide-voice">Voice</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <button className="icon-button" type="button" onClick={onThemeChange} aria-label="Toggle theme">
        {theme === 'light' ? <FiMoon /> : <FiSun />}
      </button>
    </header>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState(samplePrompts[0])

  function startResearch() {
    navigate('/chat', { state: { prompt } })
  }

  return (
    <section className="home-page">
      <div className="hero-band">
        <div className="hero-copy">
          <p className="eyebrow">Agentic market intelligence</p>
          <h1>Research that plans before it speaks.</h1>
          <p className="hero-text">
            ORCHIDE turns market questions into source-backed investigations across news,
            financial signals, reasoning traces, multilingual response, and voice-native research.
          </p>
          <div className="prompt-launcher" role="search">
            <FiSearch aria-hidden="true" />
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              aria-label="Research question"
            />
            <button type="button" onClick={startResearch}>
              <FiSend aria-hidden="true" />
              Start
            </button>
          </div>
          <div className="prompt-chips" aria-label="Example prompts">
            {samplePrompts.map((item) => (
              <button type="button" key={item} onClick={() => setPrompt(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <ResearchMap />
      </div>

      <section className="metrics-row" aria-label="System signals">
        {marketSignals.map((signal) => (
          <div className="metric" key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
          </div>
        ))}
      </section>

      <section className="principle-grid">
        <FeaturePanel
          icon={FiBookOpen}
          title="Tool-first research"
          text="The system treats external evidence as the beginning of research, not a footnote after generation."
        />
        <FeaturePanel
          icon={FiActivity}
          title="Agentic orchestration"
          text="Specialized agents handle intent, planning, retrieval, validation, and communication as separate responsibilities."
        />
        <FeaturePanel
          icon={FiGlobe}
          title="Multilingual by design"
          text="Research should meet users in the language where their decisions and conversations already happen."
        />
        <FeaturePanel
          icon={FiMic}
          title="Voice-native mode"
          text="Spoken research has its own route, rhythm, transcript, controls, and response behavior."
        />
      </section>
    </section>
  )
}

function ResearchMap() {
  return (
    <div className="research-map" aria-label="ORCHIDE orchestration map">
      <div className="map-core">
        <span>ORCHIDE</span>
        <small>orchestrator</small>
      </div>
      {agentSteps.map((step, index) => {
        const Icon = step.icon
        return (
          <div className={`map-node node-${index + 1}`} key={step.agent}>
            <Icon aria-hidden="true" />
            <span>{step.agent}</span>
          </div>
        )
      })}
    </div>
  )
}

function FeaturePanel({ icon: Icon, title, text }) {
  return (
    <article className="feature-panel">
      <Icon aria-hidden="true" />
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  )
}

function ChatPage() {
  const navigate = useNavigate()
  const locationPrompt = window.history.state?.usr?.prompt
  const [input, setInput] = useState(locationPrompt || samplePrompts[0])
  const [language, setLanguage] = useState('English')
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('orchide-sessions')
    return saved ? JSON.parse(saved) : []
  })
  const [activeRun, setActiveRun] = useState(() => sessions[0] || null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    localStorage.setItem('orchide-sessions', JSON.stringify(sessions.slice(0, 8)))
  }, [sessions])

  useEffect(() => {
    if (locationPrompt) {
      runResearch(locationPrompt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function runResearch(query = input) {
    const trimmed = query.trim()
    if (!trimmed || isRunning) return
    setInput(trimmed)
    setIsRunning(true)
    setActiveStep(0)

    const timer = setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, agentSteps.length - 1))
    }, 420)

    window.setTimeout(() => {
      window.clearInterval(timer)
      const run = generateResearch(trimmed, language)
      setActiveRun(run)
      setSessions((items) => [run, ...items.filter((item) => item.query !== run.query)].slice(0, 8))
      setIsRunning(false)
      setActiveStep(agentSteps.length - 1)
    }, 2300)
  }

  return (
    <section className="workspace">
      <aside className="sidebar" aria-label="Research sessions">
        <button className="new-chat" type="button" onClick={() => {
          setInput('')
          setActiveRun(null)
        }}>
          <FiRefreshCw aria-hidden="true" />
          New research
        </button>
        <div className="sidebar-section">
          <p className="section-label">Recent</p>
          {sessions.length === 0 ? (
            <p className="empty-note">No saved investigations yet.</p>
          ) : (
            sessions.map((session) => (
              <button
                type="button"
                className="session-button"
                key={session.id}
                onClick={() => setActiveRun(session)}
              >
                <span>{session.query}</span>
                <small>{new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              </button>
            ))
          )}
        </div>
        <button className="voice-link" type="button" onClick={() => navigate('/orchide-voice')}>
          <FiMic aria-hidden="true" />
          Voice route
        </button>
      </aside>

      <div className="research-console">
        <div className="console-header">
          <div>
            <p className="eyebrow">Research console</p>
            <h1>Ask a market question.</h1>
          </div>
          <label className="language-select">
            <FiGlobe aria-hidden="true" />
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languageOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        <form
          className="chat-input"
          onSubmit={(event) => {
            event.preventDefault()
            runResearch()
          }}
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask ORCHIDE about a sector, company, trend, or market signal..."
            rows={3}
          />
          <button type="submit" disabled={isRunning || !input.trim()}>
            <FiSend aria-hidden="true" />
            Run
          </button>
        </form>

        <AgentRail activeStep={activeStep} isRunning={isRunning} />

        {activeRun ? <ResearchResult run={activeRun} /> : <EmptyResearch />}
      </div>
    </section>
  )
}

function AgentRail({ activeStep, isRunning }) {
  return (
    <div className="agent-rail" aria-label="Agent execution path">
      {agentSteps.map((step, index) => {
        const Icon = step.icon
        const state = index < activeStep || (!isRunning && index === agentSteps.length - 1) ? 'done' : index === activeStep ? 'active' : ''
        return (
          <div className={`agent-step ${state}`} key={step.agent}>
            <span className="agent-icon"><Icon aria-hidden="true" /></span>
            <div>
              <strong>{step.agent}</strong>
              <small>{step.action}</small>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EmptyResearch() {
  return (
    <div className="empty-research">
      <FiBarChart2 aria-hidden="true" />
      <h2>No active run</h2>
      <p>Start an investigation to see the answer, citations, confidence, and reasoning trace.</p>
    </div>
  )
}

function ResearchResult({ run }) {
  return (
    <article className="research-result">
      <div className="result-header">
        <div>
          <p className="eyebrow">{run.intent.replace('_', ' ')}</p>
          <h2>{run.query}</h2>
        </div>
        <div className="confidence">
          <span>{run.confidence}%</span>
          <small>confidence</small>
        </div>
      </div>
      <p className="summary">{run.summary}</p>
      <ul className="finding-list">
        {run.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <div className="result-grid">
        <section className="sources-panel">
          <h3>Sources</h3>
          {run.sources.map((source) => (
            <div className="source-row" key={source.title}>
              <div>
                <strong>{source.title}</strong>
                <small>{source.type} · {source.freshness}</small>
              </div>
              <span>{source.confidence}%</span>
            </div>
          ))}
        </section>
        <section className="trace-panel">
          <h3>Reasoning trace</h3>
          {run.trace.map((item, index) => (
            <div className="trace-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </section>
      </div>
    </article>
  )
}

function VoicePage() {
  const recognitionRef = useRef(null)
  const [transcript, setTranscript] = useState('What should I know about Indian IT stocks this week?')
  const [voiceState, setVoiceState] = useState('idle')
  const [run, setRun] = useState(null)
  const [language, setLanguage] = useState('English')
  const supportsSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.()
      window.speechSynthesis?.cancel?.()
    }
  }, [])

  function startListening() {
    if (!supportsSpeech) {
      setVoiceState('unsupported')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.onstart = () => setVoiceState('listening')
    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
      setTranscript(text)
    }
    recognition.onend = () => setVoiceState('idle')
    recognitionRef.current = recognition
    recognition.start()
  }

  function runVoiceResearch() {
    const trimmed = transcript.trim()
    if (!trimmed) return
    setVoiceState('thinking')
    window.setTimeout(() => {
      const nextRun = generateResearch(trimmed, language)
      setRun(nextRun)
      setVoiceState('speaking')
      speak(nextRun.summary)
    }, 1400)
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      setVoiceState('idle')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.95
    utterance.onend = () => setVoiceState('idle')
    window.speechSynthesis.speak(utterance)
  }

  function stopAudio() {
    recognitionRef.current?.stop?.()
    window.speechSynthesis?.cancel?.()
    setVoiceState('idle')
  }

  return (
    <section className="voice-page">
      <div className="voice-stage">
        <div className={`voice-orb ${voiceState}`}>
          <span></span>
          <span></span>
          <FiMic aria-hidden="true" />
        </div>
        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, index) => (
            <i key={index} style={{ '--i': index }}></i>
          ))}
        </div>
        <p className="voice-state">
          {voiceState === 'unsupported'
            ? 'Speech recognition is not available in this browser.'
            : voiceState === 'thinking'
              ? 'Planning research...'
              : voiceState === 'speaking'
                ? 'Speaking response...'
                : voiceState === 'listening'
                  ? 'Listening...'
                  : 'Voice research ready'}
        </p>
      </div>

      <div className="voice-controls-panel">
        <div className="console-header compact">
          <div>
            <p className="eyebrow">Voice route</p>
            <h1>Speak the investigation.</h1>
          </div>
          <label className="language-select">
            <FiGlobe aria-hidden="true" />
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languageOptions.slice(0, 4).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          rows={5}
          aria-label="Voice transcript"
        />
        <div className="voice-actions">
          <button type="button" onClick={startListening}>
            <FiMic aria-hidden="true" />
            Listen
          </button>
          <button type="button" onClick={runVoiceResearch}>
            <FiSearch aria-hidden="true" />
            Research
          </button>
          <button type="button" onClick={stopAudio}>
            <FiVolume2 aria-hidden="true" />
            Stop
          </button>
        </div>
        {run && <ResearchResult run={run} />}
      </div>
    </section>
  )
}

function SettingsPage({ theme, onThemeChange }) {
  const [voiceCache, setVoiceCache] = useState(true)
  const [sourceStrictness, setSourceStrictness] = useState(82)
  const [language, setLanguage] = useState('English')

  return (
    <section className="settings-page">
      <div className="settings-heading">
        <p className="eyebrow">Operator settings</p>
        <h1>Research preferences.</h1>
        <p>These controls shape the local prototype behavior and mirror the production product constraints.</p>
      </div>
      <div className="settings-grid">
        <section className="setting-block">
          <FiSettings aria-hidden="true" />
          <div>
            <h2>Interface mode</h2>
            <p>Choose the visual mode for the research workspace.</p>
          </div>
          <div className="segmented">
            <button type="button" className={theme === 'light' ? 'selected' : ''} onClick={() => onThemeChange('light')}>
              <FiSun aria-hidden="true" />
              Light
            </button>
            <button type="button" className={theme === 'dark' ? 'selected' : ''} onClick={() => onThemeChange('dark')}>
              <FiMoon aria-hidden="true" />
              Dark
            </button>
          </div>
        </section>
        <section className="setting-block">
          <FiGlobe aria-hidden="true" />
          <div>
            <h2>Default language</h2>
            <p>Set the response language used by new research sessions.</p>
          </div>
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </section>
        <section className="setting-block">
          <FiBookOpen aria-hidden="true" />
          <div>
            <h2>Source strictness</h2>
            <p>Raise this when you want fewer but stronger citations.</p>
          </div>
          <label className="range-control">
            <span>{sourceStrictness}%</span>
            <input
              type="range"
              min="50"
              max="98"
              value={sourceStrictness}
              onChange={(event) => setSourceStrictness(event.target.value)}
            />
          </label>
        </section>
        <section className="setting-block">
          <FiClock aria-hidden="true" />
          <div>
            <h2>Voice cache</h2>
            <p>Keep synthesized responses inside the current voice session.</p>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={voiceCache}
              onChange={(event) => setVoiceCache(event.target.checked)}
            />
            <span></span>
          </label>
        </section>
      </div>
    </section>
  )
}

export default App
