New-Item -ItemType directory -Path certificate | Out-Null
Set-Content -Path certificate/tempCert.txt -Value $env:WINDOWS_CERTIFICATE
certutil -decode certificate/tempCert.txt certificate/certificate.pfx
Remove-Item -path certificate -include tempCert.txt
Import-PfxCertificate -FilePath certificate/certificate.pfx -CertStoreLocation Cert:\CurrentUser\My -Password (ConvertTo-SecureString -String $env:WINDOWS_CERTIFICATE_PASSWORD -Force -AsPlainText)