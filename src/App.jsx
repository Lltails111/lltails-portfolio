// src/App.jsx
import { useMemo, useState } from 'react'
import CharacterGuide from './components/CharacterGuide.jsx'
import FinaleOverlay from './components/FinaleOverlay.jsx'
import IntroSequence from './components/IntroSequence.jsx'
import MapNav from './components/MapNav.jsx'
import MobileHint from './components/MobileHint.jsx'
import Preloader from './components/Preloader.jsx'
import Sections from './components/Sections.jsx'
import { useAssetPreloader } from './hooks/useAssetPreloader.js'
import { SECTION_ORDER } from './content/sections.js'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)


  const assets = useMemo(
    () => [
      '/img/miner.gif',
      '/img/chest.png',
      '/img/chest_open.png',
      '/img/map.png',
      '/img/character-walk.gif',
      '/img/character-stand.gif',
      '/img/character_clap.gif',
    ],
    [],
  )

  const { progress, ready } = useAssetPreloader(assets)

  if (!ready) {
    return <Preloader progress={progress} />
  }

  return (
    <div className="min-h-[100svh]">
      <MobileHint />

      {!entered ? (
        <IntroSequence
          onEntered={() => {
            setEntered(true)
            setMapOpen(true)
          }}
        />
      ) : (
        <>
          <MapNav
            open={mapOpen}
            onOpenChange={setMapOpen}
            sectionIds={SECTION_ORDER}
          />
          <CharacterGuide sectionIds={SECTION_ORDER} />
          <FinaleOverlay />
          <main className="mx-auto w-full max-w-[1200px] px-6 pb-32 pt-8">
            <Sections />
          </main>
        </>
      )}
    </div>
  )
}