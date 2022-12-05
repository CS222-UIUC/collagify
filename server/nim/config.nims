when defined(release):
  switch("define", "danger")
  switch("isFutureLoggingEnabled", true)
else:
  switch("debugger", "native")
switch("styleCheck", "hint")
switch("define", "ssl")
