const redis = require('async-redis');
const r = redis.createClient();
const readline = require('readline');
const fs = require('fs');
(async() => {
    await r.flushall();
    const readInterface = readline.createInterface({
        input: fs.createReadStream('./file.txt')
    });
    readInterface.on('line', async function(line) {
        const n = line.trim();
        for(let l in n) {
            const k = parseInt(l) + 1;
            const prefix = n.slice(0, k);
            await r.ZADD('autocomplete', 0, prefix);
        }
        await r.ZADD('autocomplete', 0, n+'%');
    });
    readInterface.on('close', async () => {
        const res = await r.ZRANGE('autocomplete', 0, -1);
        console.log(res);
    });
})()
