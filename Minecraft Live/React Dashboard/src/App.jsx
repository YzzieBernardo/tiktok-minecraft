import { useCallback, useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import GiftListPage from './pages/GiftListPage'
import MinecraftPage from './pages/MinecraftPage'
import ZombieApocalypse from "./pages/ZombieApocalypse/components/ZombieApocalypse";
import OverviewPage from './pages/OverviewPage'
import SocialPage from './pages/SocialPage'
import TikTokPage from './pages/TikTokPage'
import MobBattle from './pages/MobBattle'

// UI ENTRY POINT: React dashboard only. It talks to the bot through HTTP and WebSocket.
const API_URL = 'http://localhost:3001'
const DASHBOARD_WS_URL = 'ws://localhost:3001'

const initialStatus = {
    tiktok: { connected: false, username: 'zaaaayiiii', roomId: null },
    minecraft: { connected: false },
    stats: { totalLikes: 0, totalFollows: 0, totalGifts: 0 },
}

async function postJson(path, body) {
    const response = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed')
    }

    return data
}

function useBotConnection(setGiftFilterEnabled) {
    const [status, setStatus] = useState(initialStatus)
    const [logs, setLogs] = useState([])
    const wsRef = useRef(null)
    const reconnectTimerRef = useRef(null)

    const addLog = useCallback((message, type = '') => {
        setLogs(previousLogs => [
            {
                id: `${Date.now()}-${Math.random()}`,
                time: new Date().toLocaleTimeString(),
                message,
                type,
            },
            ...previousLogs,
        ].slice(0, 50))
    }, [])

    const updateStatus = useCallback((section, updates) => {
        setStatus(previousStatus => ({
            ...previousStatus,
            [section]: {
                ...previousStatus[section],
                ...updates,
            },
        }))
    }, [])

    const handleMessage = useCallback((data) => {
        console.log('Dashboard received:', data)

        switch (data.type) {
            case 'state':
                setStatus(data.data)
                if (data.data.settings?.giftChatFilter !== undefined) {
                    setGiftFilterEnabled(data.data.settings.giftChatFilter)
                }
                return

            case 'tiktok_connected':
                updateStatus('tiktok', { connected: true, roomId: data.roomId })
                addLog(`TikTok connected! Room: ${data.roomId}`, 'follow')
                return

            case 'tiktok_disconnected':
                updateStatus('tiktok', { connected: false })
                addLog('TikTok disconnected.', 'like')
                return

            case 'minecraft_connected':
                updateStatus('minecraft', { connected: true })
                addLog('Minecraft LCon connected!', 'minecraft')
                return

            case 'minecraft_disconnected':
                updateStatus('minecraft', { connected: false })
                addLog('Minecraft LCon disconnected.', 'like')
                return

            case 'minecraft_log':
                addLog(data.message, data.logType || 'minecraft')
                return

            case 'minecraft_event':
                addLog(`Minecraft: ${data.message}`, data.logType || 'minecraft')
                return

            case 'gift':
                addLog(
                    `🎁 ${data.user} sent ${data.giftName} (${data.coins} coins) → Team ${data.team}`,
                    'gift',
                )
                setStatus(previousStatus => ({
                    ...previousStatus,
                    stats: {
                        ...previousStatus.stats,
                        totalGifts: previousStatus.stats.totalGifts + 1,
                    },
                }))
                return

            case 'stats_update':
                updateStatus('stats', data.stats)
                return

            case 'like':
                addLog(`❤️ ${data.user} liked ${data.count} times`, 'like')
                return

            case 'chat':
                addLog(`💬 ${data.user}: ${data.message}`, 'chat')
                return

            case 'follow':
                addLog(`➕ ${data.user} followed`, 'follow')
                return

            default:
                return
        }
    }, [addLog, setGiftFilterEnabled, updateStatus])

    useEffect(() => {
        let shouldReconnect = true

        function connect() {
            if (!shouldReconnect || wsRef.current?.readyState === WebSocket.OPEN) {
                return
            }

            const ws = new WebSocket(DASHBOARD_WS_URL)
            wsRef.current = ws

            ws.onopen = () => addLog('Dashboard connected to bot server.', 'minecraft')
            ws.onmessage = event => {
                try {
                    handleMessage(JSON.parse(event.data))
                } catch (error) {
                    console.error('Invalid dashboard WebSocket message:', error)
                }
            }
            ws.onerror = () => ws.close()
            ws.onclose = event => {
                if (!shouldReconnect) {
                    return
                }

                addLog(`Dashboard WebSocket closed. Code: ${event.code}`, 'like')
                reconnectTimerRef.current = setTimeout(connect, 3000)
            }
        }

        connect()

        return () => {
            shouldReconnect = false
            clearTimeout(reconnectTimerRef.current)
            wsRef.current?.close()
        }
    }, [addLog, handleMessage])

    const manualRefresh = useCallback(() => {
        addLog('Manual refresh...', 'minecraft')
        wsRef.current?.close()
    }, [addLog])

    return { status, logs, manualRefresh }
}

