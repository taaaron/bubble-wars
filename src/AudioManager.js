import AudioManager;

var audioManager = new AudioManager({
    path: 'resources/sounds',
    files: {
        bgMusic: {
            path: 'music',
            volume: 0.3,
            background: true
        },
        bubbleAbsorb: {
            path: 'effects',
            volume: 0.5
        },
        bubblePop: {
            path: 'effects',
            volume: 0.3
        },
        bubbleShoot: {
            path: 'effects'
        },
        buttonClick: {
            path: 'effects'
        },
        enemyDefeat: {
            path: 'effects',
            volume: 0.5
        },
        laserCharging: {
            path: 'effects'
        },
        shooterRotate: {
            path: 'effects'
        },
        victory: {
            path: 'effects'
        }
    }
});

exports.getAudioManager = function() {
    return audioManager;
};