function Definition(name, value) {
    if (!(this instanceof Definition)) {
        return new Definition(name, value);
    }
    this.name = name;
    this.value = value;
}

Definition.prototype.toString = function () {
    return this.name + " = " + this.value;
};

module.exports = Definition;