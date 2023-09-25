import { useState, useEffect } from 'react'

const Compact = () => {
  const [compact, setCompact] = useState(false)

  function handleResize() {
    const screenWidth = window.innerWidth
    if (screenWidth < 900) {
      setCompact(true)
    } else {
      setCompact(false)
    }
  }

  useEffect(() => {
    handleResize() 
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [setCompact])

  return compact
}

export default Compact