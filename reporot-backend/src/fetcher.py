"""Fetch README.md from GitHub repositories."""

import re
import os
import requests
from dotenv import load_dotenv

load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")


def parse_github_url(url: str) -> tuple[str, str]:
    """
    Parse a GitHub URL or owner/repo string into (owner, repo).

    Accepts:
    - https://github.com/owner/repo
    - github.com/owner/repo
    - owner/repo
    """
    # Remove trailing slashes and .git
    url = url.rstrip("/").removesuffix(".git")

    # Try to match full URL
    match = re.match(r"(?:https?://)?(?:www\.)?github\.com/([^/]+)/([^/]+)", url)
    if match:
        return match.group(1), match.group(2)

    # Try owner/repo format
    match = re.match(r"^([^/]+)/([^/]+)$", url)
    if match:
        return match.group(1), match.group(2)

    raise ValueError(f"Invalid GitHub URL or repo format: {url}")


def fetch_readme(repo_url: str) -> str:
    """
    Fetch the README.md content from a GitHub repository.

    Args:
        repo_url: GitHub URL or owner/repo string

    Returns:
        The raw markdown content of the README

    Raises:
        ValueError: If the URL format is invalid
        requests.HTTPError: If the request fails
    """
    owner, repo = parse_github_url(repo_url)

    # Try common README filenames
    readme_names = ["README.md", "readme.md", "Readme.md", "README.MD", "README"]

    headers = {}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"

    for name in readme_names:
        url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{name}"
        response = requests.get(url, timeout=10, headers=headers)

        if response.status_code == 200:
            return response.text

        # Try master branch if main doesn't exist
        url = f"https://raw.githubusercontent.com/{owner}/{repo}/master/{name}"
        response = requests.get(url, timeout=10, headers=headers)

        if response.status_code == 200:
            return response.text

    raise requests.HTTPError(
        f"Could not find README for {owner}/{repo}. "
        "Make sure the repository exists and is public."
    )


if __name__ == "__main__":
    # Quick test
    readme = fetch_readme("anthropics/anthropic-sdk-python")
    print(readme[:500])
