namespace SpriteKind {
    export const rock = SpriteKind.create()
}
function setup_skull () {
    skull = sprites.create(assets.image`flaming skull`, SpriteKind.Enemy)
    animation.runImageAnimation(
    skull,
    assets.animation`flaming`,
    150,
    true
    )
    animation.runMovementAnimation(
    skull,
    animation.animationPresets(animation.bobbing),
    4000,
    true
    )
}
function spawn_rocks (rock: Sprite) {
    timer.background(function () {
        spriteutils.placeAngleFrom(
        rock,
        randint(0, spriteutils.consts(spriteutils.Consts.Pi) * 2),
        35,
        spriteutils.pos(80, 60)
        )
        anim = assets.animation`entry`
        frame_len = 100
        scene.cameraShake(4, anim.length * frame_len)
        animation.runImageAnimation(
        rock,
        anim,
        frame_len,
        false
        )
        pause(randint(2500, 8000))
        anim = assets.animation`entry`
        anim.reverse()
        rock.lifespan = frame_len * anim.length
        animation.runImageAnimation(
        rock,
        anim,
        frame_len,
        false
        )
    })
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (player2, proj) {
    game.over(false)
})
function fire () {
    for (let index = 0; index < randint(1, 3); index++) {
        spawn_rocks(sprites.create(image.create(16, 16), SpriteKind.rock))
    }
    pause(500)
    music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.UntilDone)
    if (randint(1, 2) == 2) {
        generate_projectiles(50)
    } else {
        generate_projectiles(0)
    }
    timer.after(randint(3500, 5000), function () {
        fire()
    })
}
function movement () {
    if (controller.up.isPressed()) {
        me.vy += acceleration * -1
    } else if (controller.down.isPressed()) {
        me.vy += acceleration
    }
    if (controller.left.isPressed()) {
        me.vx += acceleration * -1
    } else if (controller.right.isPressed()) {
        me.vx += acceleration
    }
    me.vx = me.vx * deceleration
    me.vy = me.vy * deceleration
}
function generate_projectiles (time: number) {
    arc_size = randint(1, 3) * 90
    start = randint(1, 360)
    angle = 0
    for (let index = 0; index < arc_size / 10; index++) {
        fire_angle = spriteutils.degreesToRadians(start + angle)
        proj = sprites.create(assets.image`projectile`, SpriteKind.Projectile)
        proj.setPosition(proj.x, proj.y)
        proj.z = -1
        proj.setFlag(SpriteFlag.AutoDestroy, true)
        spriteutils.setVelocityAtAngle(proj, fire_angle, 40)
        pause(time)
        angle += 10
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.rock, function (proj, rock) {
    proj.destroy()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.rock, function (player2, rock) {
    angle = spriteutils.angleFrom(rock, player2)
    spriteutils.placeAngleFrom(
    player2,
    angle,
    16,
    rock
    )
})
function move_check () {
    if (Math.abs(me.vx) > 8 || Math.abs(me.vy) > 8) {
        if (!(is_moving)) {
            animation.runImageAnimation(
            me,
            assets.animation`walking`,
            100,
            true
            )
            is_moving = true
        }
    } else {
        animation.stopAnimation(animation.AnimationTypes.All, me)
        is_moving = false
    }
}
sprites.onDestroyed(SpriteKind.Projectile, function (proj) {
    info.changeScoreBy(10)
})
sprites.onOverlap(SpriteKind.rock, SpriteKind.rock, function (rock, other_rock) {
    sprites.allOfKind(SpriteKind.rock).pop().destroy()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (player2, skull) {
    player2.sayText("ow", 500)
    angle = spriteutils.angleFrom(skull, player2)
    spriteutils.setVelocityAtAngle(player2, angle, 150)
})
let proj: Sprite = null
let fire_angle = 0
let angle = 0
let start = 0
let arc_size = 0
let frame_len = 0
let anim: Image[] = []
let skull: Sprite = null
let deceleration = 0
let acceleration = 0
let is_moving = false
let me: Sprite = null
me = sprites.create(assets.image`me`, SpriteKind.Player)
me.setPosition(20, 20)
me.setStayInScreen(true)
setup_skull()
scene.setBackgroundImage(assets.image`background`)
timer.after(randint(3500, 5000), function () {
    fire()
})
is_moving = false
acceleration = 8
deceleration = 0.9
game.onUpdate(function () {
    movement()
    move_check()
})
