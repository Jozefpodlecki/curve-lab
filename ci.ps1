$msg = git log -1 --pretty=%B
if ($msg -match '\[skip ci\]') { 
    Write-Host "Skipping CI as requested."
    exit(1)
}