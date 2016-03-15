module.exports = {
  randomArray: (array) => {
    return array[Math.floor(Math.random()*array.length)]
  },
  shuffle: (o) => {
    var j, x, i;
    for (i = o.length; i; i -= 1) {
      j = Math.floor(Math.random() * i);
      x = o[i-1];
      o[i-1] = o[j];
      o[j] = x;
    }
    return o;
  }
}
