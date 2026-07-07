import PhotoGallery from '../components/PhotoGallery.jsx'

export default function Photos() {
  return (
    <div className="content">
      <h1 className="page-title">Photos & Creative Work</h1>
      <div className="page-description photo-intro">
        <p>
          My love for photography started pretty young when I was 9 years old and I got my
          first digital 'handycam' - TCL - purchased for INR 3k. It wasn't photography, but I
          did love recording videos.
        </p>
        <p>
          I'm feeling old as I type this next statement, but the first camera I used for a film
          camera for a Kerala trip I went when I was 10 years old. As film camera died, mobile
          phones haven't picked up yet. After my class 9 school trip, I convinced my parents to
          get me a Sony Cybershot worth INR 5k. That actually triggered a desire to learn it
          extensively.
        </p>
        <p>
          My uncle and parents gifted me a DSLR as I finished class 10. As Indian kids go, 11th &
          12th are for entrance exams. It was my undergraduate college that helped me grow and
          flourish on my photography.
        </p>
        <p>My biggest purchase of my life so far, with practically my first month salary and joining bonus was a Sony a7iii &lt;3</p>
        <p>
          Portraits and Landscapes usually dominate my photography. (No, not just the
          orientation, duh!) Primarily driven by my lack of lens beyond a 50mm in my life to try
          other photography. Nevertheless, my love for photography has only increased.
        </p>
        <p>
          Below is a showcase of some of my work. I regularly post on my{' '}
          <a href="https://www.instagram.com/sasank_gurajapu/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>{' '}
          too.
        </p>
      </div>
      <PhotoGallery />
    </div>
  )
}
