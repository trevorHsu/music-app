import JSONP from 'jsonp'

export default function jsonp(url, data, option){
    url += (url.indexOf('?')<0 ? '?' : '&') + param(data)
    return new Promise((resolve, reject) => {
        JSONP(url, option, (err, res) => {
            if(!err) resolve(res)
            else reject(err)
        })
    })
}

function param(_data){
    let url = ''
    for(let k in _data){
        let value = _data[k] !== undefined ? _data[k] : ''
        url += `&${k}=${encodeURIComponent(value)}`  //encodeURIComponent: to encode the string into an url component
    }
    return url ? url.substring(1) : ''
}