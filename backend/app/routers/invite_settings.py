# Zurückgezogen: eigener Admin-Router für `invite_settings` entfällt. Die
# Einladung ist jetzt eine Phase ("einladung") im Workflow Manager und wird über
# die bestehenden phase_step_defaults-Endpunkte konfiguriert. Der Video-Modus
# wird in routers/invites.py:effective_video_mode aus dieser Phase abgeleitet.
#
# Diese Datei ist bewusst leer (kein Router) und in main.py nicht mehr
# eingebunden.
