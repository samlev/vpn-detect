VPN Detect
==========

This is a fairly straightforward and naive attempt at detecting VPN or proxy usage by comparing latency times from 
`client -> server` with latency times from `server -> client`. General theory is that a VPN or proxy will add latency in
one direction, but not the other.

To see it in action, you can play with it [on my site](https://samuellevy.com/vpn-detect), and there's also a better
explanation of the theory and process behind it. Not that it's that difficult to figure out.