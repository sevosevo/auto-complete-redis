const redis = require('async-redis');
const r = redis.createClient();

const grab = 50;
const find = async (r, prefix, count) => {
    const results = [];
    let start = await r.zrank('autocomplete', prefix);
    if(!start) 
        return [];
    while(results.length !== count) {
        const range = await r.zrange('autocomplete', start, start+grab-1);
        console.log(range);
        start += grab; 
        if(!range || range.length === 0) { break } 
        for(let entry of range) {
            const minlen = Math.min(entry.length, prefix.length)
            if(entry.slice(0, minlen) !== prefix.slice(0, minlen)) {
                count = results.length;
                break;
            }
            if(entry[entry.length - 1] === '%' && results.length !== count) {
                results.push(entry.slice(0, entry.length - 1));
            }
        }
    }
    return results;
};
find(r, 'Fi', 60).then(res => console.log('Found:', res));