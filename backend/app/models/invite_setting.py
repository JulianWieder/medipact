# Zurückgezogen: Der Ansatz einer eigenen `invite_settings`-Tabelle wurde
# verworfen. Die Einladung ist jetzt eine Phase ("einladung") im Workflow
# Manager und wird über `phase_step_defaults` konfiguriert; der Video-Modus
# wird in routers/invites.py:effective_video_mode aus dieser Phase abgeleitet.
#
# Diese Datei bleibt bewusst leer (kein Modell), damit keine Tabelle registriert
# wird. Nicht wieder mit einem Modell befüllen.
