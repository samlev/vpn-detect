const STATE_IDLE = 0;
const STATE_PING = 1;
const STATE_COMP = 2;
const STATE_DONE = 3;
const STATE_ERROR = 4;

new Vue({
    el: '#app',
    data: {
        status: 'Not started... Press the button below to begin',
        appState: STATE_IDLE
    },
    methods: {
        detectVPN: function () {
            if (this.appState === STATE_IDLE || this.appState === STATE_DONE || this.appState === STATE_ERROR) {
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
            this.appState = STATE_DONE;

            this.status = 'Computer says: ' + response.data;
        },
        showError: function(response) {
            this.appState = STATE_ERROR;

            this.status = 'Something went horribly wrong. It\'s likely that the device attached to your public IP refuses to respond to ping (leading to PHP timing out)';

            console.log(response.data);
        }
    },
    computed: {
        stateClass: function() {
            switch (this.appState) {
                case STATE_PING:
                    return 'is-primary';
                case STATE_COMP:
                    return 'is-warning';
                case STATE_DONE:
                    return 'is-success';
                case STATE_ERROR:
                    return 'is-error';
                case STATE_IDLE:
                default:
                    return 'is-info';
            }
        }
    }
});