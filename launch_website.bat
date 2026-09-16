@echo off
echo Starting Govt. Special Education Centre Jalalpur Pirwala Website in Google Chrome...
start chrome "%~dp0index.html" 2>nul || start "" "%~dp0index.html"
exit
