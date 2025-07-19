$msg = git log -1 --pretty=%B
if ($msg -match '\[skip ci\]') { throw "Skipping CI as requested." }