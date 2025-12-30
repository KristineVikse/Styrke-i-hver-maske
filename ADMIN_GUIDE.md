# Brukerveiledning - Admin-panel for blogginnlegg

## Hvordan Kristine legger til nye blogginnlegg

### 1. Åpne admin-panelet
Gå til: `https://dinside.no/admin.html` (erstatt med din faktiske nettadresse)

### 2. Logg inn
- **Passord:** `styrke2025`
- ⚠️ **VIKTIG:** Endre dette passordet før du publiserer siden!
  - Åpne filen `assets/js/admin.js`
  - Finn linje 6: `const ADMIN_PASSWORD = 'styrke2025';`
  - Bytt ut `styrke2025` med ditt eget passord
  - Lagre filen

### 3. Legg til nytt innlegg
1. Fyll ut skjemaet:
   - **Tittel:** Tittelen på innlegget
   - **Dato:** Velg publiseringsdato
   - **Forfatter:** Forfatterens navn (standard: KRISTINE VIKSE)
   - **Bilde:** Klikk "📸 Last opp bilde" og velg et bilde fra din datamaskin
   - **Sammendrag:** Kort beskrivelse som vises i oversikten (2-3 setninger)
   - **Hovedinnhold:** Hele innlegget. Bruk dobbel linjeskift mellom avsnitt.

2. Klikk **"Lagre innlegg"**

3. Innlegget vises nå automatisk på blogg-siden!

### 4. Redigere eksisterende innlegg
1. Finn innlegget i listen "Eksisterende innlegg"
2. Klikk **"Rediger"**
3. Gjør endringene i skjemaet
4. Klikk **"Lagre innlegg"**

### 5. Slette innlegg
1. Finn innlegget i listen
2. Klikk **"Slett"**
3. Bekreft at du vil slette

### 6. Logg ut
Klikk **"Logg ut"** øverst til høyre når du er ferdig

## Hvordan laste opp bilder

Det er nå enkelt å laste opp bilder direkte fra admin-panelet:

1. Klikk på **"📸 Last opp bilde"**-knappen i skjemaet
2. Velg et bilde fra din datamaskin (JPG, PNG, etc.)
3. Bildet vises som forhåndsvisning
4. Ferdig! Bildet lagres automatisk med innlegget

**Maks bildestørrelse:** 5MB

**Merk:** Bildene lagres som base64-data i localStorage sammen med innlegget. Dette betyr at bildene ikke ligger som separate filer i images-mappen.

## Tekniske detaljer

- **Hvor lagres innleggene?** I nettleserens localStorage (lokalt på din maskin når du er logget inn som admin, men synkroniseres ved å bruke samme nettleser)
- **Første gangs bruk:** De tre eksisterende innleggene fra nettsiden vil automatisk lastes inn første gang du åpner admin-panelet
- **Backup:** Det er lurt å ta en kopi av innleggene dine regelmessig. Du kan eksportere localStorage-data via nettleserens utviklerverktøy

## Ofte stilte spørsmål

**Q: Hva skjer hvis jeg mister innleggene mine?**
A: Innleggene lagres i nettleserens localStorage. Hvis du tømmer nettleserdata eller bytter nettleser, må du legge inn innleggene på nytt. Det er derfor lurt å ha en backup.

**Q: Kan jeg formatere teksten med fet skrift, kursiv osv?**
A: I den nåværende versjonen er det kun vanlig tekst med avsnitt. Hvis du ønsker mer formatering, kan dette legges til senere.

**Q: Hvordan endrer jeg rekkefølgen på innleggene?**
A: Innleggene sorteres automatisk etter dato, med nyeste først. Endre datoen for å endre rekkefølgen.

## Fremtidige forbedringer

Hvis du ønsker mer avanserte funksjoner, kan vi legge til:
- Bildeopplasting direkte fra admin-panelet
- Rik tekst-editor med formatering (fet, kursiv, lenker)
- Kategorier og tags
- Utkast/publisert status
- Database-lagring i stedet for localStorage
- Bilderedigering

## Support

Hvis du har spørsmål eller trenger hjelp, ta kontakt!
