# Brainrot Video Generator

Create viral-style "brainrot" videos from GitHub repository README files. Generates a summarized script, text-to-speech narration, and composites it over gameplay footage with captions.

## Requirements

- **Python 3.12** (required - Python 3.13 is not supported due to dependency compatibility)
- **uv** (recommended package manager)
- **FFmpeg** (for video processing)
- **Gemini API key**

## Setup

### 1. Install uv (if not already installed)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Create virtual environment with Python 3.12

```bash
uv venv --python 3.12 .venv
```

### 3. Activate the virtual environment

```bash
source .venv/bin/activate
```

### 4. Install dependencies

```bash
uv pip install -r requirements.txt
```

### 5. Set up environment variables

Copy the example env file and add your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env` and add your key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 6. Add background videos

Create a `backgrounds/` folder and add gameplay videos (Subway Surfers, Minecraft parkour, satisfying clips, etc.):

```bash
mkdir -p backgrounds
# Add your .mp4 files to this folder
```

## Usage

### From a GitHub repository

```bash
python main.py https://github.com/facebook/react
python main.py anthropics/claude-code --voice Puck
```

### From a local README file

```bash
python main.py --readme path/to/README.md
python main.py -r oai_readme.md --output openai_brainrot.mp4
```

### List available voices

```bash
python main.py --list-voices
```

### Options

| Option | Description |
|--------|-------------|
| `repo` | GitHub repository URL or `owner/repo` format |
| `--readme, -r` | Path to a local README file |
| `--voice` | TTS voice to use (default: Puck) |
| `--output, -o` | Output filename |
| `--backgrounds` | Directory with background videos (default: `backgrounds/`) |
| `--skip-summary` | Use raw README without AI summarization |
| `--list-voices` | Show all available voices |

## Troubleshooting

### Python 3.13 compatibility issues

If you see errors about `ctranslate2`, `llvmlite`, or missing wheels for `cp313`, you need to use Python 3.12:

```bash
# Check your Python version
python --version

# If using Python 3.13, create a new venv with 3.12
uv venv --python 3.12 .venv
source .venv/bin/activate
uv pip install -r requirements.txt
```

### FFmpeg not found

Install FFmpeg:

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

## Output

Videos are saved to the `output/` directory by default.
