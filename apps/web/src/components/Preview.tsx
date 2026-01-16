import React, { useEffect, useState } from 'react';
import { Template } from '@news-card/schema';
import { renderTemplateToSvg } from '@news-card/renderer';

interface PreviewProps {
    template: Template;
    data: Record<string, string>;
}

export function Preview({ template, data }: PreviewProps) {
    const [svg, setSvg] = useState<string>('');

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function render() {
            setError(null);
            try {
                // Fetch a standard font (Roboto) so Satori can calculate layout
                // Using WOFF format which is supported by Satori
                const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/roboto/files/roboto-latin-400-normal.woff';
                const fontRes = await fetch(fontUrl);
                if (!fontRes.ok) throw new Error(`Failed to load font: ${fontRes.statusText}`);
                const fontData = await fontRes.arrayBuffer();

                const svgString = await renderTemplateToSvg(template, data, [
                    {
                        name: 'Roboto',
                        data: fontData,
                        weight: 400,
                        style: 'normal'
                    }
                ]);
                setSvg(svgString);
            } catch (err: any) {
                console.error("Satori Render Error:", err);
                setError(err.message || 'Unknown render error');
            }
        }

        render();
    }, [template, data]);

    if (error) return <div className="text-red-500 p-4 border border-red-300 bg-red-50">Error: {error}</div>;
    if (!svg) return <div>Loading Preview...</div>;

    return (
        <div
            dangerouslySetInnerHTML={{ __html: svg }}
            style={{ width: '100%', height: 'auto' }}
        />
    );
}
