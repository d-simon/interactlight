function WorkerPool (n) {

    var shuffle = function(v){
        for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
        return v;
    };

    this.workers = new Array(n);
    this.availableWorkers = new Array(n);
    for (var i = 0; i < n; i++) {
        this.workers[i] = this.createWorker(i);
        this.availableWorkers[i] = i;
    }
    this.availableWorkers = shuffle(this.availableWorkers); // For additional initial randomness
}


WorkerPool.prototype.go = function (fn) {
    if (!fn && typeof fn !== 'function') return;

    if (!this.availableWorkers.length) return; // Implement Queue!
    var that = this;
    var id = this.availableWorkers.splice(0,1)[0];
    this.workers[id].go(fn, function done (workerId) {
        that.availableWorkers.push(id);
    });
};


WorkerPool.prototype.createWorker = function (id) {
    var worker = {};
        worker.id = id;
        worker.go = function (fn, done) {
            try {
                fn(done, this.id);
            } catch (e) {
                done(this.id);
            }
        }
    return worker;
}

module.exports = WorkerPool;