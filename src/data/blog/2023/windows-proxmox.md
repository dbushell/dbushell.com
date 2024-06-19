---
date: 2023-08-08 10:00:00+00:00
slug: adventures-in-windows-proxmox-virtualisation
title: 'Adventures in Windows and Proxmox Virtualisation'
description: 'The one where I virtualise Windows 11'
---

Occassionally I need to jump into Windows (I know, *eww*). As a Mac user the suggested method is to wear a hazmat suit and enter [Parallels](https://www.parallels.com/). But the Parallels license is a rip off with its yearly update nonsense.

If you've hardware to spare, there are better options!

## Repurposing Macs

Last year I picked up a new MacBook and remembered how useful a laptop was. That means I have ~three~ two old devices to put to use:

* **Mac Mini (2014)**
  <br>Intel Core i5-4278U CPU @ 2.60GHz
  <br><small>2 core / 4 threads – 8GB RAM – Iris 5100 graphics</small>
* **Mac Mini (2018)**
  <br>Intel Core i7-8700B CPU @ 3.20GHz
  <br><small>6 core / 12 threads – 32GB RAM – UHD 630 graphics</small>

I had a [MacBook Air (2010)](/2020/07/02/hardware-home-servers-self-hosted-raspberry-pi/) with Linux installed for emergency SSH. The screen has started to glitch out hard. I hope it's just a driver issue. Not sure when I'll have the time or desire to fix it.

Anyway, where to run Windows?

### Attempt 1 – 2014 Mac Mini

The 2014 Mini has a brutally slow internal hard drive. We're talking like 10MB/s. I'm convinced the drive is faulty but it keeps chugging. I was booting macOS from an external thunderbolt SSD for two years prior to upgrading to the 2018 model. I've since been using it sparingly to test Linux distros.

I partitioned off 100GB of the 1TB drive for Windows 11. Windows is perfectly happy to be installed. Funny since Apple has long abandoned macOS support.

I ran [Geekbench 6](https://www.geekbench.com/) to get a relative benchmark score:

* Single core: 1021
* Multi core: 2029

The system would be useable for less demanding software but that HDD is a major bottleneck in getting stuff done.

### Attempt 2 – 2018 Mac Mini (Proxmox)

The 2018 Mini is still an absolute beast. I was going to keep it as my office desktop but docking my laptop is more convenient.

It's too good to become e-waste. In fact, I've already got [Proxmox](https://proxmox.com/) installed and putting the 32GB RAM to good use. [Kasm Browsers](/2023/07/07/kasm-web-browsers-in-docker/) being a recent project. I moved all of my [self-hosted services](/2021/01/11/self-hosted-raspberry-pi-docker/) off of my Raspberry Pi fleet and on to Proxmox virtual machines. As a homelab server this thing barely breaks a sweat.

Windows on bare metal would be great but that means dual booting and taking my server offline. Not viable, but Proxmox can run more than just headless Linux. How would a Windows VM fair? I was keen to find out.

But first I created a "Hackintosh":

<img
  src="/images/blog/2023/vm-ventura.avif"
  alt="screenshot of macOS Ventura in a Proxmox virtual machine"
  width="1280"
  height="720">

MacOS is tricky to install in a VM but doable. Apple make you jump through a few hoops to create the installer and serial number. Despite only access to 4GB of memory it runs ok! Useful for testing apps, I guess?

Anyway, back on track.

Windows is easier to install in a VM. However — and same with the Hackintosh — there is no real GPU. Thus making requirements like OpenGL difficult. I found [Windows mesa drivers](https://github.com/pal1000/mesa-dist-win/releases) that mostly work but performance isn't great.

I researched "[PCI passthrough](https://pve.proxmox.com/wiki/PCI_Passthrough)" and it seems like I can hand off the integrated Intel UHD graphics to a VM. I had to unload kernel modules on the Proxmox host to stop it taking control of the iGPU. I was half successful, it appeared in Windows device manager, but Intel drivers failed ([error code 43](https://www.intel.com/content/www/us/en/support/articles/000038287/graphics.html)). There is some issue with VBIOS on the UHD 630. I found a [GitHub project](https://github.com/patmagauran/i915ovmfPkg) and compiled a ROM file but no luck. A dead-end for now.

I took a benchmark in the VM:

* Single core: 1212
* Multi core: 4200

20% improvement on a single core. This is not a good representation as the Proxmox host is running several other VMs. [Search results](https://browser.geekbench.com/search?q=%20i7-8700B) suggest bare metal scores would be closer to 1400/6000. SSD read/write speed smoke the 2014 Mini — like 100× more. Lack of GPU though limits utility.

### Attempt 3 – Beelink!

Although the Proxmox VM is adequate for most of my use cases I became fixated on PCI passthrough.

In my research I found [Derek Seaman's](https://www.derekseaman.com/2023/06/proxmox-ve-8-windows-11-vgpu-vt-d-passthrough-with-intel-alder-lake.html) article where he demos 12th gen Intel iGPUs that can split themselves across multiple VMs. Following Seaman's success I looked at **Intel N100** mini PCs.

The [Beelink MINI S12 Pro](https://www.bee-link.com/catalog/product/index?id=434) is £200. Amazon UK was sold out. The [Beelink EQ12](https://www.bee-link.com/catalog/product/index?id=455) was "on sale" for £234. A good upgrade for better DDR5, WiFi 6, Bluetooth 5.2, extra USB ports, and +1 NIC. Comparing Beelinks gave me a headache so I just went for the **EQ12**.

I'd prefer it come in black but ok:

<figure class="Image">
  <img
    src="/images/blog/2023/vm-beelink.avif"
    alt="Beelink mini PC alonside a Raspberry Pi in my desk drawer"
    width="1280"
    height="550">
    <figcaption>Beelink EQ12 mini PC and the Raspberry Pi for scale (Argon ONE M.2 case)</figcaption>
</figure>

For price comparison, a Raspberry Pi 4 costs upwards of £100 with the necessary power supply and case for cooling. More when you add a USB drive to boot from. For price, performance, and hardware, mini PCs are easily the economical choice if you're not tinkering with electronics.

The Beelink EQ12 came with Windows 11 Pro pre-installed. First I ran Geekbench benchmarks:

* Single core: 1252
* Multi core: 3228

I wiped the drive with a fresh Proxmox 8 install. I followed Seaman's guide to install the [host modules](https://github.com/strongtz/i915-sriov-dkms) and Windows 11 VM. I deviated slightly by adding the VirtIO networking from the start. This means the installer has no Internet access (drivers come later). It's possible to [bypass a Microsoft account](https://www.tomshardware.com/how-to/install-windows-11-without-microsoft-account) with a bit of trickery.

I ran Geekbench again in the VM:

* Single core: 1206
* Multi core: 2312

Multi-core performance takes a hit with the overhead for virtualisation and remote desktop. Though I suspect my rudimentary testing methodology isn't providing much insight.

On the Beelink I plan to only have one Windows VM running at a time. The benefit being able to spin up and tear down Windows; like containers with isolated apps. I can have one instance for Steam. Another for learning Windows Subsystem for Linux. That kind of thing.

In future I may use the Beelink for my self-hosted server freeing up the 2018 Mini for more powerful stuff. I'm undecided. Another project I had in mind was a DIY router + firewall. It's a nice little machine with good IO.

The EQ12 comes with a 500GB NVMe and can expanded with a SATA SSD. I popped in a spare SSD and installed Windows on a 64GB partition. It's nice to have the option of a bare metal install. Because I installed Proxmox first it boots to [systemd-boot](https://wiki.archlinux.org/title/systemd-boot) which is smart enough to find the Windows partition. I can also press F7 earlier if I'm fast enough. If you buy a Beelink make sure to backup [or download](https://www.bee-link.com/cms/support/driverhardware) the drivers because nothing works after a clean install.

[Ventoy](https://www.ventoy.net/en/index.html) is very useful for loading up a USB stick with multiple ISO installers and drivers. [Netboot](https://netboot.xyz) is another handy tool. I've also been using [Chris Titus' debloat script](https://christitus.com/windows-11-perfect-install/) for Windows 11.

I ran Geekbench again to confirm the original score:

* Single core: 1234
* Multi core: 3257

I'll probably stick to VMs for convenience but if I need a little extra juice it's available. Unless I run a game the input latency and framerate isn't all that noticeable in remote desktop.

## Back to 2014

Not giving up on the old 2014 Mac Mini just yet I installed [Arch Linux](https://archlinux.org/). I configured a very basic [Hyprland](https://hyprland.org/) setup.

<figure class="Image">
  <img
    src="/images/blog/2023/vm-mac2014.avif"
    alt="mac mini and monitor attached"
    width="1280"
    height="729">
    <figcaption>Mac Mini 2014 running Arch Linux and Windows in a Remote Desktop</figcaption>
</figure>

This is now an SSH and remote desktop thin client to access my headless virtual machines and other devices. Arch & Hyprland boot very fast.

One disadvantage of repurposing old Macs is fixing keyboard layout for UK Apple keyboards. Getting keys correct in Windows and Linux is nigh impossible. I've resorted to memorising layouts and mentally switching as I touch type. How is this not a solved problem? [Please tell me](/contact/) I'm missing something!

## Bonus round!

Just for fun I installed Windows for ARM on a Raspberry Pi 4. [Writing the ISO](https://www.tomshardware.com/how-to/install-windows-11-raspberry-pi) to an SD card was painful and first boot was taking an eternity. I gave up after going dizzy watching loading spinners. I tried again on a USB stick and it worked!

Performance was practically unusable as expected. It was only a 4GB Pi but I doubt double the RAM would help much. Geekbench wouldn't install (AMD & Intel support only on Windows). [Search results](https://browser.geekbench.com/search?utf8=%E2%9C%93&q=raspberry+pi+4) suggests a score of around 300/600 on Linux.

## Finally

So now I have even more hardware and decisions to make on what to run where. My desk drawers are like ovens I think my next project should be a cooling solution.
