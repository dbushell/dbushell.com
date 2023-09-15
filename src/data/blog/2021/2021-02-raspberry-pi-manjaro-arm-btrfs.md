---
date: 2021-02-08 10:00:00+00:00
slug: raspberry-pi-manjaro-arm-btrfs
title: 'Raspberry Pi + Manjaro ARM + Btrfs'
description: 'The one where I keep myself busy during lockdown'
---
This is the sort of thing I do Sunday mornings in the midst of a COVID lockdown. Copy-and-pasting commands I vaguely understand between reps with [the barbell](/2021/01/05/2020-in-review/). I’ve documented my steps below. The example commands are for Arch-based Linux. Other distros will differ but the concepts are not exclusive. The basic idea is to:

1. Install a prebuilt OS image with the necessary packages
2. Ensure kernel modules are available on boot
3. Convert the filesystem to Btrfs
4. Reboot (successfully)

I've done this on a Raspberry Pi 3B. Mileage may vary with other single board computers. Linux is Linux it just needs to be fairly modern I guess.

**Disclaimer:** I've no idea if this is a good idea!

## Why Manjaro ARM and Btrfs?

Manjaro is Arch-based Linux meaning bleeding edge packages. [As a hobbyist](/2021/01/11/self-hosted-raspberry-pi-docker/) tinkering with this stuff I care more for the latest. Unlike base Arch it doesn’t take all morning to configure. The minimal edition without a desktop is lean and comparably unbloated. It’s rapidly surpassing [DietPi](https://dietpi.com/) as my favourite distro. I’m still running Ubuntu Server on my main Pi for the “stability”. Not that the host OS matters because I containerise everything.

[Btrfs](https://wiki.archlinux.org/index.php/btrfs) actually makes filesystems somewhat interesting. Snapshots offer potential to “backup” and rollback data. I want to experiment with that — see if I can restore a system to its previous state.

## The Process

There are a few ways to achieve this. Keep reading for a less YOLO approach if it isn’t a brand new install. Otherwise write an image to an SD card/drive using your preferred tool. See the [Manjaro Wiki](https://wiki.manjaro.org/index.php/Manjaro-ARM#Installation) for more guidance. I just use the terminal.

```shell
xzcat Manjaro-ARM-minimal-rpi4.img.xz | sudo dd bs=4M of=/dev/sdX
```

Manjaro can boot and SSH straight into a short setup process. Do that and once up and running update the whole system:

```shell
sudo pacman -Syu
```

Then install the Btrfs tools package:

```shell
sudo pacman -S btrfs-progs
```

No harm in checking that has worked:

```shell
btrfs --version
```

And better safe to check the kernel module is actually installed:

```shell
modinfo btrfs
```

Although the module exists it's probably not available prior to mounting the root filesystem. That's kinda necessary. To confirm that run:

```shell
lsinitcpio -a /boot/initramfs-linux.img
```

Look for `btrfs` under the "Included modules:" — it’s probably not listed out of the box. To include it edit `/etc/mkinitcpio.conf` and add `btrfs`:

```
MODULES=(btrfs)
```

Check `/etc/mkinitcpio.d/` for the preset name and then rebuild the image:

```shell
sudo mkinitcpio -p linux-rpi4
```

Repeat the `lsinitcpio` command to confirm.

Btrfs is now installed and available at boot. Shutdown the Raspberry Pi and remove the SD card. The next step is to convert the root partition. **This cannot be done on the Pi itself whilst it's running.** You need to insert the SD card into another machine. Ideally use another Arch machine so you can install the same `btrfs-progs` package.

Use `fdisk -l` to find the device and partition number.

To convert the root partition whilst unmounted run:

```shell
sudo btrfs-convert /dev/sdX2
```

Do not convert the `/boot` parition.

Now mount both the root and boot partitions:

```shell
sudo mount /dev/sdX2 /mnt
sudo mount /dev/sdX1 /mnt/boot
```

The conversion has worked if you can browse `/mnt` and see the Pi’s filesystem.

The next step is critical in order to reboot the Pi successfully. At the moment it still thinks the root partion is `ext4` formatted.

First check the file `/mnt/etc/fstab` on the mounted Pi volume (not the host OS — easy mistake to make). If the root mount point `/` is listed then change `ext4` to `btrfs` and the final `1` to `0` on the same line. However this step shouldn't be necessary with Manjaro ARM – only `/boot` will be listed.

Now edit `/mnt/boot/cmdline.txt` and replace `rootfstype=ext4` with:

```shell
rootfstype=btrfs fsck.repair=no
```

You should also see `root=LABEL=ROOT_MNJRO` which explains why the `fstab` file does not include it. Other systems will vary but the idea remains the same.

If everything has gone to plan you’ll have successfully installed the kernel modules, converted the filesystem, and updated the necessary boot config to match. Return the SD card to the Raspberry Pi and it should boot.

Or you’ve bricked it. Nuke and repeat?

### The Safer Approach

A safer approach – especially for converting existing systems – is to use two SD cards and avoid `btrfs-convert` entirely. Maybe make a backup first. Manually format a second SD card with a boot partition (`vfat`) and a root partition (`btrfs`). Mount both SD cards onto a 3rd machine and simply copy the files over.

Something like:

```shell
cp -a /mnt/sdX1-boot /mnt/sdY2-boot
cp -a /mnt/sdX2/ /mnt/sdY2
```

Finally edit the second SD card to update the fstab and boot config as described above. You’ll have to make sure the partition labels and IDs are updated too as these aren't copied. The `blkid` command can help identify them. This approach is a little more effort but it leaves the original SD card intact should something go wrong.

## Now what?

[Docker](https://docs.docker.com/storage/storagedriver/btrfs-driver/) can/will take advantage of Btrfs. I'm still learning how.

[Snapper](https://wiki.archlinux.org/index.php/snapper) is the tool I'm most interested in.

> "[Snapper] can create and compare snapshots, revert between snapshots, and supports automatic snapshots timelines."

I've set up a few Docker services as an experiment. I'm running Snapper to take hourly, weekly, and monthly snapshots of the root partition. I will leave the Pi running for a few weeks to see what happens.

Tweet [@dbushell](https://twitter.com/dbushell) if you've done something similar I'm keen to learn more.
