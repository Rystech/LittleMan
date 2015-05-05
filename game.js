
var game = new Phaser.Game(500, 240, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
var dragging = false;
var  moving = 0;
var dirran = 0;
var hunger = 100;
var anger = 0;
var fun = 100;
var cash=300;
var man;
var timer;
var table;
var oldpos;
var clicked = false;
var tween = null;
var popup;
var rightface=true;
var state=1;
var ownedchair;
var demoTween;
var cursors;
function preload() {
    game.load.image('bg', 'background.png');
    game.load.image('man', 'littleman0000.png');
    game.load.image('fridge', 'fridge.png');
    game.load.image('fridge2', 'fridgeopen.png');
    game.load.image('table2', 'table.png');
    game.load.image('table', 'table2.png');
    //game.load.image('chair', 'chair.png');
    game.load.spritesheet('button', 'buttons.png',70,39);    
    game.load.spritesheet('test', 'littleman2.png', 82, 91);
    game.load.spritesheet('chair', 'chairsheet.png', 128, 128);

}
var sprite;
function create() {
    back = game.add.image(0, 0, 'bg');
    //  Enable p2 physics
    game.world.setBounds(0, 0, 500, 240);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1000;
    game.physics.p2.setBoundsToWorld(true, true, true, true, false);
    //UICode Load
    home = game.add.button(15, 30, 'button',homeclick,this,2,1,0);
    //Object Load must be placed before man to fix draw.
    chair = game.add.sprite(1000, 1000, 'chair');
    //LittleMAn Load
    man = game.add.sprite(15, 30, 'test');
    game.physics.p2.enable(man,false);
    man.frame = 0;
    man.inputEnabled= true;
    man.input.enableDrag();
    man.events.onDragStart.add(click, this);
    man.events.onDragStop.add(release, this);
    man.input.useHandCursor = true;
    man.body.fixedRotation=true
    man.animations.add('idlehappy',[3,4,5,6,7,8,9,10,11],5,true);
    man.animations.add('idleangry',[12,13,14,15,16,17,18,19,10,21],5,true);
    man.animations.add('rightnorm',[24,25,26,27,28,29,31,32],5,true);
    man.animations.add('righthappy',[33,34,35,36,37,38,39,,40],5,true);
    man.animations.add('rightsad',[41,42,43,44,45,46,47,48],5,true);
    man.animations.add('pickedup',[51,52,53],5,true);
    man.animations.add('letgo',[54,55,56],5,true);
    man.animations.add('standup',[55,50],5,false);
    //table = this.game.add.sprite(15, 30, 'table');
    mouseBody = new p2.Body();
    game.physics.p2.world.addBody(mouseBody);
        // attach pointer events
    //game.input.onDown.add(click, this);
    //game.input.onUp.add(release, this);
    game.input.addMoveCallback(move, this);
    timer=this.time.create(false);
    timer.loop(5000,walk,this)
    timer.start()
    timer2=this.time.create(false)
    timer2.loop(700,movecheck,this)
    timer2.start()
    payday=this.time.create(false)
    payday.loop(10000,payment,this)
    timer2.start()
    demoTween = game.add.tween(man).to({x:200,y:75},000);
    demoTween.onComplete.add(function(){
        man.position.x = 10000; man.position.y = 10000;
        dragging=false
    });
    cursors = game.input.keyboard.createCursorKeys();
    window.addEventListener("deviceorientation", this.handleOrientation, true);

}


function update(){
    if (man.y >=140){game.physics.p2.gravity.y = 0;}
    if (man.y<=120){game.physics.p2.gravity.y = 1000;}
    if (fun<25){state=3}
    else if (fun<70){state=1}
    else if (fun>70){state=2}
    //switch state ()
        switch (dirran)
                    {
                case 1:   
                    oldpos = man.position.x; 
                    man.body.velocity.x = -25;     
                    if (state==1) {man.animations.play('rightnorm')};
                    if (state==2){man.animations.play('righthappy')};
                    if (state==3){man.animations.play('rightsad')};
                    break;
                case 2:  
                    oldpos = man.position.x;
                    man.body.velocity.x = +25; 
                    if (state==1) {man.animations.play('rightnorm')};
                    if (state==2){man.animations.play('righthappy')};
                    if (state==3){man.animations.play('rightsad')};
                    break;
                case 3:    
                    if (state==1) {man.animations.stop();man.frame=0};
                    if (state==2){man.animations.play('idlehappy')};
                    if (state==3){man.animations.play('idlesad')};
                    break;
                case 4: 
                        if(ownedchair=true){}
                case 8:    
                    man.animations.play('pickedup'); 
                    //man.frame=0; 
                            if (fun > 0){fun=fun-0.1}
                            console.log(fun)
                    break;
                case 9:    
                    man.animations.play('letgo'); 
                    if (fun > 0){fun=fun-0.1}
                    break;
                    
            }
        if (cursors.left.isDown)
    {
    	//man.body.rotation = 0;
        alert(man.y)
        game.physics.p2.gravity.y = 0;
        demoTween.start();
        dragging=true
        
    }

    }



function checkHit(){

}

function click(pointer) {
if (man.input.pointerDown(game.input.activePointer.id)==true){
    var bodies = game.physics.p2.hitTest(pointer.position, [man.body]);
    //if (bodies[0].Body.parent.sprite==man.body){
    var physicsPos = [game.physics.p2.pxmi(pointer.position.x), game.physics.p2.pxmi(pointer.position.y)];
    
    if (bodies.length)
    {
            dirran=8
            dragging = true
            if(rightface==false){man.scale.x *=-1}
        var clickedBody = bodies[0];   
        var localPointInBody = [0, 0];
        clickedBody.toLocalFrame(localPointInBody, physicsPos);
        mouseConstraint = this.game.physics.p2.createRevoluteConstraint(mouseBody, [0, 0], clickedBody, [game.physics.p2.mpxi(localPointInBody[0]), game.physics.p2.mpxi(localPointInBody[1]) ]);
    }   
            //alert(clickedBody[0])
}   //}
}

function release() {

    if (mouseConstraint){game.physics.p2.removeConstraint(mouseConstraint);dragging = false
dirran=9}

}

function move(pointer) {

    mouseBody.position[0] = game.physics.p2.pxmi(pointer.position.x);
    mouseBody.position[1] = game.physics.p2.pxmi(pointer.position.y);

}

function walk() {
if (dragging==false){
if (moving == 1){
    moving = 0;
               }
    else if (moving==0){
        moving=1;
         dirran = Math.round(Math.random() * (3 - 1)) + 1;
        if (dirran == 1 && rightface==true){
            rightface=false; man.scale.x *=-1;
        }
        else if(rightface==false){man.scale.x *=-1}
            }
        }
    }




function handleOrientation(e) {
    var x = e.gamma;
    var y = e.beta;
    man.body.velocity.x += x;
    man._player.body.velocity.y += y;
}
function movecheck()  { if(oldpos == man.position.x && dragging==false) {
    dirran=3;
    }
                          }

function homeclick () {
    store = this.game.add.button(300, 90, 'button',storeclick,this,2,1,0);
}

function storeclick(){
    if (cash >=300){
    store.destroy()
    chair.position.x = 270
    chair.position.y = 75
    ownedchair=true
    cash=cash-300
    }
    else store.destroy()
    
}

function payment(){
 cash = cash + 100   
}