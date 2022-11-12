when defined(release):
  switch("define", "danger")
else:
  switch("debugger", "native")
switch("styleCheck", "hint")
switch("define", "ssl")