export default function App() {
    const [activePage, setActivePage] = useState('overview')
    const [giftFilterEnabled, setGiftFilterEnabled] = useState(true)
    const [minecraftLoading, setMinecraftLoading] = useState(false)
    const [botRunning, setBotRunning] = useState(false)
    const [botLoading, setBotLoading] = useState(false)

    const { status, logs, manualRefresh } = useBotConnection(setGiftFilterEnabled)

    async function toggleGiftFilter() {
        const enabled = !giftFilterEnabled
        setGiftFilterEnabled(enabled)

        try {
            await postJson('/api/settings/gift-chat-filter', { enabled })
        } catch (error) {
            console.error('TikTok Chat → Minecraft toggle error:', error)
            setGiftFilterEnabled(!enabled)
        }
    }

    async function updateBot(shouldStart) {
        if (botLoading || botRunning === shouldStart) {
            return
        }

        setBotLoading(true)

        try {
            const data = await postJson(`/api/bot/${shouldStart ? 'start' : 'stop'}`)
            setBotRunning(data.running)
            console.log(data.message)
        } catch (error) {
            console.error(`${shouldStart ? 'Start' : 'Stop'} bot error:`, error)
        } finally {
            setBotLoading(false)
        }
    }

    async function updateMinecraftConnection(shouldConnect) {
        if (minecraftLoading || status.minecraft.connected === shouldConnect) {
            return
        }

        setMinecraftLoading(true)

        try {
            await postJson(`/api/minecraft/${shouldConnect ? 'connect' : 'disconnect'}`)
        } catch (error) {
            console.error(`Minecraft ${shouldConnect ? 'connect' : 'disconnect'} error:`, error)
        } finally {
            setMinecraftLoading(false)
        }
    }

            const pages = {
                overview: <OverviewPage status={status} logs={logs} />,
                tiktok: <TikTokPage status={status} />,
                minecraft: <MinecraftPage status={status} />,
                gifts: <GiftListPage />,
                social: <SocialPage status={status} />,
                'zombie-apocalypse': <ZombieApocalypse />,
                'mob-battle': <MobBattle />,
            }
    return (
        <div className="app-layout">
            <Sidebar
                activePage={activePage}
                onNavigate={setActivePage}
                status={status}
                giftFilterEnabled={giftFilterEnabled}
                onToggleGiftFilter={toggleGiftFilter}
                onRefresh={manualRefresh}
                minecraftLoading={minecraftLoading}
                onStartMinecraft={() => updateMinecraftConnection(true)}
                onStopMinecraft={() => updateMinecraftConnection(false)}
                botRunning={botRunning}
                botLoading={botLoading}
                onStartBot={() => updateBot(true)}
                onStopBot={() => updateBot(false)}
            />

            <main className="main-content">
                {pages[activePage]}
            </main>
        </div>
    )
}
