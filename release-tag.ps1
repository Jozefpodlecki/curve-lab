Set-Location app
((cargo pkgid) -match '@(.+)$') | Out-Null; 
$version = $matches[1]
git tag "v$version"
git push origin "v$version"
Set-Location ..