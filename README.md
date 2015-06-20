# Baked Goods 2015

A JavaScript port of a Turbo Pascal DOS game I created in 1995.

## About

This is a fun project to learn a bit about HTML5 and the canvas element.

I created this game back in 1995. It was written in Turbo Pascal and
running under DOS.

While the game mechanic itself is not very complicated, a good part of
the original code base consisted of low level assembler code to access
video memory and play sounds on a SoundBlaster card.

To make this game easily accessible again and prevent people from having
to install emulators, I decided to spend a weekend porting this to
JavaScript/HTML5.

## Name

The original title is _Waffle Man_. The whole waffle theme is related to
a friend of mine whose father was running a full blown waffle factory.
We used to hang out there, watching freshly baked waffles and cookies
on conveyor belts.

With ripened age, I find this name a bit silly now, so I changed it to
_Baked Goods_.

## How to play

The gameplay itself was inspired by [Rock 'n' Roll](http://en.wikipedia.org/wiki/Rock_%27n%27_Roll_%28video_game%29).

This is work in progress. However, you can move the player around with
the cursor keys (check out the tubes).

You can either check out this repository and open `index.html` in your
browser, or [play directly via GitHub pages](http://mpm.github.io/baked-goods/).

Stay tuned for updates:

# TODO

The part so far was created in two late night hacking sessions on
Fri/Sat 22nd/23rd of May.

The biggest challenge was understanding my legacy code (I seemed to have
a strong passion for one-letter variable names back then).

### Things done so far

* Converted binary level data into JSON
* Converted artwork into `.png` file
* Load maze and monster data from JSON
* Draw monsters and player
* Transport player automatically when entering tubes
* Trigger level events (keys and switches)
* Collision detection for monsters
* Collect baked goods, coins and bonus lifes
* Make monsters move around
* Rotation of player sprite

### Yet to be done

* Die when running into monsters
* Check for never versions of level data as some levels cannot be
  completed atm.
* Make the screen smaller/scrollable?
* Game states (intro screen, advancing to next level, etc.)
* Fog
