@echo off
rem Ativa o repositorio git desta pasta a partir de ..\manual.bundle (historico completo de commits).
cd /d "%~dp0"
if exist .git (
  echo O repositorio ja esta ativado.
  pause
  exit /b 0
)
if not exist "..\manual.bundle" (
  echo Nao encontrei ..\manual.bundle
  pause
  exit /b 1
)
git init -b main
git fetch ..\manual.bundle main
git reset --mixed FETCH_HEAD
echo.
git log --oneline -n 8
echo.
git status --short
echo Pronto. Se nao apareceu nenhuma alteracao acima, o repositorio esta em dia.
pause
