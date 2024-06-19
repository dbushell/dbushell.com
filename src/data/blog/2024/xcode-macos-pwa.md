---
date: 2024-04-22 10:00:00+00:00
slug: xcode-macos-progressive-web-app
title: 'I Made a MacOS App for my PWA (Without AI)'
description: 'The one where I dive into the murkey depths of Xcode'
---

Back in January I showed off a small [self-hosted PWA](/2024/01/08/new-projects-for-2024/#pattern-library) (progressive web app; aka website) I'm hosting on a [Raspberry Pi Stream Deck server](/2022/10/14/deno-usb-hid-stream-deck/).

I built the app to control my lights because Apple's HomeKit is bad. The entire smart home ecosystem is garbage. Literal e-waste in many cases. A rant for another day. Anyway, despite [Apple's hostility](https://letter.open-web-advocacy.org), adding a PWA to my iPhone is still a workable experience. Adding it to the MacOS Dock is OK but I wanted something nicer.

Something like this:

<img
  src="/images/blog/2024/homedeck-macos-menu-bar.avif"
  alt="macos menu bar app with webview"
  width="1300"
  height="1300">

I finally built it!

I've had this idea on the back burner for months. It's just a web view that is opened via the menu bar. I figured it'd be simple to build but I have zero knowledge about Xcode and Swift.

## How I Built It

I opened Xcode and created a new App project. I looked around with no idea how to start. I fiddled with typography and code style for an hour.

This blog post was going to be titled something like: *"How I used AI to Build a MacOS App"*. My plan was to use the likes of Chat GPT and Llama to code the app. I did try, I got nowhere. LLMs are extremely good at generating code errors. It's impressive how convincing they make complete nonsense look. I bet the self-proclaimed "prompt engineers" are laughing at me now.

I gave up on "AI" and I found a few humans to help me.

I googled aimlessly until I stumble upon a [YouTube video by Mohammad Azam](https://www.youtube.com/watch?v=cA-oUgOfLxY) and a [tutorial by Casey Brant](https://8thlight.com/insights/tutorial-add-a-menu-bar-extra-to-a-macos-app). I also found [Anagh Sharma's guide](https://www.anaghsharma.com/blog/macos-menu-bar-app-with-swiftui) that is a bit older but still works.

With these resources I edited my main `App.swift` like so:

```swift
import SwiftUI

@main
struct HomeDeckApp: App {
  @NSApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
  var body: some Scene {
    WindowGroup {
      ContentView()
    }
  }
}

class AppDelegate: NSObject, NSApplicationDelegate, ObservableObject {
  private var popover: NSPopover!
  private var statusItem: NSStatusItem!

  @MainActor func applicationDidFinishLaunching(_ notification: Notification) {
    let statusBar = NSStatusBar.system
    statusItem = statusBar.statusItem(withLength: NSStatusItem.squareLength)
    statusItem.button?.title = "😂"
    statusItem.button?.action = #selector(togglePopover)
    popover = NSPopover()
    popover.contentSize = NSSize(width: 400, height: 400)
    popover.behavior = .transient
    popover.contentViewController = NSHostingController(rootView: ContentView())
  }

  @objc func togglePopover() {
    if let button = statusItem.button {
      if popover.isShown {
        self.popover.performClose(nil)
      } else {
        popover.show(relativeTo: button.bounds, of: button, preferredEdge: NSRectEdge.minY)
      }
    }
  }
}
```

This depends on `ContentView.swift` which is still the default *"Hello World"* window boilerplate that Xcode created.

Running the app opens the "Hello World" window and gave me a delightful "😂" icon in the menu bar. Clicking the icon opens a popover with another "Hello World" inside. Amazing, it works!

Following Mohammad's example, I chose a system symbol to replace the unicode emoji. [Apple's SF Symbols](https://developer.apple.com/design/resources/#sf-symbols) app lets you browse all the available icons. I picked one similar to HomeKit.

```swift
statusItem.button?.image = NSImage(systemSymbolName: "house.fill", accessibilityDescription: "HomeDeck")
```

I'll design my own icon later.

Now I need the web view. More googling took me to an [article by Gavin Wiggins](https://gavinw.me/swift-macos/swiftui/webview.html). With this I updated `ContentView.swift`:

```swift
import SwiftUI
import WebKit

struct ContentView: View {
  var body: some View {
    WebView(url: "https://example.com")
      .frame(width: 400, height: 400)
      .padding(0)
  }
}

#Preview {
  ContentView()
}

struct WebView: NSViewRepresentable {
  let url: String
  func makeNSView(context: Context) -> WKWebView {
    guard let url = URL(string: self.url) else {
      return WKWebView()
    }
    let webview = WKWebView()
    let request = URLRequest(url: url)
    webview.load(request)
    return webview
  }
  func updateNSView(_ nsView: WKWebView, context: Context) { }
}
```

After allowing *"Outgoing Connections"* in the app settings — sorry, I lost where — the "Hello World" popover was replaced by the `WebView`.

I'm almost there! Now I just need to remove my app from the Dock and not open a window on launch; just sit in the menu bar.

A final round of googling lead me to a [YouTube video by Grace Huang](https://www.youtube.com/watch?v=rsGCaBwsdjA). Follow her example I updated `Info.plist` and edited `App.swift`:

```swift
struct HomeDeckApp: App {
  @NSApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
  @State private var shouldShowInitialView = false
  var body: some Scene {
    Settings {
      EmptyView()
    }
  }
}
```

Now my app is only visible in the menu bar. I compiled a release build — 123KB — dragged it into my *Applications* directory, and set it to launch on start up. Job done! Resource usage is negligible (it idles at zero).

This was a fun weekend project. I'm chuffed with the final result. I may attempt to learn Swift one day. The declarative Swift UI looks intriguing.

I half expected Apple to ask me to pay some developer fees, or disallow me from using the app for "security reasons". Thankfully I'm still allowed to use my own computer.

In case you're wondering the "..." ellipsis icon in my screenshot above is [Bartender](https://www.macbartender.com) — an app that fixes a glaring oversight in Apple's UI design. The network monitor is [Little Snitch](https://www.obdev.at/products/littlesnitch/).
