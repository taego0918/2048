let Game = function(obj,_socket){
    const self = this;
    self.obj = obj;
    self.socket = _socket;
    self.gridWidth  = obj.offsetWidth / 5;
    self.gridHeight = obj.offsetHeight / 5;
    self.lineHeight = self.gridHeight / 5 * 4;
    self.gridList = [];
    self.gridList.length = 25;
    self.topPowerNum = 2;
    self.moveChkDistance = 50;
    self.moveSpacing = 100;
    self.gameType = 'wait';
    self.previousPos;
    self.point = 0;
    self.topPoint = 0;
    self.isMobile = false;
    self.isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    let gameOver = document.getElementsByClassName('gameOver')[0];
    let point = document.getElementById('point');
    let topPoint = document.getElementById('top-point');

    let mousedown   = 'mousedown' ,
        mouseup     = 'mouseup',
        mousemove   = 'mousemove';
    if(self.isMobile){
        mousedown   = 'touchstart' ,
        mouseup     = 'touchend',
        mousemove   = 'touchmove';
    }
    
    self.getRandown = (minNum,maxNum)=>{
        return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    }

    self.getMousePos = function(event) {
        let e = event || document.event;
        return {'x':e.clientX,'y':e.clientY}
    }

    self.mouseMoveChk = (e)=>{
        if(typeof self.previousPos === 'undefined')return;
        let previousPos , direction;

        if(!self.isMobile){
            previousPos = self.getMousePos(e);
        }else{
            previousPos = { x : e.touches[e.touches.length-1].clientX ,
                            y : e.touches[e.touches.length-1].clientY }
        }

        if(Math.abs(self.previousPos.x  - previousPos.x) >= self.moveChkDistance){
            (self.previousPos.x  > previousPos.x)? direction ='left': direction ='right';
        }else if(Math.abs(self.previousPos.y - previousPos.y) >= self.moveChkDistance){
            (self.previousPos.y  > previousPos.y)?direction ='up':direction ='down';
        }
        if(typeof direction !== 'undefined'){
            self.gameType = 'moveing';
            self.gridMove(direction);
            delete self.previousPos;
        }
    }

    self.classChange = (_original,_later)=>{
        let div = document.getElementsByClassName('pos-'+ _original)[0];
        div.classList.add('pos-'+ _later);
        div.classList.remove('pos-'+ _original);
        if( (_original%5) === (_later%5)){
            div.style.transition = parseFloat(Math.abs(_original/5 - _later/5) * 0.001 * self.moveSpacing) +'s';
            div.style.top = parseInt( parseInt(_later / 5) * self.gridHeight )+ 'px';
        }else{
            div.style.transition = parseFloat(Math.abs(_original%5 - _later%5) * 0.001 * self.moveSpacing) +'s';
            div.style.left = parseInt( parseInt(_later % 5) * self.gridWidth )+ 'px';
        }
    }
    self.classReplace = (_original,_later,_power)=>{
        let div     = document.getElementsByClassName('pos-'+ _original)[0];
        let later   = document.getElementsByClassName('pos-'+ _later)[0];
        let timeout;
        if( (_original%5) === (_later%5)){
            timeout = parseFloat(Math.abs(_original/5 - _later/5) * 0.001 * self.moveSpacing);
            later.style.transition = timeout +'s';
            later.style.top = parseInt( parseInt(_original / 5) * self.gridHeight )+ 'px';
        }else{
            timeout = parseFloat(Math.abs(_original%5 - _later%5) * 0.001 * self.moveSpacing);
            later.style.transition = timeout +'s';
            later.style.left = parseInt( parseInt(_original % 5) * self.gridWidth )+ 'px';
        }

        setTimeout(() => {
            self.obj.removeChild(later);
            div.className = '';
            div.classList.add('pos-'+ _original);
            if(_power<11){
                div.classList.add('power'+_power);
            }else{
                div.classList.add('power11');
            }
            // div.innerHTML= Math.pow(2,_power);
            self.point += Math.pow(2,_power);

            point.innerHTML = self.point;
            if(self.point> self.topPoint){
                self.topPoint = self.point;
                topPoint.innerHTML = self.topPoint;
            } 
        }, (timeout-0.1) *1000);
    }
    self.gridMove = (_direction) =>{
        switch(_direction){
            case 'up':
                for(let row = 0;row < 5;row++){
                    let sNum = 0;
                    for(let col = 1;col < 5;col++){
                        if( typeof self.gridList[col * 5 + row] ==='undefined'){continue;}
                        for(let item = sNum;item < col;item++){
                            let last = true;
                            for(let item2 = item+1;item2 < col;item2++){
                                if(typeof self.gridList[item2 * 5 + row] !=='undefined'){last = false;}
                            }
                            if(!last){continue;}
                            if( typeof self.gridList[item * 5 + row] ==='undefined'){
                                self.gridList[item * 5 + row] = self.gridList[col * 5 + row];
                                self.classChange(parseInt(col * 5 + row),parseInt(item * 5 + row));
                                delete self.gridList[col * 5 + row];
                                item = 5;
                            }else if( self.gridList[item * 5 + row] === self.gridList[col * 5 + row]){
                                self.gridList[item * 5 + row]++;
                                self.classReplace(  item * 5 + row,
                                                    col * 5 + row,
                                                    self.gridList[item * 5 + row]);
                                delete self.gridList[col * 5 + row];
                                sNum = item+1;
                                item = 5;
                            }
                        }
                    }
                }
                break;
            case 'down':
                for(let row = 0;row < 5;row++){
                    let sNum = 4;
                    for(let col = 3;col > -1;col--){
                        if( typeof self.gridList[col * 5 + row] ==='undefined'){continue;}
                        for(let item = sNum;item > col;item--){
                            let last = true;
                            for(let item2 = item-1;item2 > col;item2--){
                                if(typeof self.gridList[item2 * 5 + row] !=='undefined'){last = false;}
                            }
                            if(!last){continue;}
                            if( typeof self.gridList[item * 5 + row] ==='undefined'){
                                self.gridList[item * 5 + row] = self.gridList[col * 5 + row];
                                self.classChange(parseInt(col * 5 + row),parseInt(item * 5 + row));
                                delete self.gridList[col * 5 + row];
                                item = -1;
                            }else if( self.gridList[item * 5 + row] === self.gridList[col * 5 + row]){
                                self.gridList[item * 5 + row]++;
                                self.classReplace(  item * 5 + row,
                                                    col * 5 + row,
                                                    self.gridList[item * 5 + row]);
                                delete self.gridList[col * 5 + row];
                                sNum = item-1;
                                item = -1;
                            }
                        }
                    }
                }
                break;
            case 'left':
                for(let col = 0;col < 5;col++){
                    let sNum = 0;
                    for(let row = 1;row < 5;row++){
                        if( typeof self.gridList[col * 5 + row] === 'undefined'){continue;}
                        for(let item = sNum;item < row;item++){
                            let last = true;
                            for(let item2 = item+1;item2 < row;item2++){
                                if(typeof self.gridList[col * 5 + item2]!=='undefined'){last = false;}
                            }
                            if(!last){continue;}
                            if( typeof self.gridList[col * 5 + item] === 'undefined'){
                                self.gridList[col * 5 + item] = self.gridList[col * 5 + row];
                                self.classChange(parseInt(col * 5 + row),parseInt(col * 5 + item));
                                delete self.gridList[col * 5 + row];
                                item = 6;
                            }else if( self.gridList[col * 5 + item] === self.gridList[col * 5 + row]){
                                self.gridList[col * 5 + item]++;
                                self.classReplace(  col * 5 + item,
                                                    col * 5 + row,
                                                    self.gridList[col * 5 + item]);
                                delete self.gridList[col * 5 + row];
                                sNum = item+1;
                                item = 6;
                            }
                        }
                    }
                }
                break;
            case 'right':
                for(let col = 0;col < 5;col++){
                    let sNum = 4;
                    for(let row = 3;row > -1;row--){
                        if( typeof self.gridList[col * 5 + row] === 'undefined'){continue;}
                        for(let item = sNum;item > row;item--){
                            let last = true;
                            for(let item2 = item-1;item2 > row;item2--){
                                if(typeof self.gridList[col * 5 + item2]!=='undefined'){last = false;}
                            }
                            if(!last){continue;}
                            if( typeof self.gridList[col * 5 + item] === 'undefined'){
                                self.gridList[col * 5 + item] = self.gridList[col * 5 + row];
                                self.classChange(parseInt(col * 5 + row),parseInt(col * 5 + item));
                                delete self.gridList[col * 5 + row];
                                item=-1;
                            }else if( self.gridList[col * 5 + item] === self.gridList[col * 5 + row]){
                                self.gridList[col * 5 + item]++;
                                self.classReplace(  col * 5 + item,
                                                    col * 5 + row,
                                                    self.gridList[col * 5 + item]);
                                delete self.gridList[col * 5 + row];
                                sNum = item-1;
                                item=-1;
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
        setTimeout(() => {
            self.gameType = 'wait';
            self.newGrid();
        }, self.moveSpacing * 3);
    }
    
    self.obj.addEventListener(mousedown,(e)=>{
        if(self.gameType !=='wait'){return;}
        if(!self.isMobile){
            self.previousPos = self.getMousePos(e);
        }else{
            self.previousPos =  {  x : e.touches[0].clientX,
                                   y : e.touches[0].clientY};
        }
        self.obj.addEventListener(mousemove, (e)=>{
            if(self.gameType !=='wait'){return;}
            if(typeof self.previousPos === 'undefined')return;
            self.mouseMoveChk(e);
        })
    })

    self.obj.addEventListener(mouseup,()=>{
        delete self.previousPos;
    })
    
    self.reset = () =>{
        let grid = self.obj.querySelectorAll('div[class*="power"]');

        for(let item = 0 ; item < grid.length-1;item++){
            self.obj.removeChild(grid[item]);
        }
        gameOver.style.display = 'none';
        self.point = 0;
        self.topPowerNum = 2;
        self.gameType = 'wait';
        self.gridList = [];
        self.gridList.length = 25;
        for(let i = 0; i<2;i++){
            self.newGrid();
        }
    }
    
    self.chkOverGrid = () =>{
        let returnData = false,
            gridList = '';
        for(let item = 0;item < self.gridList.length;item++){
            if(typeof self.gridList[item] === "undefined"){
                returnData = true;
                break;
            }
        }
        if(!returnData){
            self.gameType = 'gameOver';
            gameOver.style.display = 'block';
        }
        for(let item = 0;item < self.gridList.length;item++){
            if(typeof self.gridList[item] === "undefined"){
                gridList += '0'
            }else{
                let chkDiv = document.getElementsByClassName('pos-'+item)[0];
                if(chkDiv.className.indexOf('power'+self.gridList[item] == -1 )){
                    chkDiv.className = '';
                    chkDiv.classList.add('pos-'+item);
                    chkDiv.classList.add('power'+self.gridList[item]);
                }
                gridList +=  self.gridList[item].toString(16);
            }
        }
        let data = {
            name : localStorage.getItem("name"),
            point : self.point,
            TPoint : self.topPoint,
            gridList: gridList
        }
        self.socket.emit('gamerData',data);
        return returnData;
    }

    self.newGrid = ()=>{
        if(!self.chkOverGrid()){return;}
        for(let i = 0; i<1;i++){
            let position = self.getRandown(0,24);
            if( typeof self.gridList[position] !== "undefined"){
                i--;
                continue;
            }
            let power = self.getRandown(1,self.topPowerNum);
            self.createGrid(position,power);
            self.gridList[position] = power;
        }
    }

    self.createGrid = (_position,_power)=>{
        let div = document.createElement('div');
        let self = this;
        div.style.lineHeight = self.lineHeight + 'px';
        div.style.top = parseInt(_position / 5) * self.gridHeight + 'px';
        div.style.left = (_position % 5) * self.gridWidth  + 'px';
        div.style.transition = '0.3s';
        div.style.opacity = '0';
        // div.innerHTML = Math.pow(2,_power);
        div.classList.add('power'+_power);
        div.classList.add('pos-'+_position);
        self.obj.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '1';
        }, 0);
    }
    self.reset();
}