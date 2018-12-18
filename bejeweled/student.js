// Schrijf hier je code
function width(grid) {
    return grid[0].length;
}

function height(grid) {
    return grid.length;
}

function isInside(grid, position) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === position) {
                return true;
            }
        }
    }
    return false;
}

function isInside(grid, position) {
    const {x, y} = position;
    return 0 <= x && x < width(grid) && 0 <= y && y < height(grid);
}

function swap(grid,p,q) {
    let temp = grid[p.y][p.x];
    grid[p.y][p.x] = grid[q.y][q.x];
    grid[q.y][q.x] = temp;

}

function horizontalChainAt(grid, position) {
    const { x, y } = position;
    let i;
    for (i = 1; x + i < width(grid); ++i) {
        if (grid[y][x + i] !== grid[y][x]) {
            break;
        }
    }
    let j;
    for (j = 1; x - j >= 0; ++j) {
        if (grid[y][x - j] !== grid[y][x]) {
            break;
        }
    }
    return i + j - 1;
}

function verticalChainAt(grid, position) {
    const {x, y} = position;
    let i;
    for (i = 1;y + i < height(grid); ++i) {
        if (grid[y+ i][x] !== grid[y][x]) {
            break;
        }
    }
    let j;
    for (j = 1; y - j >=0; ++j) {
        if (grid[y-j][x] !== grid[y][x]) {
            break;
        }
    }
    return i + j - 1 ;
}

function removeChains(grid){
    const result = {};
    const positions = [];
    for (let y = 0; y < height(grid); y++){
        let x = 0;
        while (x < width(grid)){
            const n = horizontalChainAt(grid, {x, y});
            if (n >2){
                for ( let i = 0; i !== n; i++){
                    positions.push({x: x + i, y});
                }
            }
            x += n;
        }
    }

    for (let x = 0; x < width(grid); x++){
        let y = 0;
        while (y < height(grid)){
            const n = verticalChainAt(grid, {x, y});
            if (n >2){
                for ( let i = 0; i !== n; i++){
                    positions.push({x, y: y + i});
                }
            }
            y += n;
        }
    }

    for(const position of positions){
        const {x,y} = position;
        const color = grid[y][x];
        result[color] = (result[color] || 0 ) + 1;;
    }

    for(const {x,y} of positions){
        grid[y][x] = "";
    }
    return result;
}

function collapse(grid){
    for (let y = height(grid) - 1; y > 0; y--){
        for(let x = 0; x < width(grid); x++){
            for (let y = height(grid) - 1; y > 0; y--){
                var q = {x, y};
                q.y = y-1;
                if( grid[y][x] == ""){
                    swap(grid, {x, y}, q);
                }
            }
        }
    }
}