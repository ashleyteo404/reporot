"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Video, Download, AlertCircle, ArrowRight, Github, PlayCircle } from "lucide-react"
import { saveVideo, getVideoByRepoUrl } from "@/app/actions/video"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  github_url: z.string().url("Please enter a valid URL").refine(
    (url) => url.includes("github.com"),
    "Must be a GitHub URL"
  ),
  voice: z.string().optional(),
  subtitle_style: z.enum(["brainrot", "standard"]).default("brainrot"),
})

export function VideoGenerator() {
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingText, setLoadingText] = useState("Cooking Brainrot...")

  const LOADING_PHRASES = [
    "Compiling the rot...",
    "Locking in...",
    "Farming content...",
    "Cooking Brainrot..."
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (loading) {
      let index = 0
      setLoadingText(LOADING_PHRASES[0] || "Cooking...") // Reset start
      interval = setInterval(() => {
        index++
        setLoadingText(LOADING_PHRASES[index % LOADING_PHRASES.length] || "Cooking...")
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [loading])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      github_url: "",
      voice: "Puck",
      subtitle_style: "brainrot",
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setError(null)
    setVideoUrl(null)

    try {
      // 1. Check for existing video
      const existingVideo = await getVideoByRepoUrl(values.github_url)

      if (existingVideo) {
        console.log("Found cached video:", existingVideo)
        setVideoUrl(existingVideo.videoUrl) // This should be the R2 URL
        setLoading(false)
        return
      }

      // 2. Generate new video if not found
      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to generate video")
      }

      const r2Url = response.headers.get("X-R2-URL")
      const jobId = response.headers.get("X-Job-Id") || Math.random().toString(36).substring(7)

      if (r2Url) {
        const urlParts = values.github_url.split("/")
        const repoName = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`

        await saveVideo({
          jobId,
          repoUrl: values.github_url,
          repoName,
          videoUrl: r2Url,
          subtitleStyle: values.subtitle_style,
        })
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="github_url"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel className="text-emerald-200 flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub Repository URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/owner/repo"
                      {...field}
                      className="h-12 rounded-xl border-emerald-500/30 bg-white/5 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-400"
                    />
                  </FormControl>
                  <FormDescription className="text-slate-400">
                    Paste the link to any public repo you want to "rot".
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle_style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-200">Subtitle Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-emerald-500/30 bg-white/5 text-slate-100 focus:ring-emerald-400">
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0d1629] border-emerald-500/30 text-slate-100">
                      <SelectItem value="brainrot" className="focus:bg-emerald-500/20">Brainrot (Fast, Center)</SelectItem>
                      <SelectItem value="standard" className="focus:bg-emerald-500/20">Standard (Readable, Bottom)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-emerald-200">Voice Narrator</FormLabel>
              <Select defaultValue="Puck" disabled>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-xl border-emerald-500/30 bg-white/5 text-slate-100 opacity-70">
                    <SelectValue placeholder="Puck (Tiktok)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#0d1629] border-emerald-500/30 text-slate-100">
                  <SelectItem value="Puck">Puck (Tiktok)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-slate-400">
                More voices coming soon.
              </FormDescription>
            </FormItem>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}





          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400 text-slate-900 font-bold text-lg shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                Generate Brainrot Video
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      {videoUrl && (
        <div className="space-y-6 pt-10 border-t border-emerald-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-emerald-400" />
              Your Brainrot is Ready
            </h3>
            <Button variant="outline" className="rounded-full border-emerald-500/30 hover:bg-emerald-500/10" asChild>
              <a href={videoUrl} download={`brainrot-video.mp4`}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>

          <div className="rounded-2xl overflow-hidden border border-emerald-400/30 bg-black aspect-[9/16] max-h-[700px] mx-auto relative shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
              autoPlay
            />
          </div>
        </div>
      )}
    </div>
  )
}
