import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import OverviewPage from './pages/OverviewPage'
import TikTokPage from './pages/TikTokPage'
import MinecraftPage from './pages/MinecraftPage'
import GiftListPage from './pages/GiftListPage'
import SocialPage from './pages/SocialPage'




function useBotConnection(setGiftFilterEnabled) {
    const [status, setStatus] = useState({
        tiktok: {
            connected: false,
            username: 'zaaaayiiii',
            roomId: null
        },

        minecraft: {
            connected: false
        },

        stats: {
            totalLikes: 0,
            totalFollows: 0,
            totalGifts: 0
        }
    })

    const [logs, setLogs] = useState([])

    const wsRef = useRef(null)


    // ==========================================
    // ADD LOG
    // ==========================================

    function addLog(message, type = '') {

        const time = new Date().toLocaleTimeString()

        setLogs(prev => [
            {
                id: Date.now(),
                time,
                message,
                type
            },
            ...prev
        ].slice(0, 50))
    }


    // ==========================================
    // CONNECT DASHBOARD TO NODE.JS
    // ==========================================

    function connect() {

        if (
            wsRef.current &&
            wsRef.current.readyState === WebSocket.OPEN
        ) {
            return
        }

        const ws = new WebSocket('ws://localhost:3001')

        wsRef.current = ws


        // ==========================================
        // WEBSOCKET CONNECTED
        // ==========================================

        ws.onopen = () => {

            addLog(
                'Dashboard connected to bot server.',
                'minecraft'
            )
        }


        // ==========================================
        // MESSAGE FROM NODE.JS
        // ==========================================
               
                ws.onmessage = (event) => {

                    const data = JSON.parse(event.data)

                    console.log('Dashboard received:', data)


            // ==========================================
            // FULL CURRENT STATE
            // ==========================================
                if (data.type === 'state') {

                    setStatus(data.data)

                    if (data.data.settings?.giftChatFilter !== undefined) {
                        setGiftFilterEnabled(
                            data.data.settings.giftChatFilter
                        )
                    }

                    return
                }


            // ==========================================
            // TIKTOK CONNECTED
            // ==========================================

            if (data.type === 'tiktok_connected') {

                setStatus(prev => ({
                    ...prev,

                    tiktok: {
                        ...prev.tiktok,
                        connected: true,
                        roomId: data.roomId
                    }
                }))

                addLog(
                    `TikTok connected! Room: ${data.roomId}`,
                    'follow'
                )

                return
            }


            // ==========================================
            // TIKTOK DISCONNECTED
            // ==========================================

            if (data.type === 'tiktok_disconnected') {

                setStatus(prev => ({
                    ...prev,

                    tiktok: {
                        ...prev.tiktok,
                        connected: false
                    }
                }))

                addLog(
                    'TikTok disconnected.',
                    'like'
                )

                return
            }


            // ==========================================
            // MINECRAFT CONNECTED
            // ==========================================
if (data.type === 'minecraft_connected') {

    setStatus(prev => ({
        ...prev,

        minecraft: {
            ...prev.minecraft,
            connected: true
        }
    }))

    addLog(
        'Minecraft LCon connected!',
        'minecraft'
    )

    return
}

if (data.type === 'minecraft_disconnected') {

    setStatus(prev => ({
        ...prev,

        minecraft: {
            ...prev.minecraft,
            connected: false
        }
    }))

    addLog(
        'Minecraft LCon disconnected.',
        'like'
    )

    return
}

if (data.type === 'minecraft_log') {

    addLog(
        data.message,
        data.logType || 'minecraft'
    )

    return
}

if (data.type === 'minecraft_event') {

    addLog(
        `Minecraft: ${data.message}`,
        data.logType || 'minecraft'
    )

    return

            }

            // ==========================================
            // GIFT
            // ==========================================

            if (data.type === 'gift') {

                addLog(
                    `🎁 ${data.user} sent ${data.giftName} (${data.coins} coins) → Team ${data.team}`,
                    'gift'
                )

                setStatus(prev => ({
                    ...prev,

                    stats: {
                        ...prev.stats,
                        totalGifts:
                            prev.stats.totalGifts + 1
                    }
                }))

                return
            }


            // ==========================================
            // LIKE
            // ==========================================

            if (data.type === 'stats_update') {

                console.log('Stats update received:', data.stats)

                setStatus(prev => ({
                    ...prev,
                    stats: {
                        ...prev.stats,
                        ...data.stats
                    }
                }))

                return
            }

           if (data.type === 'like') {

                addLog(
                    `❤️ ${data.user} liked ${data.count} times`,
                    'like'
                )

                setStatus(prev => ({
                    ...prev,

                    stats: {
                        ...prev.stats,
                        totalLikes:
                            prev.stats.totalLikes + Number(data.count || 0)
                    }
                }))

                return
}


            // ==========================================
            // TIKTOK CHAT
            // ==========================================

            if (data.type === 'chat') {

                addLog(
                    `💬 ${data.user}: ${data.message}`,
                    'chat'
                )

                return
            }

            // ==========================================
            // FOLLOW
            // ==========================================

            if (data.type === 'follow') {

                addLog(
                    `➕ ${data.user} followed`,
                    'follow'
                )

                setStatus(prev => ({
                    ...prev,

                    stats: {
                        ...prev.stats,
                        totalFollows:
                            prev.stats.totalFollows + 1
                    }
                }))

                return
            }
        }


        // ==========================================
        // WEBSOCKET CLOSED
        // ==========================================

        ws.onclose = (event) => {

            addLog(
                `Dashboard WebSocket closed. Code: ${event.code}`,
                'like'
            )

            console.log(
                'Dashboard WebSocket closed:',
                event.code,
                event.reason
            )

            setTimeout(() => {
                connect()
            }, 3000)
        }

        // ==========================================
        // WEBSOCKET ERROR
        // ==========================================

        ws.onerror = () => {
            ws.close()
        }
    }


    // ==========================================
    // MANUAL REFRESH
    // ==========================================

    function manualRefresh() {

        addLog(
            'Manual refresh...',
            'minecraft'
        )

        if (wsRef.current) {
            wsRef.current.close()
        }
    }


    // ==========================================
    // START WEBSOCKET
    // ==========================================

    useEffect(() => {

        connect()

        return () => {

            if (wsRef.current) {
                wsRef.current.close()
            }
        }

    }, [])


    return {
        status,
        logs,
        manualRefresh
    }
}


