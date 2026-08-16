; Adds/removes the Windows Firewall rule so phones (Captain app) can reach the
; local POS API on the LAN. Runs with the installer's elevated privileges.
!macro customInstall
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="Topshe POS Local API" dir=in action=allow protocol=TCP localport=3001'
!macroend

!macro customUnInstall
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="Topshe POS Local API"'
!macroend
