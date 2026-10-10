import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'

function Model({ position }) {
// This is where i imported the file this is really a mark 
  const { scene } = useGLTF('/low_poly_tree_scene_free.glb')
  const meshRef = useRef()

  useFrame(() => { //a replay loop looping at 60fps to update the position 
    if (meshRef.current) {
      meshRef.current.position.x = position[0]
      meshRef.current.position.z = position[1]
    }
  })

  return <primitive ref={meshRef} object={scene} scale={0.8} />
}

export default function App() { //this is the main movement and how we handle it so having the key equal the arrow uo keys
  const [pos, setPos] = useState([0, 0])
  const [visitedSite, setVisitedSite] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      const speed = 0.3
      setPos((prev) => {
        let [x, z] = prev
        if (e.key === 'w' || e.key === 'ArrowUp') z -= speed
        if (e.key === 's' || e.key === 'ArrowDown') z += speed
        if (e.key === 'a' || e.key === 'ArrowLeft') x -= speed
        if (e.key === 'd' || e.key === 'ArrowRight') x += speed

        const distToSite = Math.sqrt(Math.pow(x - (-2), 2) + Math.pow(z - (-2), 2))
        if (distToSite < 1.5) {
          setVisitedSite('Historic Tree')
        }

        return [x, z]
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return ( //Ik typical css would be in teh css folder but since this was my first time this is the only way my code would not break. , but this is how it sees where we at and everything visually
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <gridHelper args={[20, 20]} />
        <Model position={pos} />
        <OrbitControls /> 
      </Canvas>

      <div style={{ 
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(242, 243, 248, 0.85)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        maxWidth: '320px',
        fontFamily: 'sans-serif'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Experiencing Ward One</h2>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#94a3b8' }}>
          Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to move the model.
        </p>
        <p style={{ fontSize: '0.85rem' }}>X: {pos[0].toFixed(1)} | Z: {pos[1].toFixed(1)}</p>

        {visitedSite && (
          <div style={{ marginTop: '16px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 'bold' }}>
              Discovered Site
            </span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1rem' }}>{visitedSite}</h3>
            <p style={{ fontSize: '0.8rem', color: '#000000', marginTop: '4px' }}> //Change the text so it was more visible againsgt the background
              Historic Ward One landmark area prior to displacement.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}