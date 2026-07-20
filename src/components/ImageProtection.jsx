import { useEffect } from 'react'

export default function ImageProtection() {
  useEffect(() => {
    const blockOnImage = (event) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault()
      }
    }

    document.addEventListener('contextmenu', blockOnImage)
    document.addEventListener('dragstart', blockOnImage)

    return () => {
      document.removeEventListener('contextmenu', blockOnImage)
      document.removeEventListener('dragstart', blockOnImage)
    }
  }, [])

  return null
}
