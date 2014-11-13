function TokenStream(tokens) {
    this.tokens = tokens || [];
    this.index = 0;
}

TokenStream.prototype.isEnded = function () {
    return this.peek() === TokenStream.EOF;
};

TokenStream.prototype.peek = function () {
    return this.tokenAtIndex(this.index);
};

TokenStream.prototype.next = function () {
    var token = this.tokenAtIndex(this.index);
    this.advanceIndex();
    return token;
};

TokenStream.prototype.tokenAtIndex = function (index) {
    var token = this.tokens[index];
    return token || TokenStream.EOF;
};

TokenStream.prototype.advanceIndex = function () {
    this.index++;
    if (this.index > this.tokens.length + 1) {
        throw new Error('EOF');
    }
};

TokenStream.EOF = null;

module.exports = TokenStream;