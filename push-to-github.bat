@echo off
chcp 936 >nul
cd /d "%~dp0"

echo ============================================================
echo   Upload site to GitHub  /  shang chuan dao GitHub
echo   Commit is ready locally. This script only pushes.
echo ============================================================
echo.

if "%~1"=="" goto usage
if "%~2"=="" goto usage

set GHUSER=%~1
set REPO=%~2
if "%~3"=="" goto defaultmail
set MAIL=%~3
goto run

:defaultmail
set MAIL=%GHUSER%@users.noreply.github.com

:run
where git >nul 2>&1
if errorlevel 1 goto nogit

echo   user   : %GHUSER%
echo   repo   : %REPO%
echo   remote : https://github.com/%GHUSER%/%REPO%.git
echo.
echo   Press any key to push, or Ctrl+C to abort.
pause >nul

git config user.name  "%GHUSER%"
git config user.email "%MAIL%"
git commit --amend --reset-author --no-edit >nul 2>&1

git remote remove origin >nul 2>&1
git remote add origin "https://github.com/%GHUSER%/%REPO%.git"

echo.
echo == Pushing ==
echo    A browser window may open: sign in to GitHub and authorize.
echo.
git push -u origin main
if not errorlevel 1 goto ok

echo.
echo [!] The remote has its own first commit, auto-created by GitHub,
echo     so the two histories are unrelated. Overwriting that empty
echo     commit with the local history. This runs in the same credential
echo     session, so it will not ask you to sign in twice.
git push --force -u origin main
if errorlevel 1 goto pushfail

:ok
echo.
echo ============================================================
echo   PUSH OK
echo.
echo   Last step, only once - turn on the public page:
echo     1. open  https://github.com/%GHUSER%/%REPO%/settings/pages
echo     2. Source: Deploy from a branch
echo        Branch: main     Folder: / root     then Save
echo     3. wait about one minute, your site is:
echo        https://%GHUSER%.github.io/%REPO%/
echo ============================================================
echo.
pause
exit /b 0

:pushfail
echo.
echo [X] Push failed. Common causes:
echo     - wrong user name or repo name: run this script again
echo     - browser authorization cancelled: run again and retry
echo     - it asks for a password: GitHub no longer accepts
echo       passwords. Use a Personal Access Token as the password,
echo       or just use GitHub Desktop instead - see README.md
echo     - repo does not exist yet: create it at https://github.com/new
echo       choose Public, do NOT tick "Add a README file"
echo.
pause
exit /b 1

:nogit
echo [X] git not found in this window.
echo     Close this window and run the script from
echo     "Git CMD" or "Git Bash" instead.
echo.
pause
exit /b 1

:usage
echo Usage - drag this file into a Git CMD / Git Bash window, or:
echo.
echo     push-to-github.bat ^<github-username^> ^<repo-name^> [email]
echo.
echo Example:
echo     push-to-github.bat qq190 udhr
echo.
echo See README.md for the no-command-line alternative:
echo GitHub Desktop, or the browser upload route.
echo.
pause
exit /b 1
