'use client';

import { useState, useCallback } from 'react';
import { generateVideo, listVideos, getVideoUrl } from '@/lib/brainrot-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'generating' | 'loading' | 'ready' | 'error';

export function BrainrotGenerator() {
    const [text, setText] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string | null>(null);
    const [videos, setVideos] = useState<string[]>([]);
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!text.trim()) return;

        setStatus('generating');
        setError(null);

        try {
            await generateVideo(text);

            // Poll for videos
            setStatus('loading');
            const poll = async () => {
                const vids = await listVideos();
                if (vids.length > 0) {
                    const urls = vids.map(getVideoUrl);
                    setVideos(urls);
                    setCurrentVideo(urls[urls.length - 1]);
                    setStatus('ready');
                } else {
                    setTimeout(poll, 2000);
                }
            };
            setTimeout(poll, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Generation failed');
            setStatus('error');
        }
    }, [text]);

    const resetForm = useCallback(() => {
        setStatus('idle');
        setText('');
        setError(null);
    }, []);

    if (status === 'ready' && currentVideo) {
        return (
            <div className="flex flex-col items-center gap-6">
                <div className="aspect-[9/16] w-full max-w-sm overflow-hidden rounded-xl bg-black shadow-2xl">
                    <video
                        src={currentVideo}
                        controls
                        autoPlay
                        loop
                        className="h-full w-full object-contain"
                    />
                </div>

                {videos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                        {videos.map((url, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentVideo(url)}
                                className={cn(
                                    'h-20 w-14 flex-shrink-0 overflow-hidden rounded-md border-2 transition',
                                    url === currentVideo ? 'border-primary' : 'border-muted hover:border-primary/50'
                                )}
                            >
                                <video src={url} muted className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <Button variant="outline" onClick={resetForm}>
                    Generate Another
                </Button>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-3xl font-bold text-transparent">
                    BrainRot+
                </CardTitle>
                <CardDescription>
                    Transform any text into viral-style content
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="text">Enter your text</Label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Paste a chapter, concept, or any text here..."
                        disabled={status === 'generating' || status === 'loading'}
                        className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={!text.trim() || status === 'generating' || status === 'loading'}
                    className="w-full"
                >
                    {status === 'generating' && 'Generating Script...'}
                    {status === 'loading' && 'Creating Video...'}
                    {status === 'idle' && 'Generate Video'}
                    {status === 'error' && 'Try Again'}
                </Button>

                {(status === 'generating' || status === 'loading') && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {status === 'generating' ? 'Creating brainrot script...' : 'Composing video...'}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
