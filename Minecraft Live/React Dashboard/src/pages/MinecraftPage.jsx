// ==========================================
// src/pages/MinecraftPage.jsx
// ==========================================

import { useState } from 'react'
import axios from 'axios'

export default function MinecraftPage({ status }) {

    const { minecraft } = status
    const [command, setCommand] = useState('')
    const [sending, setSending] = useState(false)
    const [result, setResult] = useState(null)

    async function sendCommand() {
        if (!command.trim()) return
        setSending(true)
        try {
            await axios.post('http://localhost:3001/api/command', { command })
            setResult({ ok: true, message: `Sent: ${command}` })
            setCommand('')
        } catch (err) {
            setResult({ ok: false, message: 'Failed. Is Minecraft connected?' })
        }
        setSending(false)
    }

    const quickCommands = [
        { label: '☀️ Day', command: 'time set day' },
        { label: '🌙 Night', command: 'time set night' },
        { label: '☀️ Clear', command: 'weather clear' },
        { label: '🌧️ Rain', command: 'weather rain' },
        { label: '⚡ Thunder', command: 'weather thunder' },
        { label: '💀 Kill All', command: 'kill @e[type=!player]' },
    ]

    return (
        <div>
            <div className="page-title">Minecraft</div>
            <div className="page-subtitle">LCon connection at commands</div>

            <div className="card">
                <div className="card-title">LCon Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`status-badge ${minecraft.connected ? 'connected' : 'disconnected'}`}>
                        <span className="status-dot" />
                        {minecraft.connected ? 'Connected' : 'Offline'}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        ws://localhost:8115
                    </span>
                </div>
            </div>

            {/* Quick Commands */}
            <div className="card">
                <div className="card-title">Quick Commands</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {quickCommands.map(q => (
                        <button
                            key={q.command}
                            className="btn btn-ghost"
                            onClick={() => setCommand(q.command)}
                        >
                            {q.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Command */}
            <div className="card">
                <div className="card-title">Send Command</div>
                <div className="form-group">
                    <label className="form-label">Minecraft Command</label>
                    <input
                        className="form-input"
                        placeholder="say Hello World"
                        value={command}
                        onChange={e => setCommand(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendCommand()}
                    />
                </div>

                {result && (
                    <div style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        marginBottom: '12px',
                        fontSize: '12px',
                        background: result.ok
                            ? 'rgba(61,220,132,0.1)'
                            : 'rgba(255,77,77,0.1)',
                        color: result.ok
                            ? 'var(--accent-green)'
                            : 'var(--accent-red)',
                        border: `1px solid ${result.ok
                            ? 'rgba(61,220,132,0.25)'
                            : 'rgba(255,77,77,0.25)'}`
                    }}>
                        {result.message}
                    </div>
                )}

                <button
                    className="btn btn-primary"
                    onClick={sendCommand}
                    disabled={sending || !command.trim()}
                >
                    {sending ? 'Sending...' : '⚡ Send'}
                </button>
            </div>
        </div>
    )
}