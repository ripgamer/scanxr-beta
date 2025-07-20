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

// Demo Component
function RPMAvatarDemo() {
  const [glbUrl, setGlbUrl] = useState("")
  const [fbxUrl, setFbxUrl] = useState("")
  const [animationName, setAnimationName] = useState("")
  const [isActive, setIsActive] = useState(false)
  
  // Sample URLs for testing
  const sampleGLB = "https://models.readyplayer.me/64d61e9e17883fd73ebe5eb7.glb?morphTargets=ARKit,Eyes Extra&textureAtlas=none&lod=0"
  const sampleFBX = "https://readyplayerme-assets.s3.amazonaws.com/animations/visage/male-idle-1.fbx"
  
  const handleLoadSample = () => {
    setGlbUrl(sampleGLB)
    setFbxUrl(sampleFBX)
    setAnimationName("idle")
    setIsActive(true)
  }
  
  const handleClear = () => {
    setGlbUrl("")
    setFbxUrl("")
    setAnimationName("")
    setIsActive(false)
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>
        🚀 ReadyPlayer.me Avatar + FBX Animation Loader
      </h1>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Configuration</h3>
        
        <div style={{ display: 'grid', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
              GLB Avatar URL (ReadyPlayer.me):
            </label>
            <input
              type="text"
              placeholder="https://models.readyplayer.me/your-avatar.glb"
              value={glbUrl}
              onChange={(e) => setGlbUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
              FBX Animation URL (Mixamo/RPM):
            </label>
            <input
              type="text"
              placeholder="https://your-animation-url.fbx"
              value={fbxUrl}
              onChange={(e) => setFbxUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6c757d' }}>
              Animation Name (optional):
            </label>
            <input
              type="text"
              placeholder="idle, walking, waving, etc."
              value={animationName}
              onChange={(e) => setAnimationName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleLoadSample}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            🎯 Load Sample (Working URLs)
          </button>
          
          <button
            onClick={() => setIsActive(!!glbUrl)}
            disabled={!glbUrl}
            style={{
              padding: '12px 24px',
              backgroundColor: glbUrl ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: glbUrl ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            🔄 Load Avatar
          </button>
          
          <button
            onClick={handleClear}
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>
      
      {/* 3D Viewer */}
      <div style={{ 
        border: '2px solid #dee2e6', 
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        {isActive ? (
          <RPMAvatarViewer
            glbUrl={glbUrl}
            fbxUrl={fbxUrl}
            animationName={animationName}
            emotion={{
              mouthSmileLeft: 0.2,
              mouthSmileRight: 0.2,
              eyeSquintLeft: 0.1,
              eyeSquintRight: 0.1
            }}
            scale={1}
            cameraDistance={3.5}
            cameraHeight={1.6}
            backgroundColor="#1a1a2e"
          >
            <Sparkles
              color="#ffffff"
              count={25}
              opacity={0.4}
              scale={2.5}
              size={1}
              speed={0.3}
            />
          </RPMAvatarViewer>
        ) : (
          <div style={{
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            color: '#6c757d',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            👆 Configure URLs above and click "Load Avatar" to start
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div style={{ 
        backgroundColor: '#e7f3ff', 
        border: '1px solid #b3d9ff',
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0056b3' }}>📋 How to Use:</h3>
        <ol style={{ marginBottom: '15px', color: '#495057' }}>
          <li><strong>Get your ReadyPlayer.me GLB:</strong> Create an avatar at <a href="https://readyplayer.me" target="_blank" rel="noopener">readyplayer.me</a> and copy the GLB URL</li>
          <li><strong>Get FBX animation:</strong> Download from Mixamo or use ReadyPlayer.me animation URLs</li>
          <li><strong>Paste URLs:</strong> Enter both URLs in the fields above</li>
          <li><strong>Load:</strong> Click "Load Avatar" to see your animated avatar</li>
          <li><strong>Test first:</strong> Use "Load Sample" button to test with working URLs</li>
        </ol>
        
        <h4 style={{ margin: '15px 0 10px 0', color: '#0056b3' }}>✅ Key Features:</h4>
        <ul style={{ color: '#495057' }}>
          <li>✅ Separate GLB avatar and FBX animation loading</li>
          <li>✅ Automatic animation mixer and playback</li>
          <li>✅ Facial expression/morph target support</li>
          <li>✅ Professional studio lighting setup</li>
          <li>✅ Error handling and loading states</li>
          <li>✅ Orbit controls for 3D navigation</li>
        </ul>
      </div>
      
      <div style={{ 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        padding: '15px', 
        borderRadius: '8px',
        color: '#856404'
      }}>
        <strong>💡 Pro Tip:</strong> For best results, ensure your FBX animation is compatible with your avatar's rig. 
        Mixamo animations work well with most humanoid avatars. Check the browser console for detailed loading logs.
      </div>
    </div>
  )
}

export default RPMAvatarDemo