function c(m, cb) { setTimeout(() => { console.log('some func'); cb(null, 12) }, Math.floor(Math.random() * m * 10)) }

// c(2, (err, data) => {
//     if (err) {
//         console.log(1, err)
//     } else {
//         console.log(1, data)
//     }
// });
// c(2, (err, data) => {
//     if (err) {
//         console.log(2, err)
//     } else {
//         console.log(2, data)
//     };
// });
// c(2, (err, data) => {
//     if (err) {
//         console.log(3, err)
//     } else {
//         console.log(3, data)
//         console.log(3, 15)
//     };
// });


// function a(s) {
//     return new Promise(resolve => {
//         const res = c(s, (err, data) => {
//             if (err) {
//                 console.log(1, err)
//             } else {
//                 console.log(1, data)
//             }
//         })
//         resolve(res)
//     }).catch(err => {
//         console.log(err)
//     });
// };


// a(3).then()



// c(4, (err, data) => { })
// a(4)
//     .then(data => ...)
//     .catch(err => ...)


const scribble = require('scribbletune');
let chords = scribble.clip({
	notes: 'F#m C#m DM Bm EM AM DM C#m AM',
	pattern: '[xx][x-]'.repeat(8),
	sizzle: true
});  

scribble.midi(chords, 'chords.mid');