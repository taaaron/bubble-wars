# Bubble Wars
Bubble Wars is a space themed game based on the bubble shooter genre. The twist in the game is that instead of bubbles being anchored to the top of the screen, the bubbles are anchored to alien enemies that are defeated by popping the bubble that they reside on. Additionally, the player can switch bubble types at any time but has limited ammo. The player can increase their ammo count by dropping detached bubbles and absorbing them. Difficulty can be adjusted by limiting ammo and protecting enemies behind different patterns of bubbles that the player must skillfully get through. Bubble Wars runs on Game Closure's JavaScript game engine called DevKit.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Follow the instructions from [here](https://github.com/gameclosure/devkit/wiki/Install-Instructions---Windows) to get DevKit installed on your machine

### Installing

Fork the bubble-wars repo and pull a local version onto your machine. Then go into the bubble wars folder and run the following command:

```
devkit install
```

Once that install completes, you are ready to run the game by running the command:

```
devkit serve
```

If you run into errors at this step please refer to the **Install Issues** section below.

The game runs on localhost:9200 by default. All you need to do now is open your internet browser of choice point to localhost:9200.

On that page click on the Bubble Wars option and then click 'simulate' on the top right hand corner of the page.

This will open up the game in a new tab and you are ready to play!

### Game Controls

 - Click on the tri-shooter to switch which type of bubble will be fired.
 - Click and drag anywhere above the tri-shooter to aim. Bouncing your shots off of the wall is also a feature in the game!
 - Release to shoot!
 - Pop the bubble that the alien enemies are on to defeat them.
 - There is limited ammo but you can get more by disconnecting bubbles so that they will drop and be added to your ammo count.
 - The bubbles are anchored to the enemies so even if they are floating, if they are connected to an alien, they will not drop.
 - The menu screen is the cog icon in the bottom corner of the game screen.

### Install Issues

```
Error: EINVAL: invalid argument, utime
```

Go into the ./modules/src/build/streams/write-files.js file and adjust lines 34 and 35 from this:

```
var atime = file.stat.atime.getTime();
var mtime = file.stat.mtime.getTime();
```

to this:

```
var atime = file.stat.atime;
var mtime = file.stat.mtime;
```

## Author

 Aaron Ta

## Acknowledgments
 
 - Game Closure for creating the DevKit engine - https://github.com/gameclosure/devkit
 - MillionthVector for the Spaceship art - http://millionthvector.blogspot.de
 - Rawdanitsu for the laser effects
 - PremiumBeat Free digital technology SFX for the Sound Effects
 - Kenney for the UI Assets and Font - www.kenney.nl
 - Music - There for Me (KIWAMU Remix) by Shingo Nakamura
 
 