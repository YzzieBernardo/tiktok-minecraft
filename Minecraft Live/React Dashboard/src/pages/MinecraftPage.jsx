// ==========================================
// src/pages/MinecraftPage.jsx
// ==========================================

import { useState } from 'react'


export default function MinecraftPage({ status }) {

    const { minecraft } = status
    const [command, setCommand] = useState('')
    const [sending, setSending] = useState(false)
    const [result, setResult] = useState(null)
    

    async function sendCommand() {
        if (!command.trim()) return

        setSending(true)

        try {
            const response = await fetch('http://localhost:3001/api/command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: command.trim(),
                }),
            })

            if (!response.ok) {
                throw new Error('Command failed')
            }

            setResult({
                ok: true,
                message: `Sent: ${command}`,
            })

            setCommand('')
        } catch (error) {
            console.error('Minecraft command error:', error)

            setResult({
                ok: false,
                message: 'Failed. Is Minecraft connected?',
            })
        } finally {
            setSending(false)
        }
    }
                    const quickCommands = [
                    {
                        label: '☀️ Day',
                        commands: [
                            'time set day'
                        ]
                    },

                    {
                        label: '🌙 Night',
                        commands: [
                            'time set night'
                        ]
                    },

                    {
                        label: '☀️ Clear',
                        commands: [
                            'weather clear'
                        ]
                    },

                    {
                        label: '🌧️ Rain',
                        commands: [
                            'weather rain'
                        ]
                    },

                    {
                        label: '⚡ Thunder',
                        commands: [
                            'weather thunder'
                        ]
                    },

                    {
                        label: '💀 Kill All',
                        commands: [
                            'kill @e[type=!player]'
                        ]
                    },

                    {
                        label: '⚔️ Setup Teams',
                        commands: [
                            'team add TeamA',
                            'team modify TeamA color red',
                            'team modify TeamA friendlyFire false',

                            'team add TeamB',
                            'team modify TeamB color blue',
                            'team modify TeamB friendlyFire false',
                        ]
                    },

                    {
                        label: '🗑️ Remove Teams',
                        commands: [
                            'team remove TeamA',
                            'team remove TeamB',
                        ]
                    },
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
                          onClick={async () => {
                                if (q.commands) {

                                    setSending(true)

                                    try {

                                        for (const command of q.commands) {

                                            const response = await fetch(
                                                'http://localhost:3001/api/command',
                                                {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        command,
                                                    }),
                                                }
                                            )

                                            if (!response.ok) {
                                                throw new Error(
                                                    `Command failed: ${command}`
                                                )
                                            }
                                        }

                                        setResult({
                                            ok: true,
                                            message: 'Teams created successfully.',
                                        })

                                    } catch (error) {

                                        console.error(
                                            'Team setup error:',
                                            error
                                        )

                                        setResult({
                                            ok: false,
                                            message: 'Failed to setup teams.',
                                        })

                                    } finally {

                                        setSending(false)

                                    }

                                    return
                                }

                                setCommand(q.command)
                            }}
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