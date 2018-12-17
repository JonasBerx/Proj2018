// Schrijf hier je code
function onMouseDown(count, args) {
    return count + 1;
}

function onMouseDown2(state, args) {
    return {count : state.count + 1};
}
function counter3() {
    function onMouseDown(state, args) {
        return {count : state.count + 1};
    }
    return {controller: {onMouseDown}};
}
function counter4() {
    function onMouseDown(state, args) {
        return {count : state.count + 1};
    }

    function onKeyDown(state, args) {
        return {count : 0 }
    }

    return { controller : {onMouseDown, onKeyDown} };

}
function counter5() {
    function onMouseDown(state, args) {
        if (args.shift) {
            if (state.count >= 1) {
                return {count : state.count - 1};
            }
        } else  {
            return {count : state.count + 1};
        }
        return{count: state.count}
    }

    function onKeyDown(state, args) {
        if (args.key === "ArrowUp") {
            return {count: state.count + 1 }
        }else if (args.key === "ArrowDown") {
            if (state.count >= 1) {
                return{count: state.count - 1};
            }
        }
        if (args.key === "0") {
            return {count: 0}
        }
        return{count: state.count}

    }
    return{controller : {onMouseDown, onKeyDown}}
}

function counter6() {
    function increment(state) {
        return {count: state.count + 1}
    }

    function decrement(state) {
        if (state.count >= 1) {
        return{count: state.count - 1};}

    return{count: state.count}
    }

    function reset(state) {
        return {count: 0}
    }

    function onMouseDown(state, args) {
        if (args.shift === true) {
            return decrement(state);
        } else {
            return increment(state);
        }
    }

    function onKeyDown(state, args) {
        if (args.key === "ArrowUp") {
            return increment(state);
        }
        else if (args.key === "ArrowDown") {
            if (state.count >= 1) {
                return decrement(state);
            }
            return {count: state.count}
        }
        else if (args.key === " ") {
            return increment(state);
        }
        else if (args.key === "0") {
            return {count: 0}
        }
        return{count: state.count}
        
    }

    const controller = { onMouseDown, onKeyDown };
    const model = { increment, decrement, reset };
    return { controller, model };
}

function counter7(){

    function add(state, foo){
        if (state.count + foo >= 0){
            return {count: state.count + foo};
        }
        return {count: 0};
    }

    function onKeyDown(state, args){
        return {count: state.count};
    }

    function reset(state) {
        return { count: 0};
    }

    function onMouseDown(state, args) {
        if (args.shift === true){
            if (args.ctrl){
                return add(state, -5);
            }else{
                return add(state, -1);
            }
        }else{
            if (args.ctrl){
                return add(state, 5);
            }else{
                return add(state, 1);
            }
        }
    }

    function onKeyDown(state, args){
        if (args.key === "ArrowUp" || args.key === " "){
            if (args.ctrl){
                return add(state, 5);
            }else{
                return add(state, 1);
            }
        }
        if(args.key === "ArrowDown"){
            if (args.ctrl){
                return add(state, -5);
            }else{
                return add(state, -1);
            }
        }
        if (args.key === "0"){
            return reset(state);
        }
        return { count: state.count};
    }

    const controller = { onMouseDown, onKeyDown };
    const model = { add, reset };
    return { controller, model };
}
function chronometer(state, dt){


    function timePassed(state, dt){
        return { elapsedTime: state.elapsedTime + dt };
    }

    function onTimerTick(state, dt){
        return { elapsedTime: state.elapsedTime + dt };
    }


    const controller = {onTimerTick};
    const model = { timePassed };
    return { controller, model};
}
function chronometer2(){

    function timePassed(state, dt){
        if (state.active){
            return { elapsedTime: state.elapsedTime + dt, active: true };
        } else {
            return { elapsedTime: state.elapsedTime, active: false };
        }
    }

    function toggle(state){
        return {elapsedTime: state.elapsedTime, active: !state.active};
    }

    function onTimerTick(state, dt){
        if (state.active){
            return { elapsedTime: state.elapsedTime + dt, active: true };
        } else {
            return { elapsedTime: state.elapsedTime, active: false };
        }
    }

    function onKeyDown(state, dt){
        if (dt.key === " "){
            return {elapsedTime: state.elapsedTime, active: !state.active};
        }
        if (dt.key === "0"){
            return {elapsedTime: 0, active: state.active};
        }
        return { elapsedTime: state.elapsedTime, active: state.active };

    }

    function reset(state){
        return { elapsedTime: 0, active: state.active};
    }

    const controller = {onTimerTick, onKeyDown};
    const model = { timePassed, toggle, reset };
    return { controller, model};
}
function circle(){

    function render(state){
        return [{type: "circle", center: {x: 100, y: 100}, radius: 10, color: "red"}];
    }

    const view = {render};
    const model = {};
    const controller = {};
    return {view, model, controller};
}

function circle2(){

    function render(state){
        return [{type: "circle", center: state.position, radius: 10, color: "red"}];
    }

    function moveTo(state, position){
        return {position: position};

    }

    function onMouseDown(state, args) {
        return {position: args.position};
    }

    const view = {render};
    const model = {moveTo};
    const controller = {onMouseDown};
    return {view, model, controller};
}

function circle3(){

    function render(state){
        return [{type: "circle", center: state.position, radius: 10, color: "red"}];
    }

    function moveTo(state, position){
        return {position: position};

    }

    function onMouseMove(state, args) {
        return {position: args.position};
    }

    const view = {render};
    const model = {moveTo};
    const controller = {onMouseMove};
    return {view, model, controller};
}
function drawing(){

    function render(state){
        if (state.addMode){
            return [{type: "circle", center: state.position, radius: 2, color: "red"}];
        } else {
            let foo = [];
            for (let i = 0; i < state.dots.length; i++) {
                foo.push({type: "circle", center: state.dots[i], radius: 2, color: "green"});
            }
            foo.push({type: "circle", center: state.position, radius: 5, color: "red"});
            console.log(foo);
            return foo;
        }


    }

    function moveTo(state, position){
        if (state.addMode){
            let foo = [...state.dots, position];

            return {position: position, dots: foo, addMode: true};
        } else {
            return {position: position, dots: [], addMode: false};
        }
    }

    function setAddMode(state, addMode){
        return {position: state.position, dots: state.dots, addMode: addMode};
    }

    function onMouseMove(state, args) {
        return moveTo(state, args.position);
    }

    function onMouseDown(state, args){
        return {position: state.position, dots: state.dots, addMode: true};
    }

    function onMouseUp(state, args){
        return {position: state.position, dots: state.dots, addMode: false};
    }
    
    const view = {render};
    const model = {moveTo, setAddMode};
    const controller = {onMouseMove, onMouseDown, onMouseUp};
    return {view, model, controller};
}

function random(){

    function throwDie(state){
        let foo = (4578 * state.rng ** 2 - 976161 * state.rng + 6156489) % 79729693;
        return {rng: (4578 * state.rng ** 2 - 976161 * state.rng + 6156489) % 79729693, dieValue: foo % 6 + 1 };
    }

    function onKeyDown(state, args){
        if (args.key === " "){
            return throwDie(state);
        }
    }

    function render(state){
        return [{type: "text", position: {x: 50, y: 50}, string: state.dieValue.toString() }];
    }

    const view = {render};
    const model = {throwDie};
    const controller = {onKeyDown};
    return {view, model, controller};
}