REM ---------  To configure --------------
set URL=https://cutting-room-production-process.dev.mylectra.com
set JAVA_HOME=%USERPROFILE%\.ltf\higgins\workspace\java\jdk
set MAVEN_HOME=%USERPROFILE%\.ltf\higgins\workspace\java\maven
REM --------------------------------------

set PATH=%PATH%;%MAVEN_HOME%\bin

@echo off 
echo Saisissez le groupe TestNG a lancer : 
SET group=
SET /p group=

mvn clean verify -Pgenerate.ltf.code -Dproject.included.group=%group% -Dltf.app.url=%URL% -Ddev.mode=true -Dproject.selenium-thread-count=1 -Dproject.browser=chrome -Dsave.functional.steps=true -Dltf.comment=true -Dmax.wait=30 -Dwindow.maxsize="true"

pause
pause