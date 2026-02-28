@echo off
echo Testing Agora live streaming API...

curl -X POST https://ecofuelglobal.com/api/app/live/start ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\": \"TEST_USER_123\", \"type\": \"video\", \"title\": \"Test Live Session\"}"

echo.
echo.
echo Expected response should contain:
echo - appId: b6bbf782efa94f8b9894e9b5c1895dfa
echo - token: 006b6bbf782efa94f8b9894e9b5c1895dfa...
echo - channelName: live_TEST_USER_123_...
echo - sessionId: uuid
echo.
echo If you see these values, the API is working correctly!
pause