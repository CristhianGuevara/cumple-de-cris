import { useEffect, useRef, useState } from 'react'
import './App.css'

// ---- Datos del evento (edita aquí cuando tengas la info definitiva) ----
const EVENT = {
  title: 'Cumple de Cris',
  tagline: 'Fin de Semana de Celebración',
  dateLabel: '13 de noviembre de 2026',
  timeLabel: 'Hora por confirmar',
  place: 'Rinconada de Conta',
  targetDate: '2026-11-13T00:00:00',
  rsvpEmail: 'cristhianguevara1311@gmail.com',
}

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#detalles', label: 'Detalles' },
  { href: '#agenda', label: 'Agenda' },
  { href: '#galeria', label: 'Galería' },
  { href: '#rsvp', label: 'RSVP' },
]

const AGENDA_ITEMS = [
  { time: 'Por definir', title: 'Bienvenida y recepción', desc: 'Agrega aquí el detalle de esta actividad.' },
  { time: 'Por definir', title: 'Actividad principal', desc: 'Agrega aquí el detalle de esta actividad.' },
  { time: 'Por definir', title: 'Cena / celebración', desc: 'Agrega aquí el detalle de esta actividad.' },
  { time: 'Por definir', title: 'Cierre', desc: 'Agrega aquí el detalle de esta actividad.' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'WhatsApp', href: '#' },
  { label: 'Facebook', href: '#' },
]

function useCountdown(targetIso) {
  const [remaining, setRemaining] = useState(() => getDiff(targetIso))

  useEffect(() => {
    const id = setInterval(() => setRemaining(getDiff(targetIso)), 1000)
    return () => clearInterval(id)
  }, [targetIso])

  return remaining
}

function getDiff(targetIso) {
  const total = new Date(targetIso).getTime() - Date.now()
  const clamped = Math.max(total, 0)
  return {
    total: clamped,
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  }
}

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

function Reveal({ as: Tag = 'div', className = '', children }) {
  const [ref, visible] = useReveal()
  return (
    <Tag ref={ref} className={`${className} reveal ${visible ? 'is-visible' : ''}`}>
      {children}
    </Tag>
  )
}

function App() {
  const countdown = useCountdown(EVENT.targetDate)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.place)}`
  const mailtoHref = `mailto:${EVENT.rsvpEmail}?subject=${encodeURIComponent(
    `Confirmo mi asistencia — ${EVENT.title}`,
  )}&body=${encodeURIComponent('¡Hola! Confirmo mi asistencia al evento.\n\nNombre:\nN° de personas:\nMensaje:')}`

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
        <a className="nav__brand" href="#inicio">
          {EVENT.title}
        </a>
        <button
          className={`nav__toggle ${menuOpen ? 'is-open' : ''}`}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav__links ${menuOpen ? 'is-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="hero__blob hero__blob--a" />
          <div className="hero__blob hero__blob--b" />
          <p className="hero__eyebrow">Nos vemos en</p>
          <h1 className="hero__title">{EVENT.title}</h1>
          <p className="hero__tagline">{EVENT.tagline}</p>
          <p className="hero__meta">
            {EVENT.dateLabel} · {EVENT.place}
          </p>

          <div className="countdown" role="timer" aria-live="polite">
            <CountdownUnit value={countdown.days} label="Días" />
            <CountdownUnit value={countdown.hours} label="Horas" />
            <CountdownUnit value={countdown.minutes} label="Min" />
            <CountdownUnit value={countdown.seconds} label="Seg" />
          </div>

          <div className="hero__cta">
            <a className="btn btn--primary" href="#rsvp">
              Confirmar asistencia
            </a>
            <a className="btn btn--ghost" href="#detalles">
              Ver detalles
            </a>
          </div>
        </section>

        <Reveal as="section" className="section" >
          <div id="detalles" className="section__anchor" />
          <div className="section__head">
            <p className="section__eyebrow">Detalles</p>
            <h2>Todo lo que necesitas saber</h2>
          </div>
          <div className="cards-grid">
            <div className="card">
              <span className="card__icon" aria-hidden>📅</span>
              <h3>Fecha</h3>
              <p>{EVENT.dateLabel}</p>
            </div>
            <div className="card">
              <span className="card__icon" aria-hidden>🕒</span>
              <h3>Hora</h3>
              <p>{EVENT.timeLabel}</p>
            </div>
            <div className="card">
              <span className="card__icon" aria-hidden>📍</span>
              <h3>Lugar</h3>
              <p>{EVENT.place}</p>
              <a className="card__link" href={mapsHref} target="_blank" rel="noreferrer">
                Ver en el mapa →
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section section--alt">
          <div id="agenda" className="section__anchor" />
          <div className="section__head">
            <p className="section__eyebrow">Agenda</p>
            <h2>Programa del fin de semana</h2>
            <p className="section__hint">Placeholder — reemplaza estos bloques con la agenda definitiva.</p>
          </div>
          <ol className="timeline">
            {AGENDA_ITEMS.map((item) => (
              <li key={item.title} className="timeline__item">
                <span className="timeline__time">{item.time}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal as="section" className="section">
          <div id="galeria" className="section__anchor" />
          <div className="section__head">
            <p className="section__eyebrow">Galería</p>
            <h2>Momentos para recordar</h2>
            <p className="section__hint">Placeholder — sustituye estos bloques por tus fotos favoritas.</p>
          </div>
          <div className="gallery">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="gallery__tile">
                <span>📷</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="section section--alt">
          <div id="rsvp" className="section__anchor" />
          <div className="rsvp">
            <p className="section__eyebrow">RSVP</p>
            <h2>¿Nos acompañas?</h2>
            <p>Confirma tu asistencia por correo antes del 30 de octubre de 2026.</p>
            <a className="btn btn--primary" href={mailtoHref}>
              Confirmar por email
            </a>
            <p className="rsvp__email">{EVENT.rsvpEmail}</p>
          </div>
        </Reveal>

        <Reveal as="section" className="section section--social">
          <div className="section__head">
            <p className="section__eyebrow">Redes</p>
            <h2>Comparte el momento</h2>
            <p className="section__hint">Enlaces por confirmar.</p>
          </div>
          <div className="social-links">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} className="social-links__item">
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </main>

      <footer className="footer">
        <p>
          {EVENT.title} · {EVENT.dateLabel}
        </p>
      </footer>
    </>
  )
}

function CountdownUnit({ value, label }) {
  return (
    <div className="countdown__unit">
      <span className="countdown__value">{String(value).padStart(2, '0')}</span>
      <span className="countdown__label">{label}</span>
    </div>
  )
}

export default App
