export var Timing;
(function (Timing) {
    Timing.linear = (t) => t;
    Timing.quad = (t) => t * t;
    Timing.cubic = (t) => t * t * t;
    Timing.inout = (t) => {
        if (t <= 0) {
            return 0;
        }
        if (t >= 1) {
            return 1;
        }
        const t2 = t * t;
        const t3 = t2 * t;
        return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75);
    };
    Timing.exponential = (t) => {
        return Math.pow(2, 10 * (t - 1)); // eslint-disable-line
    };
    Timing.bounce = ((t) => {
        // eslint-disable-next-line
        for (let a = 0, b = 1; 1; a += b, b /= 2) {
            if (t >= (7 - 4 * a) / 11) {
                const q = (11 - 6 * a - 11 * t) / 4;
                return -q * q + b * b;
            }
        }
    });
})(Timing || (Timing = {}));
(function (Timing) {
    Timing.decorators = {
        reverse(f) {
            return (t) => 1 - f(1 - t);
        },
        reflect(f) {
            return (t) => 0.5 * (t < 0.5 ? f(2 * t) : 2 - f(2 - 2 * t));
        },
        clamp(f, n = 0, x = 1) {
            return (t) => {
                const r = f(t);
                return r < n ? n : r > x ? x : r;
            };
        },
        back(s = 1.70158) {
            return (t) => t * t * ((s + 1) * t - s);
        },
        elastic(x = 1.5) {
            return (t) => Math.pow(2, 10 * (t - 1)) * Math.cos(((20 * Math.PI * x) / 3) * t); // eslint-disable-line
        },
    };
})(Timing || (Timing = {}));
(function (Timing) {
    // Slight acceleration from zero to full speed
    function easeInSine(t) {
        return -1 * Math.cos(t * (Math.PI / 2)) + 1;
    }
    Timing.easeInSine = easeInSine;
    // Slight deceleration at the end
    function easeOutSine(t) {
        return Math.sin(t * (Math.PI / 2));
    }
    Timing.easeOutSine = easeOutSine;
    // Slight acceleration at beginning and slight deceleration at end
    function easeInOutSine(t) {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    }
    Timing.easeInOutSine = easeInOutSine;
    // Accelerating from zero velocity
    function easeInQuad(t) {
        return t * t;
    }
    Timing.easeInQuad = easeInQuad;
    // Decelerating to zero velocity
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    Timing.easeOutQuad = easeOutQuad;
    // Acceleration until halfway, then deceleration
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    Timing.easeInOutQuad = easeInOutQuad;
    // Accelerating from zero velocity
    function easeInCubic(t) {
        return t * t * t;
    }
    Timing.easeInCubic = easeInCubic;
    // Decelerating to zero velocity
    function easeOutCubic(t) {
        const t1 = t - 1;
        return t1 * t1 * t1 + 1;
    }
    Timing.easeOutCubic = easeOutCubic;
    // Acceleration until halfway, then deceleration
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    Timing.easeInOutCubic = easeInOutCubic;
    // Accelerating from zero velocity
    function easeInQuart(t) {
        return t * t * t * t;
    }
    Timing.easeInQuart = easeInQuart;
    // Decelerating to zero velocity
    function easeOutQuart(t) {
        const t1 = t - 1;
        return 1 - t1 * t1 * t1 * t1;
    }
    Timing.easeOutQuart = easeOutQuart;
    // Acceleration until halfway, then deceleration
    function easeInOutQuart(t) {
        const t1 = t - 1;
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
    }
    Timing.easeInOutQuart = easeInOutQuart;
    // Accelerating from zero velocity
    function easeInQuint(t) {
        return t * t * t * t * t;
    }
    Timing.easeInQuint = easeInQuint;
    // Decelerating to zero velocity
    function easeOutQuint(t) {
        const t1 = t - 1;
        return 1 + t1 * t1 * t1 * t1 * t1;
    }
    Timing.easeOutQuint = easeOutQuint;
    // Acceleration until halfway, then deceleration
    function easeInOutQuint(t) {
        const t1 = t - 1;
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * t1 * t1 * t1 * t1 * t1;
    }
    Timing.easeInOutQuint = easeInOutQuint;
    // Accelerate exponentially until finish
    function easeInExpo(t) {
        if (t === 0) {
            return 0;
        }
        return Math.pow(2, 10 * (t - 1)); // eslint-disable-line
    }
    Timing.easeInExpo = easeInExpo;
    // Initial exponential acceleration slowing to stop
    function easeOutExpo(t) {
        if (t === 1) {
            return 1;
        }
        return -Math.pow(2, -10 * t) + 1; // eslint-disable-line
    }
    Timing.easeOutExpo = easeOutExpo;
    // Exponential acceleration and deceleration
    function easeInOutExpo(t) {
        if (t === 0 || t === 1) {
            return t;
        }
        const scaledTime = t * 2;
        const scaledTime1 = scaledTime - 1;
        if (scaledTime < 1) {
            return 0.5 * Math.pow(2, 10 * scaledTime1); // eslint-disable-line
        }
        return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2); // eslint-disable-line
    }
    Timing.easeInOutExpo = easeInOutExpo;
    // Increasing velocity until stop
    function easeInCirc(t) {
        const scaledTime = t / 1;
        return -1 * (Math.sqrt(1 - scaledTime * t) - 1);
    }
    Timing.easeInCirc = easeInCirc;
    // Start fast, decreasing velocity until stop
    function easeOutCirc(t) {
        const t1 = t - 1;
        return Math.sqrt(1 - t1 * t1);
    }
    Timing.easeOutCirc = easeOutCirc;
    // Fast increase in velocity, fast decrease in velocity
    function easeInOutCirc(t) {
        const scaledTime = t * 2;
        const scaledTime1 = scaledTime - 2;
        if (scaledTime < 1) {
            return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
        }
        return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
    }
    Timing.easeInOutCirc = easeInOutCirc;
    // Slow movement backwards then fast snap to finish
    function easeInBack(t, magnitude = 1.70158) {
        return t * t * ((magnitude + 1) * t - magnitude);
    }
    Timing.easeInBack = easeInBack;
    // Fast snap to backwards point then slow resolve to finish
    function easeOutBack(t, magnitude = 1.70158) {
        const scaledTime = t / 1 - 1;
        return (scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1);
    }
    Timing.easeOutBack = easeOutBack;
    // Slow movement backwards, fast snap to past finish, slow resolve to finish
    function easeInOutBack(t, magnitude = 1.70158) {
        const scaledTime = t * 2;
        const scaledTime2 = scaledTime - 2;
        const s = magnitude * 1.525;
        if (scaledTime < 1) {
            return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
        }
        return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
    }
    Timing.easeInOutBack = easeInOutBack;
    // Bounces slowly then quickly to finish
    function easeInElastic(t, magnitude = 0.7) {
        if (t === 0 || t === 1) {
            return t;
        }
        const scaledTime = t / 1;
        const scaledTime1 = scaledTime - 1;
        const p = 1 - magnitude;
        const s = (p / (2 * Math.PI)) * Math.asin(1);
        return -(Math.pow(2, 10 * scaledTime1) * // eslint-disable-line
            Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p));
    }
    Timing.easeInElastic = easeInElastic;
    // Fast acceleration, bounces to zero
    function easeOutElastic(t, magnitude = 0.7) {
        const p = 1 - magnitude;
        const scaledTime = t * 2;
        if (t === 0 || t === 1) {
            return t;
        }
        const s = (p / (2 * Math.PI)) * Math.asin(1);
        return (Math.pow(2, -10 * scaledTime) * // eslint-disable-line
            Math.sin(((scaledTime - s) * (2 * Math.PI)) / p) +
            1);
    }
    Timing.easeOutElastic = easeOutElastic;
    // Slow start and end, two bounces sandwich a fast motion
    function easeInOutElastic(t, magnitude = 0.65) {
        const p = 1 - magnitude;
        if (t === 0 || t === 1) {
            return t;
        }
        const scaledTime = t * 2;
        const scaledTime1 = scaledTime - 1;
        const s = (p / (2 * Math.PI)) * Math.asin(1);
        if (scaledTime < 1) {
            return (-0.5 *
                (Math.pow(2, 10 * scaledTime1) * // eslint-disable-line
                    Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p)));
        }
        return (Math.pow(2, -10 * scaledTime1) * // eslint-disable-line
            Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p) *
            0.5 +
            1);
    }
    Timing.easeInOutElastic = easeInOutElastic;
    // Bounce to completion
    function easeOutBounce(t) {
        const scaledTime = t / 1;
        if (scaledTime < 1 / 2.75) {
            return 7.5625 * scaledTime * scaledTime;
        }
        if (scaledTime < 2 / 2.75) {
            const scaledTime2 = scaledTime - 1.5 / 2.75;
            return 7.5625 * scaledTime2 * scaledTime2 + 0.75;
        }
        if (scaledTime < 2.5 / 2.75) {
            const scaledTime2 = scaledTime - 2.25 / 2.75;
            return 7.5625 * scaledTime2 * scaledTime2 + 0.9375;
        }
        {
            const scaledTime2 = scaledTime - 2.625 / 2.75;
            return 7.5625 * scaledTime2 * scaledTime2 + 0.984375;
        }
    }
    Timing.easeOutBounce = easeOutBounce;
    // Bounce increasing in velocity until completion
    function easeInBounce(t) {
        return 1 - easeOutBounce(1 - t);
    }
    Timing.easeInBounce = easeInBounce;
    // Bounce in and bounce out
    function easeInOutBounce(t) {
        if (t < 0.5) {
            return easeInBounce(t * 2) * 0.5;
        }
        return easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
    }
    Timing.easeInOutBounce = easeInOutBounce;
})(Timing || (Timing = {}));
//# sourceMappingURL=timing.js.map