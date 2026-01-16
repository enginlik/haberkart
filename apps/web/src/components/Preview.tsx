import React, { useEffect, useState } from 'react';
import { Template } from '@news-card/schema';
import { renderTemplateToSvg } from '@news-card/renderer';

interface PreviewProps {
    template: Template;
    data: Record<string, string>;
}

export function Preview({ template, data }: PreviewProps) {
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        // In a real app, loading fonts might be async or require API
        // Here we call the shared render logic
        renderTemplateToSvg(template, data, [])
            .then(svgString => setSvg(svgString))
            .catch(err => console.error(err));
    }, [template, data]);

    if (!svg) return <div>Loading Preview...</div>;

    return (
        <div
            dangerouslySetInnerHTML={{ __html: svg }}
            style={{ width: '100%', height: 'auto' }}
        />
    );
}
