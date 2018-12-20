const STATE_IDLE = 0;
const STATE_PING = 1;
const STATE_COMP = 2;

var app = new Vue({
    el: '#app',
    data: {
        status: 'Not started...',
        state: STATE_IDLE
    },
    methods: {
        detectVPN: function () {
            if (this.state === STATE_IDLE) {
                this.state = STATE_PING;
                this.status = 'Testing... Please wait...';

                var net = new Network(settings);

                var avg = 0;
                var all = [];

                net.latency.on('end', this.compareLatency);
            } else {
                this.status = 'I\'m working on it. Be patient.';
            }
        },
        compareLatency: function(averageLatency, allLatencies) {
            if (this.state === STATE_PING) {
                this.state = STATE_COMP;
                this.status = 'Still Testing... Please wait...';

                this.$http.post('compare.php', {avg: averageLatency, all: allLatencies})
                    .then(
                        this.displayResults(response),
                        this.showError(response)
                    )
            }
        },
        displayResults: function(response) {
            this.state = STATE_IDLE;

            this.status = 'Computer says: ' + response.data;
        },
        showError: function(response) {
            this.state = STATE_IDLE;

            this.status = 'Something went horribly wrong. Try again, maybe?';

            console.log(response.data);
        }
    }
});