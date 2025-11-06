import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { 
  useGLTF, 
  useAnimations,
  useFBX,
  Environment, 
  OrbitControls,
  Sparkles
} from '@react-three/drei'
import * as THREE from 'three'

// Custom Avatar Model Component that handles separate GLB and FBX files
function AvatarModel({ 
  glbUrl, 
  fbxUrl, 
  emotion = {}, 
  scale = 1,
  animationName = null // Specific animation name to play
}) {
  const group = useRef()
  const mixerRef = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeAction, setActiveAction] = useState(null)
  
  // Load GLB model (avatar)
  const glb = glbUrl ? useGLTF(glbUrl) : null
  
  // Load FBX animation
  const fbx = fbxUrl ? useFBX(fbxUrl) : null
  
  // Create animation mixer
  useEffect(() => {
    if (glb?.scene) {
      // Create mixer for the GLB model's scene
      const mixer = new THREE.AnimationMixer(glb.scene)
      mixerRef.current = mixer
      
      console.log('Created AnimationMixer for GLB model')
      return () => {
        mixer.stopAllAction()
        mixer.uncacheRoot(glb.scene)
      }
    }
  }, [glb])
  
  // Apply FBX animation to GLB model
  useEffect(() => {
    if (glb?.scene && fbx?.animations && mixerRef.current) {
      console.log('Applying FBX animations to GLB model...')
      console.log('Available FBX animations:', fbx.animations.map(anim => anim.name))
      
      try {
        // Stop any existing actions
        if (activeAction) {
          activeAction.fadeOut(0.3)
        }
        
        // Find the animation to play
        let animationClip = fbx.animations[0] // Default to first animation
        
        if (animationName) {
          const foundClip = fbx.animations.find(anim => 
            anim.name.toLowerCase().includes(animationName.toLowerCase())
          )
          if (foundClip) {
            animationClip = foundClip
          }
        }
        
        if (animationClip) {
          // Clone the animation clip to avoid conflicts
          const clonedClip = animationClip.clone()
          
          // Create and play the action
          const action = mixerRef.current.clipAction(clonedClip)
          action.reset()
          action.setLoop(THREE.LoopRepeat)
          action.clampWhenFinished = false
          action.enabled = true
          action.setEffectiveTimeScale(1)
          action.setEffectiveWeight(1)
          action.play()
          
          setActiveAction(action)
          
          console.log(`Playing animation: ${clonedClip.name}`)
          console.log('Animation details:', {
            duration: clonedClip.duration,
            tracks: clonedClip.tracks.length,
            enabled: action.enabled,
            weight: action.weight
          })
        }
        
        setError(null)
      } catch (err) {
        console.error('Error applying FBX animation:', err)
        setError(err.message)
      }
    }
  }, [glb, fbx, animationName])
  
  // Update animation mixer
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
  })
  
  // Handle facial expressions/emotions
  useEffect(() => {
    if (glb?.scene && emotion && Object.keys(emotion).length > 0) {
      glb.scene.traverse((child) => {
        if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
          console.log('Available morph targets:', Object.keys(child.morphTargetDictionary))
          Object.entries(emotion).forEach(([key, value]) => {
            const morphIndex = child.morphTargetDictionary[key]
            if (morphIndex !== undefined) {
              child.morphTargetInfluences[morphIndex] = Math.max(0, Math.min(1, value))
              console.log(`Applied emotion ${key}: ${value}`)
            }
          })
        }
      })
    }
  }, [glb, emotion])
  
  // Setup model properties
  useEffect(() => {
    if (glb?.scene) {
      console.log('GLB model loaded successfully')
      console.log('GLB scene structure:', glb.scene)
      
      // Configure model properties
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.visible = true
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = false
        }
        if (child.isSkinnedMesh) {
          console.log('Found SkinnedMesh:', child.name, child)
        }
        if (child.isBone) {
          console.log('Found Bone:', child.name)
        }
      })
      
      setIsLoading(false)
    }
  }, [glb])
  
  // Loading state
  if (isLoading) {
    return (
      <group>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color="#4FC3F7" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color="#4FC3F7" transparent opacity={0.7} />
        </mesh>
        {/* Loading spinner */}
        <mesh position={[0, 3.2, 0]} rotation={[0, 0, Date.now() * 0.01]}>
          <ringGeometry args={[0.1, 0.15, 8]} />
          <meshStandardMaterial color="#2196F3" />
        </mesh>
      </group>
    )
  }
  
  // Error state
  if (error) {
    return (
      <group>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[0, 0.5, 0.6]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    )
  }
  
  // Render the model
  if (glb?.scene) {
    return (
      <primitive 
        ref={group} 
        object={glb.scene} 
        scale={[scale, scale, scale]}
        position={[0, 0, 0]}
      />
    )
  }
  
  return null
}

// Enhanced Lighting Setup
function StudioLighting({
  keyLightIntensity = 1.5,
  fillLightIntensity = 0.8,
  rimLightIntensity = 1.2
}) {
  return (
    <>
      {/* Key Light - Main directional light */}
      <directionalLight
        position={[4, 6, 4]}
        color="#FFFFFF"
        intensity={keyLightIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill Light - Soft blue fill */}
      <directionalLight
        position={[-3, 4, 2]}
        color="#87CEEB"
        intensity={fillLightIntensity}
      />
      
      {/* Rim Light - Warm backlight */}
      <directionalLight
        position={[-2, 3, -4]}
        color="#FFB347"
        intensity={rimLightIntensity}
      />
      
      {/* Ambient Light - Overall illumination */}
      <ambientLight intensity={0.4} color="#F5F5F5" />
      
      {/* Point lights for character detail */}
      <pointLight
        position={[2, 4, 3]}
        intensity={0.5}
        color="#FFFFFF"
        distance={8}
        decay={2}
      />
      
      <pointLight
        position={[-1, 2, 3]}
        intensity={0.3}
        color="#E6E6FA"
        distance={6}
        decay={2}
      />
    </>
  )
}

// Main Avatar Component
function RPMAvatarViewer({
  glbUrl,
  fbxUrl, 
  emotion = {},
  scale = 1,
  cameraDistance = 3.5,
  cameraHeight = 1.6,
  animationName = null,
  backgroundColor = '#1a1a2e',
  environment = "studio",
  children
}) {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ 
          position: [0, cameraHeight, cameraDistance], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: backgroundColor }}
        shadows={{
          enabled: true,
          type: THREE.PCFSoftShadowMap
        }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#4FC3F7" wireframe />
          </mesh>
        }>
          {/* Environment */}
          <Environment preset={environment} />
          
          {/* Studio Lighting */}
          <StudioLighting />
          
          {/* Ground plane for shadows */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -0.1, 0]} 
            receiveShadow
          >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial 
              color="#2a2a2a" 
              transparent 
              opacity={0.3} 
            />
          </mesh>
          
          {/* Avatar with FBX Animation */}
          <AvatarModel
            glbUrl={glbUrl}
            fbxUrl={fbxUrl}
            emotion={emotion}
            scale={scale}
            animationName={animationName}
          />
          
          {/* Children (particles, etc.) */}
          {children}
          
          {/* Camera Controls */}
          <OrbitControls
            target={[0, cameraHeight, 0]}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            maxPolarAngle={Math.PI * 0.75}
            minPolarAngle={Math.PI * 0.1}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading indicator overlay */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        RPM Avatar + FBX Animation
      </div>
    </div>
  )
}

// Export the main components (demo removed for production)
export { RPMAvatarViewer }
