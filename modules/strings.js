module.exports = () => {

  if (!String.prototype.padStart) {
      String.prototype.padStart = function padStart(targetLength,padString) {
          targetLength = targetLength>>0; //floor if number or convert non-number to 0;
          padString = String(padString || ' ');
          if (this.length > targetLength) {
              return String(this);
          }
          else {
              targetLength = targetLength-this.length;
              if (targetLength > padString.length) {
                  padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
              }
              return padString.slice(0,targetLength) + String(this);
          }
      };
  }

  function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }

  Number.prototype.formatting = function(padding, color, precision) {
    if(!precision) {
      return this.toString().padStart(padding).wrapInColor(color);
    }
    else {
      if(!isFloat(this)) {
        return parseFloat(this).toFixed(precision).toString().padStart(padding).wrapInColor(color);
      }

      return this.toFixed(precision).toString().padStart(padding).wrapInColor(color);
    }
  }

  const colors = {
    "red": "\x1b[31m",
    "green": "\x1b[32m",
    "cyan": "\x1b[36m",
    "stop": "\x1b[0m"
  };

  String.prototype.wrapInColor = function wrapInColor(color) {
    return colors[color] + String(this) + colors.stop;
  }

  String.prototype.wrapInRed = function wrapInRed() {
    return colors.red + String(this) + colors.stop;
  }

  String.prototype.wrapInGreen = function wrapInGreen() {
    return colors.green + String(this) + colors.stop;
  }

  String.prototype.wrapInCyan = function wrapInCyan() {
    return colors.cyan + String(this) + colors.stop;
  }
}
