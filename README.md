# DEPRECATED
This sissi package is deprecated and will no longer be maintained. Please use [sissi-core](https://github.com/square-a/sissi-core) and [sissi-cli](https://github.com/square-a/sissi-cli) instead.

See you there!

# sissi-moves – content migration for [sissi]

<img src='https://raw.githubusercontent.com/square-a/sissi/master/sissi.png'  width='160px' />

Hi, it’s me again. *sissi*, your ***si**mple **s**tatic **si**tes* generator.

If you want to turn your simple React app into a static site with a built-in CMS look no further! Or actually, do: [the sissi repo][sissi] is where you'll find all you need. See you there!

If you're a sissi fan and want to contribute – welcome! I'm glad you're here. I have to apologise, though. Please bear with me. I have but two parents and they are working hard on their sissi-to-do-lists. *Contribution guidelines* and *thorough documentation of all packages* are somewhere in there. Somewhere... For now, this will have to do:

## What sissi-moves can do
*sissi moves* is responsible for keeping the `content.json` up to date – every time the [CMS][sissi-says] is started or visited. This means:

- creating a new `content.json` when there is none
- calculating (and then storing) a hash from the `structure.json` and comparing it with the stored one to detect changes
- migrating the existing `content.json` if the `structure.json` has been changed
- creating a `content.json.backup` to make sure no data is lost in the process

During migration the minimum amount of pages and sections is created while invalid pages, sections and fields are removed.

[sissi]:https://github.com/square-a/sissi
[sissi-says]:https://github.com/square-a/sissi-says
