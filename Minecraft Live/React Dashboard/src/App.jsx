import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import OverviewPage from './pages/OverviewPage'
import TikTokPage from './pages/TikTokPage'
import MinecraftPage from './pages/MinecraftPage'
import GiftListPage from './pages/GiftListPage'
import SocialPage from './pages/SocialPage'

function useBotConnection() {
    const [status, setStatus] = useState({
        tiktok: { connected: false, username: 'zaaaayiiii', roomId: null },
        minecraft: { connected: false },
        stats: { totalLikes: 0, totalFollows: 0, totalGifts: 0 }
    })
    const [logs, setLogs] = useState([])
    const wsRef = useRef(null)

    function addLog(message, type = '') {
        const time = new Date().toLocaleTimeString()
        setLogs(prev => [{
            id: Date.now(),
            time,
            message,
            type
        }, ...prev].slice(0, 50))
    }

    function connect() {
        // Huwag mag-connect ulit kung bukas na
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return

        const ws = new WebSocket('ws://localhost:3001')
        wsRef.current = ws

        ws.onopen = () => {
            addLog('Dashboard connected to bot server.', 'minecraft')
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.type === 'state') {
                setStatus(data.data)
            }
            if (data.type === 'tiktok_connected') {
                setStatus(prev => ({
                    ...prev,
                    tiktok: { ...prev.tiktok, connected: true, roomId: data.roomId }
                }))
                addLog(`TikTok connected! Room: ${data.roomId}`, 'follow')
            }
            if (data.type === 'tiktok_disconnected') {
                setStatus(prev => ({
                    ...prev,
                    tiktok: { ...prev.tiktok, connected: false }
                }))
                addLog('TikTok disconnected.', 'like')
            }
            if (data.type === 'minecraft_connected') {
                setStatus(prev => ({
                    ...prev,
                    minecraft: { connected: true }
                }))
                addLog('Minecraft connected!', 'minecraft')
            }
            if (data.type === 'minecraft_disconnected') {
                setStatus(prev => ({
                    ...prev,
                    minecraft: { connected: false }
                }))
                addLog('Minecraft disconnected.', 'like')
            }
            if (data.type === 'gift') {
                addLog(`🎁 ${data.user} sent ${data.giftName} (${data.coins} coins) → Team ${data.team}`, 'gift')
                setStatus(prev => ({
                    ...prev,
                    stats: { ...prev.stats, totalGifts: prev.stats.totalGifts + 1 }
                }))
            }
            if (data.type === 'like') {
                addLog(`❤️ ${data.user} liked`, 'like')
                setStatus(prev => ({
                    ...prev,
                    stats: { ...prev.stats, totalLikes: prev.stats.totalLikes + 1 }
                }))
            }
            if (data.type === 'follow') {
                addLog(`➕ ${data.user} followed`, 'follow')
                setStatus(prev => ({
                    ...prev,
                    stats: { ...prev.stats, totalFollows: prev.stats.totalFollows + 1 }
                }))
            }
        }

        ws.onclose = () => {
            addLog('Disconnected from bot server. Reconnecting in 3s...', 'like')
            // Auto-reconnect after 3 seconds
            setTimeout(() => connect(), 3000)
        }

        ws.onerror = () => {
            ws.close()
        }
    }

    function manualRefresh() {
        addLog('Manual refresh...', 'minecraft')
        if (wsRef.current) wsRef.current.close()
        // onclose will trigger auto-reconnect
    }

    useEffect(() => {
        connect()
        return () => {
            if (wsRef.current) wsRef.current.close()
        }
    }, [])

    return { status, logs, manualRefresh }
}

export default function App() {
    const [activePage, setActivePage] = useState('overview')
    const { status, logs, manualRefresh } = useBotConnection()

    const pages = {
        overview: <OverviewPage status={status} logs={logs} />,
        tiktok: <TikTokPage status={status} />,
        minecraft: <MinecraftPage status={status} />,
        gifts: <GiftListPage />,
        social: <SocialPage status={status} />,
    }

    return (
        <div className="app-layout">
            <Sidebar
                activePage={activePage}
                onNavigate={setActivePage}
                status={status}
                onRefresh={manualRefresh}
            />
            <div className="main-content">
                {pages[activePage]}
            </div>
        </div>
    )
}