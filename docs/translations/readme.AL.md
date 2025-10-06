<div align="center">
  <img src="../media/logo.png" width="18%"><br/>
</div>

<h1 align="center">
  Tusk
</h1>

<h4 align="center">
  Aplikacion i rafinuar desktop për Evernote
</h4>

<div align="center">
    <img src="../media/note-navigation.gif" alt="Tusk" width="100%">
</div>

<p align="center">
  <img alt="Shkarkime Totale" src="https://img.shields.io/github/downloads/klaudiosinani/tusk/total?style=flat&label=Total%20Downloads">
</p>

<div align="center">
  <br>
  <sup><b>Sponsorizuar nga:</b></sup>
  <br>
  <a href="https://betterstack.com">
    <div>
      <img src="https://github.com/Seldaek/monolog/assets/183678/7de58ce0-2fa2-45c0-b3e8-e60cebb3c4cf" width="200" alt="Better Stack">
    </div>
    <sup>
      Zbulo, Zgjidh dhe Parandaloni Kohën e Pushimit.
    </sup>
  </a>
</div>

## Përshkrimi

Tusk është një aplikacion jozyrtare, i pasur me veçori, burim i hapur, i drejtuar nga komuniteti, falas për Evernote që përdoret nga njerëz në më shumë se [140 vende](https://snapcraft.io/tusk).

Tusk është [treguar nga Evernote](https://help.evernote.com/hc/en-us/articles/208313748-Evernote-on-Linux) si një klient alternativ për mjedise Linux të cilit i beson komuniteti i kodit të hapur.

Lexoni këtë dokument në: [English](https://github.com/klaudiosinani/tusk/blob/master/readme.md).

Tani mund të mbështetni procesin e zhvillimit përmes [GitHub Sponsors](https://github.com/sponsors/klaudiosinani).

Vizitoni [udhëzimet e kontributit](https://github.com/klaudiosinani/tusk/blob/master/contributing.md#translating-documentation) për të mësuar më shumë se si të përktheni këtë dokument në më shumë gjuhë.

Mund të gjeni më shumë aplikacione [këtu](#aplikacione-të-lidhura).

## Pikat Kryesore

- Tema të Zeza, të Errëta dhe Sepia
- Modalitetet Focus, Compact dhe Auto-Night
- Shkurtesat Lokale dhe Globale të Tastierës të Personalizueshme
- Eksportimi i Shënimeve si Skedarë PDF, HTML dhe Markdown
- Navigimi i Shënimeve
- Mbështetje për Yinxiang
- Ndërkompjuterik
- Ndërfaqe e Shkallëzueshme
- Njoftimet e Përditësimeve
- Tërheqje dhe Lëshimi i Skedarëve

## Përmbajtja

- [Përshkrimi](#përshkrimi)
- [Pikat Kryesore](#pikat-kryesore)
- [Instalimi](#instalimi)
- [Veçoritë](#veçoritë)
- [Shkurtesat e Tastierës](#shkurtesat-e-tastierës)
- [Zhvillimi](#zhvillimi)
- [Aplikacione të Lidhura](#aplikacione-të-lidhura)
- [Ekipi](#ekipi)
- [Sponsorët](#sponsorët)
- [Mohimi i Përgjegjësisë](#mohimi-i-përgjegjësisë)
- [Licenca](#licenca)

## Instalimi

#### Publikime Github

Shkoni në faqen e [publikimeve](https://github.com/klaudiosinani/tusk/releases/latest) dhe shkarkoni instaluesin e përshtatshëm për sistemin tuaj.

#### Snapcraft

Përdoruesit e Ubuntu Linux mund të instalojnë drejtpërdrejt përmes [Snapcraft](https://snapcraft.io/tusk) `snap install tusk`

#### Homebrew

Përdoruesit e MacOS mund të instalojnë drejtpërdrejt përmes [Homebrew Cask](https://caskroom.github.io/) `brew cask install tusk`

#### Shënim

Versioni i disponueshëm në `Homebrew Cask` mund të mos jetë më i fundit, sepse ndryshe nga `Snapcraft`, nuk mirëmbahet në mënyrë zyrtare. Nëse ky është rasti, ju lutemi konsideroni shkarkimin drejtpërdrejt nga faqja e [publikimeve Github](https://github.com/klaudiosinani/tusk/releases/latest).

## Veçoritë

Vizitoni [faqen kryesore](https://klaudiosinani.com/tusk) të projektit për të parë të gjitha veçoritë në detaj.

- Modaliteti Auto Night - Shtypni <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>N</kbd> për t'i lejuar Tusk të përshtatet me mjedisin tuaj.
- Tema e Zezë - Aktivizojeni duke shtypur <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>E</kbd>.
- Modaliteti Compact - Zvogëloni dritaren për të hyrë në modalitet.
- Tastat e Shkurtesave të Personalizuara - Navigoni te `~/.tusk.json` ose shtypni <kbd>Cmd/Ctrl</kbd> <kbd>.</kbd> për të modifikuar çdo tast shkurtuese. Për të rivendosur, fshini `~/.tusk.json` dhe rinisni aplikacionin.
- Tema e Errët - Aktivizojeni duke shtypur <kbd>Cmd/Ctrl</kbd> <kbd>D</kbd>.
- Tërheqje dhe Lëshimi i Skedarëve - Bashkangjitni skedarë duke i tërhequr në dritaren e aplikacionit.
- Eksportimi i Shënimeve si Markdown - Shtypni <kbd>Cmd/Ctrl</kbd> <kbd>O</kbd> për të ruajtur shënimet tuaja si skedarë `Markdown`.
- Eksportimi i Shënimeve si HTML - Shtypni <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>H</kbd> për të ruajtur shënimet tuaja si skedarë `HTML`.
- Eksportimi i Shënimeve si PDF - Shtypni <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>E</kbd> për të ruajtur shënimet tuaja si skedarë `PDF`.
- Modaliteti Focus - Aktivizojeni duke shtypur <kbd>Cmd/Ctrl</kbd> <kbd>K</kbd>.
- Tastat Globale të Shkurtesave - Aktivizojini duke përdorur opsionin `File` > `Enable Global Shortcut Keys`.
- Navigimi i Shënimeve - Navigoni shënimet tuaja duke shtypur <kbd>Cmd/Ctrl</kbd> <kbd>Tab</kbd> / <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>Tab</kbd> ose hidhuni drejtpërdrejt te një duke përdorur <kbd>Cmd/Ctrl</kbd> <kbd>1</kbd> - <kbd>9</kbd>.
- Printimi i Shënimeve - Shtypni <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>P</kbd> për të printuar shënimet tuaja.
- Ndërfaqe e Shkallëzueshme - Rregulloni faktorin e zmadhimit duke shtypur <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>=</kbd> ose <kbd>Cmd/Ctrl</kbd> <kbd>-</kbd>.
- Tema Sepia - Aktivizojeni duke shtypur <kbd>Cmd/Ctrl</kbd> <kbd>G</kbd>.
- Njoftimet e Përditësimeve - Personalizoni frekuencën e kontrollit të përditësimeve të aplikacionit.
- Mbështetja për Yinxiang - Identifikohuni në Yinxiang duke përdorur opsionin `File` > `Switch to Yinxiang`.

## Shkurtesat e Tastierës

### Tastat Lokale të Shkurtesave

Mbi 70 shkurtesa lokale të tastierës. Ndërroni çdo gjë në një çast.

| Përshkrimi                          | Tastet                                                         |
| ----------------------------------- | -------------------------------------------------------------- |
| Aktivizo Modalitetin Auto Night     | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>N</kbd>                |
| Shto Link                          | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>K</kbd>              |
| Shto Shkurtesë                     | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>S</kbd>                |
| Rreshto në Qendër                  | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>M</kbd>                |
| Rreshto Majtas                     | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>L</kbd>                |
| Rreshto Djathtas                   | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>R</kbd>                |
| Bashkangjit Skedar                 | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>F</kbd>              |
| Tekst i Trashë                     | <kbd>Cmd/Ctrl</kbd> <kbd>B</kbd>                               |
| Listë me Pika                      | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>.</kbd>              |
| Ndrysho Madhësinë e Shkronjave     | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>1</kbd> - <kbd>6</kbd> |
| Blok Kodi                          | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>L</kbd>              |
| Zvogëlo Dhëmbëzimin               | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>M</kbd>              |
| Fshi Shënimin                      | <kbd>Delete</kbd>                                              |
| Redakto Tastat e Shkurtesave       | <kbd>Cmd/Ctrl</kbd> <kbd>.</kbd>                               |
| Eksporto Shënimin si HTML          | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>H</kbd>              |
| Eksporto Shënimin si Markdown      | <kbd>Cmd/Ctrl</kbd> <kbd>O</kbd>                               |
| Eksporto Shënimin si PDF           | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>E</kbd>              |
| Rrit Dhëmbëzimin                  | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>K</kbd>                |
| Fut Damkën e Datës                | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>;</kbd>              |
| Fut Damkën e Datës-Kohës          | <kbd>Cmd/Ctrl</kbd> <kbd>;</kbd>                               |
| Fut nga Drive                      | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>              |
| Fut Vijë Horizontale               | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>-</kbd>              |
| Tekst i Pjerrët                    | <kbd>Cmd/Ctrl</kbd> <kbd>I</kbd>                               |
| Hidhu te Shënimi                   | <kbd>Cmd/Ctrl</kbd> <kbd>1</kbd> - <kbd>9</kbd>                |
| Bëje Tekstin më të Madh            | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>=</kbd>              |
| Bëje Tekstin më të Vogël           | <kbd>Cmd/Ctrl</kbd> <kbd>-</kbd>                               |
| Navigo te Shënimi Tjetër          | <kbd>Cmd/Ctrl</kbd> <kbd>Tab</kbd>                             |
| Navigo te Shënimi i Mëparshëm     | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>Tab</kbd>            |
| Shënim i Ri                        | <kbd>Cmd/Ctrl</kbd> <kbd>N</kbd>                               |
| Libër Shënimesh i Ri              | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>N</kbd>              |
| Etiketë e Re                       | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>T</kbd>              |
| Listë me Numra                     | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd>              |
| Printo Shënimin                    | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>P</kbd>                |
| Hiq Formatimin                     | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>Space</kbd>          |
| Rivendos Nivelin e Zmadhimit       | <kbd>Cmd/Ctrl</kbd> <kbd>0</kbd>                               |
| Kthehu te Shënimet                | <kbd>Esc</kbd>                                                 |
| Ruaj Shënimin                      | <kbd>Cmd/Ctrl</kbd> <kbd>S</kbd>                               |
| Kërko Shënime                      | <kbd>Cmd/Ctrl</kbd> <kbd>F</kbd>                               |
| Vendos Gjithmonë në Krye           | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>P</kbd>              |
| Vendos Kujtues                     | <kbd>Cmd/Ctrl</kbd> <kbd>E</kbd>                               |
| Tekst i Hequr                      | <kbd>Cmd/Ctrl</kbd> <kbd>T</kbd>                               |
| Tekst Subscript                    | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>]</kbd>              |
| Tekst Superscript                  | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>[</kbd>              |
| Ndrysho Temën e Zezë               | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>E</kbd>                |
| Ndrysho Checkbox                   | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>B</kbd>              |
| Ndrysho Temën e Errët              | <kbd>Cmd/Ctrl</kbd> <kbd>D</kbd>                               |
| Ndrysho Modalitetin Focus          | <kbd>Cmd/Ctrl</kbd> <kbd>K</kbd>                               |
| Ndrysho Librat e Shënimeve         | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>N</kbd>                   |
| Ndrysho Temën Sepia                | <kbd>Cmd/Ctrl</kbd> <kbd>G</kbd>                               |
| Ndrysho Cilësimet                  | <kbd>Cmd/Ctrl</kbd> <kbd>,</kbd>                               |
| Ndrysho Shkurtesat                 | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>S</kbd>              |
| Ndrysho Sidebar                    | <kbd>Cmd/Ctrl</kbd> <kbd>\\</kbd>                              |
| Ndrysho Etiketat                   | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>T</kbd>                   |
| Ndrysho Menu e Dritares            | <kbd>Alt</kbd>                                                 |
| Tekst i Nënvizuar                  | <kbd>Cmd/Ctrl</kbd> <kbd>U</kbd>                               |

### Tastat Globale të Shkurtesave

Qasuni në Tusk në çdo moment nga kudo brenda sistemit tuaj operativ. Të gjitha shkurtesat globale mund të personalizohen për t'u përshtatur me preferencën tuaj përmes skedarit të konfigurimit `~/.tusk.json`.

| Përshkrimi                | Shkurtesa Globale                               |
| ------------------------- | ----------------------------------------------- |
| Ndrysho Dritaren e Tusk   | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>A</kbd> |
| Krijo Shënim të Ri        | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>C</kbd> |
| Kërko Shënime             | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>F</kbd> |

## Zhvillimi

Për më shumë informacion se si të kontribuoni në projekt, ju lutemi lexoni [udhëzimet e kontributit](https://github.com/klaudiosinani/tusk/blob/master/contributing.md).

- Bëni fork të repository dhe klonojeni në makinën tuaj
- Navigoni te fork-u juaj lokal: `cd tusk`
- Instaloni varësitë e projektit: `npm install` ose `yarn install`
- Ekzekutoni Tusk në modalitetin e zhvillimit: `npm start` ose `yarn start`
- Kontrolloni kodin për gabime: `npm test` ose `yarn test`
- Ndërtoni të gjitha binaries dhe instaluesit: `npm run release` ose `yarn release`

## Aplikacione të Lidhura

- [Ao](https://github.com/klaudiosinani/ao) - Aplikacion elegant desktop për Microsoft To-Do.
- [Taskbook](https://github.com/klaudiosinani/taskbook) - Detyra, panele dhe shënime për mjedisin e linjës së komandës.

## Ekipi

- Klaudio Sinani [(@klaudiosinani)](https://github.com/klaudiosinani)
- Mario Sinani [(@mariosinani)](https://github.com/mariosinani)

## Sponsorët

Falënderim i madh për të gjithë njerëzit dhe kompanitë që mbështesin punën tonë Open Source:

- [Better Stack: Zbulo, Zgjidh dhe Parandaloni Kohën e Pushimit.](https://betterstack.com/)

## Mohimi i Përgjegjësisë

Tusk është një aplikacion jozyrtare, burim i hapur, palë e tretë, i drejtuar nga komuniteti, falas dhe nuk është i lidhur në asnjë mënyrë me Evernote.

## Licenca

[MIT](https://github.com/klaudiosinani/tusk/blob/master/license.md)
