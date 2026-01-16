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
        setError(null);
        renderTemplateToSvg(template, data, [])
            .then(svgString => setSvg(svgString))
            .catch(err => {
                console.error("Satori Render Error:", err);
                setError(err.message || 'Unknown render error');
            });
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
