@echo off
rem agent-kit installer for Windows, for a copy downloaded as ZIP.
rem Without the ZIP, one command in PowerShell does the same:
rem   irm https://raw.githubusercontent.com/Justsav1e/agent-kit/main/install.ps1 ^| iex
rem The installer asks what to install. Needs Node.js 22+ and git.
rem This file is ASCII only and does not call chcp: cmd parses .bat in the OEM code page,
rem so Cyrillic here breaks on some PCs. Node prints Russian text itself via the Unicode console API.
setlocal
cd /d "%~dp0"
where node >/dev/null 2>/dev/null || (echo Node.js not found. Install version 22 or newer: https://nodejs.org & pause & exit /b 1)
node install.mjs %*
set "CODE=%ERRORLEVEL%"
pause
exit /b %CODE%
