import { useEffect, useRef } from 'react'

function WatchmakerClock() {
  const clockRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let raf = 0

    const tick = () => {
      const current = new Date()
      const hr = current.getHours() % 12
      const min = current.getMinutes()
      const sec = current.getSeconds()
      const milli = current.getMilliseconds()

      const hourHand = clockRef.current?.querySelector('.hand.hour') as HTMLElement | null
      const minHand = clockRef.current?.querySelector('.hand.minute') as HTMLElement | null
      const secHand = clockRef.current?.querySelector('.hand.second') as HTMLElement | null

      const hourRotation = 30 * hr + 0.5 * min
      const minuteRotation = 6 * min + 0.1 * sec
      const secRotation = 6 * sec + 0.006 * milli

      if (hourHand) hourHand.style.transform = `rotate(${hourRotation}deg)`
      if (minHand) minHand.style.transform = `rotate(${minuteRotation}deg)`
      if (secHand) secHand.style.transform = `rotate(${secRotation}deg)`

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div>
      <h2 className="clocklabel">the watchmaker: using JavaScript</h2>
      <br />
      <div className="clock" ref={clockRef}>
        <div className="hand hour" />
        <div className="hand minute" />
        <div className="hand second" />
        <div className="center" />
      </div>
    </div>
  )
}

export default function Portfolio() {
  return (
    <div>
      <h1>Portfolio</h1>

      <p>
        A few artifacts migrated from the original static site. You can keep adding items here as
        components or as data-driven cards.
      </p>

      <WatchmakerClock />
    </div>
  )
}
