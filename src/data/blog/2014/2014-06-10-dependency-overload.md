---
date: 2014-06-10 14:00:25+00:00
excerpt: None
slug: dependency-overload
template: single.html
title: Dependency Overload
---

I employ an [army of command line tools](/2014/04/04/gulp-first-impressions/) to aid my front-end development.

Truth be told it's a bit of an addiction. I'm constantly adding _more_ tools that allow me to do _less_ work. Am I in danger of overloading, of creating a system so convoluted that it evolves into a hindrance and defeats the point of its existence, much like this sentence?

There's no shortage of opinion to suggest I'm becoming too dependant. That I'm "over-complicating". That I should return to the purity of writing code with minimal assistance. After all, we got along just fine building websites without such help not so long ago.

I've always considering the matter one of personal preference and ability. It's easy to strike off critical opinion as an unwillingness to adapt. Admittedly, as a freelancer I have the luxury of being self-centred. Still, it's not unusual for me to work with others and I have to consider what dependencies I'm forcing upon them.

My aforementioned tools are all based on [Node](http://nodejs.org/) modules. The dependency tree for my [Tales WordPress theme](/2014/02/17/introducing-tales/) set-up looks like this:

```console
wp-Tales@1.0.0
├─┬ connect@3.0.0
│ ├── debug@0.8.1
│ ├── escape-html@1.0.1
│ ├── parseurl@1.0.1
│ └── utils-merge@1.0.0
├─┬ grunt@0.4.5
│ ├── async@0.1.22
│ ├── coffee-script@1.3.3
│ ├── colors@0.6.2
│ ├── dateformat@1.0.2-1.2.3
│ ├── eventemitter2@0.4.13
│ ├── exit@0.1.2
│ ├─┬ findup-sync@0.1.3
│ │ ├─┬ glob@3.2.11
│ │ │ ├── inherits@2.0.1
│ │ │ └─┬ minimatch@0.3.0
│ │ │   ├── lru-cache@2.5.0
│ │ │   └── sigmund@1.0.0
│ │ └── lodash@2.4.1
│ ├── getobject@0.1.0
│ ├─┬ glob@3.1.21
│ │ ├── graceful-fs@1.2.3
│ │ └── inherits@1.0.0
│ ├─┬ grunt-legacy-log@0.1.1
│ │ ├── lodash@2.4.1
│ │ └── underscore.string@2.3.3
│ ├─┬ grunt-legacy-util@0.2.0
│ │ ├── async@0.1.22
│ │ ├── lodash@0.9.2
│ │ └── underscore.string@2.2.1
│ ├── hooker@0.2.3
│ ├── iconv-lite@0.2.11
│ ├─┬ js-yaml@2.0.5
│ │ ├─┬ argparse@0.1.15
│ │ │ ├── underscore@1.4.4
│ │ │ └── underscore.string@2.3.3
│ │ └── esprima@1.0.4
│ ├── lodash@0.9.2
│ ├─┬ minimatch@0.2.14
│ │ ├── lru-cache@2.5.0
│ │ └── sigmund@1.0.0
│ ├─┬ nopt@1.0.10
│ │ └── abbrev@1.0.5
│ ├── rimraf@2.2.8
│ ├── underscore.string@2.2.1
│ └── which@1.0.5
├─┬ grunt-contrib-compass@0.8.0
│ ├── async@0.8.0
│ ├── dargs@0.1.0
│ └── tmp@0.0.23
├── grunt-contrib-copy@0.5.0
├─┬ grunt-contrib-jshint@0.10.0
│ ├── hooker@0.2.3
│ └─┬ jshint@2.5.1
│   ├─┬ cli@0.6.3
│   │ └─┬ glob@3.2.11
│   │   ├── inherits@2.0.1
│   │   └─┬ minimatch@0.3.0
│   │     ├── lru-cache@2.5.0
│   │     └── sigmund@1.0.0
│   ├─┬ console-browserify@1.1.0
│   │ └── date-now@0.1.4
│   ├── exit@0.1.2
│   ├─┬ htmlparser2@3.7.2
│   │ ├── domelementtype@1.1.1
│   │ ├── domhandler@2.2.0
│   │ ├── domutils@1.5.0
│   │ ├── entities@1.0.0
│   │ └─┬ readable-stream@1.1.13-1
│   │   ├── core-util-is@1.0.1
│   │   ├── inherits@2.0.1
│   │   ├── isarray@0.0.1
│   │   └── string_decoder@0.10.25-1
│   ├─┬ minimatch@0.3.0
│   │ ├── lru-cache@2.5.0
│   │ └── sigmund@1.0.0
│   ├── shelljs@0.3.0
│   ├── strip-json-comments@0.1.3
│   └── underscore@1.6.0
├─┬ grunt-contrib-uglify@0.4.0
│ ├─┬ chalk@0.4.0
│ │ ├── ansi-styles@1.0.0
│ │ ├── has-color@0.1.7
│ │ └── strip-ansi@0.1.1
│ ├─┬ maxmin@0.1.0
│ │ ├─┬ gzip-size@0.1.1
│ │ │ ├─┬ concat-stream@1.4.6
│ │ │ │ ├── inherits@2.0.1
│ │ │ │ ├─┬ readable-stream@1.1.13-1
│ │ │ │ │ ├── core-util-is@1.0.1
│ │ │ │ │ ├── isarray@0.0.1
│ │ │ │ │ └── string_decoder@0.10.25-1
│ │ │ │ └── typedarray@0.0.6
│ │ │ └─┬ zlib-browserify@0.0.3
│ │ │   └─┬ tape@0.2.2
│ │ │     ├── deep-equal@0.0.0
│ │ │     ├── defined@0.0.0
│ │ │     └── jsonify@0.0.0
│ │ └── pretty-bytes@0.1.1
│ └─┬ uglify-js@2.4.13
│   ├── async@0.2.10
│   ├─┬ optimist@0.3.7
│   │ └── wordwrap@0.0.2
│   ├─┬ source-map@0.1.34
│   │ └── amdefine@0.1.0
│   └── uglify-to-browserify@1.0.2
├─┬ grunt-contrib-watch@0.6.1
│ ├── async@0.2.10
│ ├─┬ gaze@0.5.1
│ │ └─┬ globule@0.1.0
│ │   ├─┬ glob@3.1.21
│ │   │ ├── graceful-fs@1.2.3
│ │   │ └── inherits@1.0.0
│ │   ├── lodash@1.0.1
│ │   └─┬ minimatch@0.2.14
│ │     ├── lru-cache@2.5.0
│ │     └── sigmund@1.0.0
│ ├── lodash@2.4.1
│ └─┬ tiny-lr-fork@0.0.5
│   ├── debug@0.7.4
│   ├── faye-websocket@0.4.4
│   ├─┬ noptify@0.0.3
│   │ └─┬ nopt@2.0.0
│   │   └── abbrev@1.0.5
│   └── qs@0.5.6
├─┬ grunt-imageoptim@1.4.1
│ ├─┬ grunt@0.4.5
│ │ ├── async@0.1.22
│ │ ├── coffee-script@1.3.3
│ │ ├── colors@0.6.2
│ │ ├── dateformat@1.0.2-1.2.3
│ │ ├── eventemitter2@0.4.13
│ │ ├── exit@0.1.2
│ │ ├─┬ findup-sync@0.1.3
│ │ │ ├─┬ glob@3.2.11
│ │ │ │ ├── inherits@2.0.1
│ │ │ │ └─┬ minimatch@0.3.0
│ │ │ │   ├── lru-cache@2.5.0
│ │ │ │   └── sigmund@1.0.0
│ │ │ └── lodash@2.4.1
│ │ ├── getobject@0.1.0
│ │ ├─┬ glob@3.1.21
│ │ │ ├── graceful-fs@1.2.3
│ │ │ └── inherits@1.0.0
│ │ ├─┬ grunt-legacy-log@0.1.1
│ │ │ ├── lodash@2.4.1
│ │ │ └── underscore.string@2.3.3
│ │ ├── grunt-legacy-util@0.2.0
│ │ ├── hooker@0.2.3
│ │ ├── iconv-lite@0.2.11
│ │ ├─┬ js-yaml@2.0.5
│ │ │ ├─┬ argparse@0.1.15
│ │ │ │ ├── underscore@1.4.4
│ │ │ │ └── underscore.string@2.3.3
│ │ │ └── esprima@1.0.4
│ │ ├── lodash@0.9.2
│ │ ├─┬ minimatch@0.2.14
│ │ │ ├── lru-cache@2.5.0
│ │ │ └── sigmund@1.0.0
│ │ ├─┬ nopt@1.0.10
│ │ │ └── abbrev@1.0.5
│ │ ├── rimraf@2.2.8
│ │ ├── underscore.string@2.2.1
│ │ └── which@1.0.5
│ ├─┬ grunt-contrib-jshint@0.6.5
│ │ └─┬ jshint@2.1.11
│ │   ├─┬ cli@0.4.5
│ │   │ └─┬ glob@4.0.2
│ │   │   ├── inherits@2.0.1
│ │   │   └── once@1.3.0
│ │   ├── console-browserify@0.1.6
│ │   ├─┬ minimatch@0.3.0
│ │   │ ├── lru-cache@2.5.0
│ │   │ └── sigmund@1.0.0
│ │   ├── shelljs@0.1.4
│ │   └── underscore@1.4.4
│ ├── imageoptim-cli@1.7.11
│ └── q@0.9.6
├─┬ grunt-svg2png@0.2.1
│ └─┬ phantomjs@1.9.7-8
│   ├── adm-zip@0.2.1
│   ├── kew@0.1.7
│   ├── mkdirp@0.3.5
│   ├── ncp@0.4.2
│   ├─┬ npmconf@0.0.24
│   │ ├─┬ config-chain@1.1.8
│   │ │ └── proto-list@1.2.2
│   │ ├── inherits@1.0.0
│   │ ├── ini@1.1.0
│   │ ├─┬ nopt@2.2.1
│   │ │ └── abbrev@1.0.5
│   │ ├── once@1.1.1
│   │ ├── osenv@0.0.3
│   │ └── semver@1.1.4
│   ├─┬ request@2.36.0
│   │ ├── aws-sign2@0.5.0
│   │ ├── forever-agent@0.5.2
│   │ ├─┬ form-data@0.1.3
│   │ │ ├── async@0.9.0
│   │ │ └─┬ combined-stream@0.0.4
│   │ │   └── delayed-stream@0.0.5
│   │ ├─┬ hawk@1.0.0
│   │ │ ├── boom@0.4.2
│   │ │ ├── cryptiles@0.2.2
│   │ │ ├── hoek@0.9.1
│   │ │ └── sntp@0.2.4
│   │ ├─┬ http-signature@0.10.0
│   │ │ ├── asn1@0.1.11
│   │ │ ├── assert-plus@0.1.2
│   │ │ └── ctype@0.5.2
│   │ ├── json-stringify-safe@5.0.0
│   │ ├── mime@1.2.11
│   │ ├── node-uuid@1.4.1
│   │ ├── oauth-sign@0.3.0
│   │ ├── qs@0.6.6
│   │ ├─┬ tough-cookie@0.12.1
│   │ │ └── punycode@1.2.4
│   │ └── tunnel-agent@0.4.0
│   ├── rimraf@2.2.8
│   └── which@1.0.5
└─┬ grunt-svgmin@0.4.0
  ├─┬ chalk@0.4.0
  │ ├── ansi-styles@1.0.0
  │ ├── has-color@0.1.7
  │ └── strip-ansi@0.1.1
  ├── each-async@0.1.3
  ├── pretty-bytes@0.1.1
  └─┬ svgo@0.4.4
    ├─┬ coa@0.4.1
    │ └── q@0.9.7
    ├── colors@0.6.2
    ├─┬ js-yaml@2.1.3
    │ ├─┬ argparse@0.1.15
    │ │ ├── underscore@1.4.4
    │ │ └── underscore.string@2.3.3
    │ └── esprima@1.0.4
    ├── sax@0.6.0
    └── whet.extend@0.9.9
```

That's 238 modules, i.e. 41mb worth of dependencies to help build less than 1mb of HTML, CSS, and JavaScript. Initially I wasn't sure how to interpret this. On first impression it seems rather excessive.

Are either of those numbers really a concern?

Two more tools I use daily are my text editor of choice (28mb) and Photoshop (massive). They too have their own dependencies. The difference being they're neatly escapulated 'apps' with pretty icons. My army of Node tools remain as source code, interpreted and connected at runtime.

In theory once installed (or configured) any of these tools “just work”. Applications are easier to install but give a false sense of security. If they crash I can begrudgingly relaunch. What if they refuse to launch? Not much I can do at that point.

On the other hand I have an opportunity to debug tools that are an amalgamation of many open source dependencies, all exposed for inspection. Worse case scenario I'm at a complete loss as to how the internals work — same place I'm at with closed applications. Sometimes I can make an immediate fix. More often I can glean enough understanding to Google my way to one.

To judge my practice based on these numbers then would be misleading. Complexity can be easily disguised, exposed, and misinterpreted either way.

Some tools like the text editor have many alternative replacements on effectively equal footing. Others like Photoshop don't. And what of my Node army? It's set up to work as one or as individual components. Many of which I consider useful but not required. Some can easily be swapped with GUI alternatives.

Tools are ultimately a means to an end. While I've employed a great number of them to reach that end faster and more pleasantly, few are absolutely critical to the process.

After some thought I'm all for marching forward. Bring on the overload I say, I can always make a retreat. When it comes to creating websites, more efficient implementation means more time for design consideration.
