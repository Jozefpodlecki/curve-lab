$env:WINDOWS_CERTIFICATE_PASSWORD = ""
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = ""
$env:TAURI_SIGNING_PRIVATE_KEY = Get-Content "app\~\.tauri\app.key"
$password = ConvertTo-SecureString -String "" -Force -AsPlainText
$pfxOutputPath = "output.pfx"
$base64OutputPath = "cert.txt"
$subject = "CN=, O=, E="

$cert = New-SelfSignedCertificate -Type CodeSigningCert `
    -Subject $subject `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -FriendlyName "CurveLab"

Export-PfxCertificate -Cert $cert -FilePath $pfxOutputPath -Password $password

certutil -encode $pfxOutputPath $base64OutputPath
$env:WINDOWS_CERTIFICATE = Get-Content -Path $base64OutputPath

New-Item -ItemType directory -Path certificate | Out-Null
Set-Content -Path certificate/tempCert.txt -Value $env:WINDOWS_CERTIFICATE
certutil -decode certificate/tempCert.txt certificate/certificate.pfx
Remove-Item -path certificate -include tempCert.txt
Import-PfxCertificate -FilePath certificate/certificate.pfx `
    -CertStoreLocation Cert:\CurrentUser\My `
    -Password (ConvertTo-SecureString -String $env:WINDOWS_CERTIFICATE_PASSWORD -Force -AsPlainText)


cargo tauri build