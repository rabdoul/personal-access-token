REM ---------  To configure --------------
set URL=https://cutting-room-production-process.dev.mylectra.com
set JAVA_HOME=%USERPROFILE%\.ltf\higgins\workspace\java\jdk
set MAVEN_HOME=%USERPROFILE%\.ltf\higgins\workspace\java\maven
REM --------------------------------------

set PATH=%PATH%;%MAVEN_HOME%\bin

@echo off 
echo Saisissez le nom du test a partir du repertoire apres lectra : 
SET test=
SET /p test=

mvn clean verify -Pgenerate.ltf.code -Dltf.app.url=%URL% verify -DtestName=%test% -Ddev.mode=true -Dproject.selenium-thread-count=1 -Dproject.browser=chrome -Dsave.functional.steps=true -Dltf.comment=true -Dmax.wait=30 -Dmaven-failsafe-plugin.suiteXmlFile=LocalSuite.xml -Dwindow.maxsize="true"

pause
pause
