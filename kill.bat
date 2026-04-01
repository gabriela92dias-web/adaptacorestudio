@echo off
FOR /F "tokens=5" %%a IN ('netstat -aon ^| findstr :3333') DO (
   TaskKill /F /PID %%a
)