// ==========================================
// APP
// ==========================================

export default function App() {

    const [giftFilterEnabled, setGiftFilterEnabled] =
        useState(true)

        async function toggleGiftFilter() {

        const newValue = !giftFilterEnabled

        setGiftFilterEnabled(newValue)

    try {

    const response = await fetch(
        'http://localhost:3001/api/settings/gift-chat-filter',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    enabled: newValue
                })
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(
                data.error || 'Failed to update setting'
            )
        }

            console.log(
                `Gift Chat Filter: ${
                    data.enabled ? 'ON' : 'OFF'
            }`
        )

    } catch (error) {

        console.error(
            'TikTok Chat → Minecraft toggle error:',
            error
        )

        // Balik sa dating value kapag failed
        setGiftFilterEnabled(!newValue)    }
}



        async function startBot() {
    if (botLoading || botRunning) return

    setBotLoading(true)

    try {
        const response = await fetch(
            'http://localhost:3001/api/bot/start',
            {
                method: 'POST'
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Failed to start bot')
        }

        setBotRunning(true)

        console.log('Bot started:', data.message)

    } catch (error) {

        console.error('Start bot error:', error)

    } finally {

        setBotLoading(false)
    }
}


async function stopBot() {
    if (botLoading || !botRunning) return

    setBotLoading(true)

    try {
        const response = await fetch(
            'http://localhost:3001/api/bot/stop',
            {
                method: 'POST'
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Failed to stop bot')
        }

        setBotRunning(false)

        console.log('Bot stopped:', data.message)

    } catch (error) {

        console.error('Stop bot error:', error)

    } finally {

        setBotLoading(false)
    }
}

    const [activePage, setActivePage] =
        useState('overview')


 const {
    status,
    logs,
    manualRefresh
} = useBotConnection(setGiftFilterEnabled)


    // ==========================================
    // MINECRAFT LOADING
    // ==========================================

  const [minecraftLoading, setMinecraftLoading] =
    useState(false)

        const [botRunning, setBotRunning] = useState(false)
        const [botLoading, setBotLoading] = useState(false)

    async function startMinecraft() {

        if (
            minecraftLoading ||
            status.minecraft.connected
        ) {
            return
        }

        setMinecraftLoading(true)

        try {

            console.log('Minecraft: sending connect request...')
            
            const response = await fetch(
                'http://localhost:3001/api/minecraft/connect',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )


            if (!response.ok) {
                throw new Error(
                    'Failed to connect Minecraft'
                )
            }


            console.log(
                'Minecraft connect request sent.'
            )

        } catch (error) {

            console.error(
                'Minecraft start error:',
                error
            )

        } finally {

            setMinecraftLoading(false)
        }
    }


    // ==========================================
    // STOP MINECRAFT
    // ==========================================

    async function stopMinecraft() {

        if (
            minecraftLoading ||
            !status.minecraft.connected
        ) {
            return
        }

        setMinecraftLoading(true)

        try {

            const response = await fetch(
                    'http://localhost:3001/api/minecraft/disconnect',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )


            if (!response.ok) {
                throw new Error(
                    'Failed to disconnect Minecraft'
                )
            }


            console.log(
                'Minecraft disconnect request sent.'
            )

        } catch (error) {

            console.error(
                'Minecraft stop error:',
                error
            )

        } finally {

            setMinecraftLoading(false)
        }
    }


    // ==========================================
    // PAGES
    // ==========================================

    const pages = {

        overview:
            <OverviewPage
                status={status}
                logs={logs}
            />,

        tiktok:
            <TikTokPage
                status={status}
            />,

        minecraft:
            <MinecraftPage
                status={status}
            />,

        gifts:
            <GiftListPage />,

        social:
            <SocialPage
                status={status}
            />,
    }


    // ==========================================
    // RENDER
    // ==========================================

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
                onStartMinecraft={startMinecraft}
                onStopMinecraft={stopMinecraft}
                botRunning={botRunning}
                botLoading={botLoading}
                onStartBot={startBot}
                onStopBot={stopBot}
            />

            <div className="main-content">

                {pages[activePage]}

            </div>

        </div>
    )
    }
