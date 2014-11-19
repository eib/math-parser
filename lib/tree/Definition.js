function Definition(name, value) {
    if (!(this instanceof Definition)) {
        return new Definition(name, value);
    }
    this.name = name;
    this.value = value;
}