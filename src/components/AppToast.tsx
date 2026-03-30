import { useEffect, useState } from 'react'

let toastQueue: ((msg: string) => void)[] = []

export function showToast(msg: string) {
  toastQueue.forEach(fn => fn(msg))
}

export function AppToast() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handler = (msg: string) => {
      setMessage(msg)
      setVisible(true)
      setTimeout(() => setVisible(false), 2800)
    }
    toastQueue.push(handler)
    return () => { toastQueue = toastQueue.filter(fn => fn !== handler) }
  }, [])

  return <div className={`toast ${visible ? 'visible' : ''}`}>{message}</div>
}
