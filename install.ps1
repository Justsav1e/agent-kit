# agent-kit installer for Windows.
# One command in PowerShell:
#   irm https://raw.githubusercontent.com/Justsav1e/agent-kit/main/install.ps1 | iex
# Downloads the kit to ~\.agent-kit (running it again updates it) and starts install.mjs,
# which asks what to install. ASCII only: Windows PowerShell 5.1 reads scripts in the ANSI
# code page. No "exit" here: under iex it would close the user's PowerShell window.
& {
  $repo = 'https://github.com/Justsav1e/agent-kit.git'
  $dir = if ($env:AGENT_KIT_DIR) { $env:AGENT_KIT_DIR } else { Join-Path $HOME '.agent-kit' }

  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host 'Node.js not found. Install version 22 or newer: https://nodejs.org (or: winget install OpenJS.NodeJS.LTS)'
    return
  }
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host 'git not found. Install it: https://git-scm.com (or: winget install Git.Git)'
    return
  }

  if ($PSScriptRoot -and (Test-Path (Join-Path $PSScriptRoot 'install.mjs'))) {
    $kit = $PSScriptRoot
  } elseif (Test-Path (Join-Path $dir '.git')) {
    Write-Host "Updating agent-kit in $dir"
    git -C $dir pull --ff-only -q
    if ($LASTEXITCODE -ne 0) { Write-Host 'Could not update, using the existing copy' }
    $kit = $dir
  } else {
    Write-Host "Downloading agent-kit to $dir"
    git clone --depth 1 -q $repo $dir
    if ($LASTEXITCODE -ne 0) { Write-Host 'Download failed'; return }
    $kit = $dir
  }

  node (Join-Path $kit 'install.mjs') @args
} @args
