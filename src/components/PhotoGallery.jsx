import { useEffect, useRef, useState } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const photoModules = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const photoSources = Object.keys(photoModules)
  .sort()
  .map((path) => photoModules[path])

function getImageSize(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.src = src
  })
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState(null)
  const galleryRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    Promise.all(
      photoSources.map(async (src) => ({ src, ...(await getImageSize(src)) }))
    ).then((result) => {
      if (!cancelled) setPhotos(result)
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!photos) return

    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryRef.current,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()

    return () => lightbox.destroy()
  }, [photos])

  if (photoSources.length === 0) {
    return <p className="coming-soon">Drop photos into src/assets/photos to see them here.</p>
  }

  if (!photos) return null

  return (
    <div className="photo-grid" ref={galleryRef}>
      {photos.map(({ src, width, height }) => (
        <a
          key={src}
          href={src}
          data-pswp-width={width}
          data-pswp-height={height}
          target="_blank"
          rel="noreferrer"
          className="photo-grid-item"
        >
          <img src={src} alt="" loading="lazy" />
        </a>
      ))}
    </div>
  )
}
