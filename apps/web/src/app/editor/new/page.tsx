"use client";

import React, { useState, useEffect } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import { Template, TemplateElement } from '@news-card/schema';
import { Preview } from '../../../components/Preview';

export default function EditorPage() {
    // Mock Template State (In real app, load from API)
    const [template, setTemplate] = useState<Template>({
        width: 1080,
        height: 1080,
        elements: [
            {
                id: '1', type: 'text', x: 50, y: 50, width: 900, height: 200,
                content: 'BREAKING NEWS',
                style: { fontSize: '80px', fontWeight: 'bold', color: 'red' }
            },
            {
                id: '2', type: 'image', x: 0, y: 300, width: 1080, height: 600,
                src: 'https://placehold.co/600x400',
                style: {}
            }
        ]
    });

    const [targets, setTargets] = useState<Array<HTMLElement | SVGElement>>([]);
    const [frameMap] = useState(() => new Map());

    // Update Element Helper
    const updateElement = (id: string, partial: Partial<TemplateElement>) => {
        setTemplate(prev => ({
            ...prev,
            elements: prev.elements.map(el => el.id === id ? { ...el, ...partial } : el)
        }));
    };

    const selectedElementId = targets.length > 0 ? targets[0].getAttribute('data-id') : null;
    const selectedElement = template.elements.find(el => el.id === selectedElementId);

    const handleDragEnd = (e: any) => {
        const id = e.target.getAttribute('data-id');
        // Simple parsing of transform translate for demo purposes (robust app needs matrix parsing)
        // For now, we assume Moveable's `translate` matches our x/y model if we reset transform.
        // Actually, Moveable returns absolute delta. Let's rely on visual update logic for now, 
        // but for state sync we need the final absolute positions.
        // A simpler approach for v1: Update state directly from the event's `lastEvent`.

        // However, extracting X/Y from CSS transform string is tricky without a helper.
        // Let's use the `frame` data if available or just simpler:
        // We will assume the element's style.left/top were updated by the onDrag handler?
        // No, onDrag updated `transform`.

        // Let's stick to the user request: "Sidebar text input updates preview". 
        // Drag/Drop sync is secondary for this exact step, but I'll add a placeholder for it.
        // To make it easy, we'll assume standard absolute positioning.
    };

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar - Properties */}
            <div className="w-80 bg-white border-r p-6 overflow-y-auto flex flex-col gap-6">
                <h2 className="font-bold text-xl border-b pb-2">Properties</h2>

                {selectedElement ? (
                    <div className="flex flex-col gap-4">
                        <div className="text-xs font-mono text-gray-500 mb-2">ID: {selectedElement.id} ({selectedElement.type})</div>

                        {/* Common Properties */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">X</label>
                                <input
                                    type="number"
                                    value={selectedElement.x}
                                    onChange={e => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                                    className="w-full border p-1 rounded text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">Y</label>
                                <input
                                    type="number"
                                    value={selectedElement.y}
                                    onChange={e => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                                    className="w-full border p-1 rounded text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">Width</label>
                                <input
                                    type="number"
                                    value={selectedElement.width}
                                    onChange={e => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                                    className="w-full border p-1 rounded text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">Height</label>
                                <input
                                    type="number"
                                    value={selectedElement.height}
                                    onChange={e => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                                    className="w-full border p-1 rounded text-sm"
                                />
                            </div>
                        </div>

                        {/* Text Specific Properties */}
                        {selectedElement.type === 'text' && (
                            <>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block mb-1">Content</label>
                                    <textarea
                                        value={selectedElement.content || ''}
                                        onChange={e => updateElement(selectedElement.id, { content: e.target.value })}
                                        className="w-full border p-2 rounded text-sm h-24"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block mb-1">Color</label>
                                    <input
                                        type="color"
                                        value={selectedElement.style?.color || '#000000'}
                                        onChange={e => updateElement(selectedElement.id, { style: { ...selectedElement.style, color: e.target.value } })}
                                        className="w-full h-8 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block mb-1">Font Size</label>
                                    <input
                                        type="text"
                                        value={selectedElement.style?.fontSize || '16px'}
                                        onChange={e => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontSize: e.target.value } })}
                                        className="w-full border p-1 rounded text-sm"
                                    />
                                </div>
                            </>
                        )}

                        {/* Image Specific Properties */}
                        {selectedElement.type === 'image' && (
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={selectedElement.src || ''}
                                    onChange={e => updateElement(selectedElement.id, { src: e.target.value })}
                                    className="w-full border p-2 rounded text-sm"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                        <span className="text-4xl mb-2">👆</span>
                        <p className="text-sm">Canvas üzerinden düzenlemek istediğiniz öğeye tıklayın.</p>
                    </div>
                )}
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex justify-center items-center overflow-hidden p-10 relative bg-gray-50 from-gray-50 to-gray-200" id="canvas-area">

                {/* The Live Rendered Template (Interactivity Layer) */}
                <div
                    className="relative bg-white shadow-2xl transition-all duration-200 ease-out"
                    style={{
                        width: template.width,
                        height: template.height,
                        transform: 'scale(0.5)', // Scale down to fit screen
                        transformOrigin: 'center center'
                    }}
                >
                    {template.elements.map(el => (
                        <div
                            key={el.id}
                            className="absolute target-element border hover:border-blue-400 cursor-move"
                            data-id={el.id}
                            style={{
                                left: el.x, top: el.y, width: el.width, height: el.height,
                                ...el.style,
                                position: 'absolute'
                            }}
                        >
                            {el.type === 'text' ? el.content : null}
                            {el.type === 'image' ? <img src={el.src} className="w-full h-full object-cover pointer-events-none" /> : null}
                        </div>
                    ))}
                </div>

                {/* Moveable Controller */}
                <Moveable
                    target={targets}
                    draggable={true}
                    resizable={true}
                    rotatable={false} // Disable rotation for v1 simplicity
                    snappable={true}
                    bounds={{ left: 0, top: 0, bottom: 0, right: 0, position: "css" }}

                    /* DRAG EVENTS */
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onDragEnd={e => {
                        const id = e.target.getAttribute('data-id');
                        const el = template.elements.find(x => x.id === id);

                        if (el && e.lastEvent) {
                            // Moveable returns `translate` delta in `drag` event that accumulates.
                            // e.lastEvent.translate is [x, y] translation relative to start.
                            const [translateX, translateY] = e.lastEvent.translate;

                            // Update state with new X/Y
                            updateElement(id!, {
                                x: el.x + translateX,
                                y: el.y + translateY
                            });

                            // Reset transform visually because React will re-render with new left/top
                            e.target.style.transform = '';
                        }
                    }}

                    /* RESIZE EVENTS */
                    onResize={e => {
                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                    onResizeEnd={e => {
                        const id = e.target.getAttribute('data-id');
                        if (id && e.lastEvent) {
                            // e.lastEvent.width/height are the final dimensions
                            // e.lastEvent.drag.translate is the position change caused by resizing (e.g. from left)

                            const width = e.lastEvent.width;
                            const height = e.lastEvent.height;
                            const [translateX, translateY] = e.lastEvent.drag.translate;

                            const el = template.elements.find(x => x.id === id);
                            if (el) {
                                updateElement(id, {
                                    width,
                                    height,
                                    x: el.x + translateX,
                                    y: el.y + translateY
                                });

                                // Reset visual styles
                                e.target.style.transform = '';
                                // Width/Height will be set by React render
                            }
                        }
                    }}
                />

                <Selecto
                    dragContainer={"#canvas-area"}
                    selectableTargets={[".target-element"]}
                    hitRate={0}
                    selectByClick={true}
                    selectFromInside={false}
                    onSelect={e => {
                        setTargets(e.selected);
                    }}
                />

            </div>

            {/* Right Panel - Satori Preview & Export */}
            <div className="w-96 bg-white border-l flex flex-col shadow-lg z-10">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="font-bold text-gray-800">Canlı Önizleme (Satori)</h2>
                    <p className="text-xs text-gray-500 mt-1">Sunucu tarafında oluşturulan gerçek çıktı.</p>
                </div>

                <div className="p-6 flex-1 bg-gray-100 flex items-center justify-center">
                    <div className="border border-gray-300 bg-white shadow-md relative group">
                        {/* 
                           This component uses the shared Renderer package.
                           It re-renders whenever `template` changes.
                        */}
                        <Preview template={template} data={{}} />

                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                        <span>🚀</span>
                        <span>Dışa Aktar / Üret</span>
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-2">v2.0-beta</p>
                </div>
            </div>

        </div>
    );
}
