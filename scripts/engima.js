(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.enigma = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

const EnigmaMachine = require('./src/enigmaMachine');

module.exports = (rotors, positions, ringSettings, reflector, plugboardPairs) => {
  return new EnigmaMachine(rotors, positions, ringSettings, reflector, plugboardPairs);
}

},{"./src/enigmaMachine":2}],2:[function(require,module,exports){
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Rotor = require('./rotor');
const reflectorTypes = require('./reflectorTypes');

function alphaToNum(c) {
  return c.charCodeAt(0) - 65;
}

class EnigmaMachine {
  constructor(rotors = ['III','II','I'], positions = [0,0,0], ringSettings = [0,0,0], reflector = 'B', plugboardPairs = '') {
    this.plugboard = this.generatePlugboard(plugboardPairs);
    this.rotors = [];
    rotors.reverse().forEach((r, i) => {
      this.rotors.push(new Rotor(r, ringSettings.reverse()[i], positions.reverse()[i]));
    });
    this.reflector = reflectorTypes[reflector];
  }

  generatePlugboard(pairs) {
    var pb = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (pairs === '') {
      return pb;
    }
    pairs.split(' ').forEach((p) => {
      pb = pb.slice(0, alphaToNum(p[0])) + p[1] + pb.slice(alphaToNum(p[0]) + 1);
      pb = pb.slice(0, alphaToNum(p[1])) + p[0] + pb.slice(alphaToNum(p[1]) + 1);
    })
    return pb;
  }

  encodeChar(c) {
    // c to output of plugboard
    // This is the position the signal goes through the first rotor
    let nextInput = this.plugboard.indexOf(c)

    // through each rotor
    for (let i = 0; i < this.rotors.length; i++) {
      let outputChar = this.rotors[i].encoding[nextInput];
      //console.log(outputChar);
      nextInput = this.rotors[i].alpha.indexOf(outputChar);
    }

    // reflected
    let outputChar = this.reflector[nextInput];
    //console.log(outputChar);
    nextInput = ALPHABET.indexOf(outputChar);

    // through each rotor again
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      let outputChar = this.rotors[i].decoding[nextInput];
      //console.log(outputChar);
      nextInput = this.rotors[i].alpha.indexOf(outputChar);
    }

    // mrpjevans: Final pass through the plugboard
    nextInput = this.plugboard.indexOf(ALPHABET[nextInput]);

    // output
    //console.log(ALPHABET[nextInput] + '/n');
    return ALPHABET[nextInput];
  }

  encodeString(s) {
    let result = '';
    for (var c of s) {
      c = c.toUpperCase();
      if(!c.match(/[A-Z]/i)) {
        result += c
        continue
      }
      this.cycleRotors();
      result += this.encodeChar(c.toUpperCase());
    }
    return result;
  }

  cycleRotors() {
    // NB: The fourth rotor on the M4 didn't move
    if (this.rotors[1].turnover.includes(this.rotors[1].ring[0])) {
      // if the second rotor is at the turnover position, it turns itself and the third rotor
      // This is the source of the "double step" of the middle rotor
      this.rotors[2].cycle(1);
      this.rotors[1].cycle(1);

      // the first rotor always turns
      this.rotors[0].cycle(1);
    } else if (this.rotors[0].turnover.includes(this.rotors[0].ring[0])) {
      // If the first rotor is at the turnover position, it turns the second rotor too
      this.rotors[1].cycle(1);
      this.rotors[0].cycle(1);
    } else {
      // The first rotor always turns
      this.rotors[0].cycle(1);
    }
  }

  setPosition(positions) {
  }
}

module.exports = EnigmaMachine;

},{"./reflectorTypes":3,"./rotor":4}],3:[function(require,module,exports){
module.exports = {
  B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
  BThin: 'ENKQAUYWJICOPBLMDXZVFTHRGS',
  CThin: 'RDOBJNTKVEHMLFCWZAXGYIPSUQ'
};

},{}],4:[function(require,module,exports){
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rotorTypes = require('./rotorTypes');


function numToAlpha(i) {
  return String.fromCharCode(i + 65);
}

class Rotor {
  constructor(rotorType, ringSetting, position) {
    this.ring = ALPHABET.slice(ringSetting) + ALPHABET.slice(0, ringSetting);

    this.alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    this.encoding = rotorTypes[rotorType].encoding;
    this.decoding = '';
    for (var i = 0; i < 26; i++) {
      this.decoding += numToAlpha(this.encoding.indexOf(ALPHABET[i]))
    }
    this.turnover = rotorTypes[rotorType].turnover;
    this.ringSetting = ringSetting;
    this.position = 0;

    this.cycle(position - ringSetting);
  }

  cycle(n) {
    this.ring = this.ring.slice(n) + this.ring.slice(0, n);
    this.alpha = this.alpha.slice(n) + this.alpha.slice(0, n);
    this.encoding = this.encoding.slice(n) + this.encoding.slice(0, n);
    this.decoding = this.decoding.slice(n) + this.decoding.slice(0, n);
    this.position += n;
  }

  setPosition(position) {
    this.cycle(position - this.ringSetting);
  }

  setRingSetting(ringSetting) {
    this.ring = ALPHABET.slice(ringSetting) + ALPHABET.slice(0, ringSetting);
  }
}

module.exports = Rotor;

},{"./rotorTypes":5}],5:[function(require,module,exports){
module.exports = {
  I: {
    encoding: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    turnover: 'Q',
  },
  II: {
    encoding: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
    turnover: 'E',
  },
  III: {
    encoding: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
    turnover: 'V',
  },
  IV: {
    encoding: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    turnover: 'J'
  },
  V: {
    encoding: 'VZBRGITYUPSDNHLXAWMJQOFECK',
    turnover: 'Z'
  },
  VI: {
    encoding: 'JPGVOUMFYQBENHZRDKASXLICTW',
    turnover: 'ZM'
  },
  VII: {
    encoding: 'NZJHGRCXMYSWBOUFAIVLPEKQDT',
    turnover: 'ZM'
  },
  VIII: {
    encoding: 'FKQHTLXOCBJSPDZRAMEWNIUYGV',
    turnover: 'ZM'
  },
  Beta: {
    encoding: 'LEYJVCNIXWPBQMDRTAKZGFUHOS',
    turnover: ''
  },
  Gamma: {
    encoding: 'FSOKANUERHMBTIYCWLQPZXVGJD',
    turnover: ''
  },
}

},{}]},{},[1])(1)
});
