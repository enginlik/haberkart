import satori from 'satori';
import { Template } from '@news-card/schema';

// This is a placeholder. In production, pass the font buffer from the caller (API/Worker)
// or read it from the filesystem here.
type FontConfig = {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 500 | 600 | 700;
    style: 'normal' | 'italic';
};

export async function renderTemplateToSvg(
    template: Template,
    data: Record<string, string>,
    fonts: FontConfig[]
): Promise<string> {
    // Map JSON elements to React-like objects compatible with Satori
    const children = template.elements.map(el => {
        let content = el.content;

        // Simple replacement: {{key}} -> value
        if (content) {
            Object.entries(data).forEach(([key, val]) => {
                content = content?.replace(new RegExp(`{{${key}}}`, 'g'), val);
            });
        }

        const style: any = {
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: `${el.width}px`,
            height: `${el.height}px`,
            ...el.style,
            display: 'flex',
        };

        if (el.type === 'text') {
            return {
                type: 'div',
                props: {
                    style,
                    children: content,
                }
            };
        }

        if (el.type === 'image') {
            // For image, we assume src is valid URL or base64
            return {
                type: 'img',
                props: {
                    src: el.src,
                    width: el.width,
                    height: el.height,
                    style: {
                        ...style,
                        objectFit: 'cover' // Default behavior
                    }
                }
            };
        }

        // Rect/Shapes
        return {
            type: 'div',
            props: { style }
        };
    });

    // Call Satori
    // Note: Satori expects a root ReactElement-like object.
    const svg = await satori(
        {
            type: 'div',
            props: {
                style: {
                    width: `${template.width}px`,
                    height: `${template.height}px`,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    backgroundColor: 'white' // Default bg
                },
                children: children,
            },
        },
        {
            width: template.width,
            height: template.height,
            fonts: fonts,
        }
    );

    return svg;
}
