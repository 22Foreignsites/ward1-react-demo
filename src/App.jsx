import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'

function Model({ position }) {
// This is where i imported the file this is really a mark 
  const { scene } = useGLTF('/low_poly_tree_scene_free.glb')
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = position[0]
      meshRef.current.position.z = position[1]
    }
  })

  return <primitive ref={meshRef} object={scene} scale={0.8} />
}

export default function App() {
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

 