echo Deploy Started

echo Install npm packages
call npm install
IF %ERRORLEVEL% NEQ 0 (
goto error
)
echo Build React App
call npm run build
IF %ERRORLEVEL% NEQ 0 (
goto error
)
:: popd: restore the previous directory stored in the stack
popd
echo kuduSync
call “%KUDU_SYNC_CMD%” -v 50 -f “%DEPLOYMENT_SOURCE%\build” -t “%DEPLOYMENT_TARGET%” -n “%NEXT_MANIFEST_PATH%” -p “%PREVIOUS_MANIFEST_PATH%” -i “.git;.hg;.deployment;deploy.cmd”
IF %ERRORLEVEL% NEQ 0 (
goto error
)
goto end
:error
echo Deploy Error
exit
:end
echo Deploy Finished
exit