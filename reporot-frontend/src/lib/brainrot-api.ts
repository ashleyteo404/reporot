/**
 * Brainrot Video Generator API Client
 * Production-ready client with error handling, retries, and type safety
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JobStatusResponse {
    job_id: string;
    status: JobStatus;
    progress: string | null;
    error: string | null;
    created_at: string;
    completed_at: string | null;
    video_url: string | null;
}

export interface Voice {
    name: string;
    display_name: string;
    description: string;
}

class APIError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'APIError';
    }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.text().catch(() => response.statusText);
        throw new APIError(response.status, error);
    }

    return response.json();
}

/** Submit text for video generation */
export async function generateVideo(text: string): Promise<string> {
    return request<string>('/generate', {
        method: 'POST',
        body: JSON.stringify({ q: text }),
    });
}

/** Get all completed video IDs */
export async function listVideos(): Promise<string[]> {
    return request<string[]>('/videos');
}

/** Build video URL from ID */
export function getVideoUrl(videoId: string): string {
    return `${API_BASE}/videos/${videoId}`;
}

/** Check job status */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
    return request<JobStatusResponse>(`/api/status/${jobId}`);
}

/** Get available voices */
export async function getVoices(): Promise<Voice[]> {
    const data = await request<{ voices: Voice[] }>('/api/voices');
    return data.voices;
}

/** Poll until job completes or fails */
export async function waitForJob(
    jobId: string,
    onProgress?: (status: JobStatusResponse) => void,
    intervalMs = 2000,
    maxAttempts = 150
): Promise<JobStatusResponse> {
    for (let i = 0; i < maxAttempts; i++) {
        const status = await getJobStatus(jobId);
        onProgress?.(status);

        if (status.status === 'completed') return status;
        if (status.status === 'failed') {
            throw new Error(status.error || 'Video generation failed');
        }

        await new Promise(r => setTimeout(r, intervalMs));
    }
    throw new Error('Job timed out');
}

/** Health check */
export async function checkHealth(): Promise<boolean> {
    try {
        await request('/health');
        return true;
    } catch {
        return false;
    }
}
