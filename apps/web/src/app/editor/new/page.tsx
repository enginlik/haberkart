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

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar - Properties */}
            <div className="w-80 bg-white border-r p-4 overflow-y-auto">
                <h2 className="font-bold mb-4">Properties</h2>
                {/* Simple Form logic to edit selected element would go here */}
                <p className="text-sm text-gray-500">Select an element to edit properties...</p>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex justify-center items-center overflow-hidden p-10 relative" id="canvas-area">

                {/* The Live Rendered Template (Interactivity Layer) */}
                <div
                    className="relative bg-white shadow-2xl"
                    style={{
                        width: template.width,
                        height: template.height,
                        transform: 'scale(0.5)', // Scale down to fit screen
                        transformOrigin: 'top left'
                    }}
                >
                    {template.elements.map(el => (
                        <div
                            key={el.id}
                            className="absolute target-element"
                            data-id={el.id}
                            style={{
                                left: el.x, top: el.y, width: el.width, height: el.height,
                                ...el.style,
                                position: 'absolute'
                            }}
                        >
                            {el.type === 'text' ? el.content : null}
                            {el.type === 'image' ? <img src={el.src} className="w-full h-full object-cover" /> : null}
                        </div>
                    ))}
                </div>

                {/* Moveable Controller */}
                <Moveable
                    target={targets}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                        // TODO: Update React State (x, y)
                    }}
                    onResize={e => {
                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                        // TODO: Update React State (width, height)
                    }}
                // Add onDragEnd to sync final position to `template` state
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
            <div className="w-96 bg-gray-50 border-l p-4 flex flex-col">
                <h2 className="font-bold mb-4">Live Preview (Satori)</h2>
                <div className="border border-gray-300 bg-white">
                    {/* 
               This component uses the shared Renderer package.
               It re-renders whenever `template` changes.
            */}
                    <Preview template={template} data={{}} />
                </div>
                <button className="mt-4 bg-blue-600 text-white py-3 rounded font-semibold">
                    Export / Generate
                </button>
            </div>

        </div>
    );
}
