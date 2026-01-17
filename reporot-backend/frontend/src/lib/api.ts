/**
 * Brainrot Video Generator API Client
 * Production-ready TypeScript client for frontend integration
 */

const API_BASE = 'http://127.0.0.1:8000';

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

export interface VoiceInfo {
    name: string;
    display_name: string;
    description: string;
}

/**
 * Submit text for video generation
 * @returns Job ID for tracking
 */
export async function generateVideo(text: string): Promise<string> {
    const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text }),
    });

    if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get list of all completed video IDs
 */
export async function listVideos(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/videos`);
    if (!response.ok) {
        throw new Error(`Failed to list videos: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Get video URL by ID
 */
export function getVideoUrl(videoId: string): string {
    return `${API_BASE}/videos/${videoId}`;
}

/**
 * Check job status (for polling)
 */
export async function checkJobStatus(jobId: string): Promise<JobStatusResponse> {
    const response = await fetch(`${API_BASE}/api/status/${jobId}`);
    if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Get available voices
 */
export async function getVoices(): Promise<VoiceInfo[]> {
    const response = await fetch(`${API_BASE}/api/voices`);
    if (!response.ok) {
        throw new Error(`Failed to get voices: ${response.statusText}`);
    }
    const data = await response.json();
    return data.voices;
}

/**
 * Poll for job completion
 * @param jobId - Job to wait for
 * @param onProgress - Progress callback
 * @param intervalMs - Polling interval (default 2s)
 */
export async function waitForCompletion(
    jobId: string,
    onProgress?: (status: JobStatusResponse) => void,
    intervalMs = 2000
): Promise<JobStatusResponse> {
    return new Promise((resolve, reject) => {
        const poll = async () => {
            try {
                const status = await checkJobStatus(jobId);
                onProgress?.(status);

                if (status.status === 'completed') {
                    resolve(status);
                } else if (status.status === 'failed') {
                    reject(new Error(status.error || 'Video generation failed'));
                } else {
                    setTimeout(poll, intervalMs);
                }
            } catch (err) {
                reject(err);
            }
        };
        poll();
    });
}
