const STATE_IDLE = 0;
const STATE_PING = 1;
const STATE_COMP = 2;

new Vue({
    el: '#app',
    data: {
        status: 'Not started...',
        appState: STATE_IDLE
    },
    methods: {
        detectVPN: function () {
            if (this.appState === STATE_IDLE) {
                console.log('Testing... ');
                this.appState = STATE_PING;
                this.status = 'Testing... Please wait...';

                var net = new Network(settings);

                net.latency.on('end', this.compareLatency);

                net.latency.start();
            } else {
                this.status = 'I\'m working on it. Be patient.';
            }
        },
        compareLatency: function(averageLatency, allLatencies) {
            if (this.appState === STATE_PING) {
                console.log('Average latency: ' + averageLatency);
                this.appState = STATE_COMP;
                this.status = 'Still Testing... Please wait...';

                axios.post('compare.php', {avg: averageLatency})
                    .then(this.displayResults)
                    .catch(this.showError);
            }
        },
        displayResults: function(response) {
            this.appState = STATE_IDLE;

            this.status = 'Computer says: ' + response.data;
        },
        showError: function(response) {
            this.appState = STATE_IDLE;

            this.status = 'Something went horribly wrong. Try again, maybe?';

            console.log(response.data);
        }
    }
});