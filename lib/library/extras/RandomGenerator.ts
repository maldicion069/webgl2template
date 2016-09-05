// Code based in https://gist.github.com/banksean/300494

/**
 * Examples:
 *     // Real random [0, 1) (Same interval as Math.random)
 *     - RandomGenerator.random();
 *     // [0, 4294967295]
 *     - RandomGenerator.randomInt();
 *     // [0,1]
 *     - RandomGenerator.randomIncl();
 *     // (0,1)
 *     - RandomGenerator.randomExcl();
 *     // [0,1) with 53-bit resolution
 *     - RandomGenerator.randomLong();
 *     // [0, 2147483647]
 *     - RandomGenerator.randomInt31();
 */

namespace RandomGenerator {
    const seed = new Date().getTime();

    // Period parameters
    const N = 624;
    const M = 397;
    const MATRIX_A = 0x9908b0df;   // constant vector a
    const UPPER_MASK = 0x80000000; // most significant w-r bits
    const LOWER_MASK = 0x7fffffff; // least significant r bits

    let mt = new Array(N); // the array for the state vector
    let mti= N + 1; // mti==N+1 means mt[N] is not initialized

    init_seed(seed);

    export function setSeed(seed: number) {
        init_seed(seed);
    }

    function init_seed(seed: number) {
        mt[0] = seed >>> 0;
        for (mti = 1; mti < N; ++mti) {
            const s = mt[mti-1] ^ (mt[mti - 1] >>> 30);
            mt[mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
                (s & 0x0000ffff) * 1812433253) + mti;
            // See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier.
            // In the previous versions, MSBs of the seed affect
            // only MSBs of the array mt[].
            // 2002/01/09 modified by Makoto Matsumoto
            mt[mti] >>>= 0;
            // for >32 bit machines
        }
    };


    // generates a random number on [0,0xffffffff]-interval
    // origin name genrand_int32
    export function randomInt() {
        let y;
        let mag01 = new Array(0x0, MATRIX_A);
        // mag01[x] = x * MATRIX_A  for x=0,1

        if (mti >= N) { // generate N words at one time
            let kk;

            if (mti == N + 1)  // if init_seed() has not been called,
                this.init_seed(5489);  // a default initial seed is used

            for (kk = 0; kk< N-M; ++kk) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for ( ; kk < N-1; ++kk) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK);
            mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            mti = 0;
        }

        y = mt[mti++];

        // Tempering
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    }

    // generates a random number on [0,0x7fffffff]-interval
    // origin name genrand_int31
    export function randomInt31() {
        return (randomInt() >>> 1);
    }

    // generates a random number on [0,1]-real-interval
    // origin name genrand_real1
    export function randomIncl() {
        return randomInt() * (1.0 / 4294967295.0);
        // divided by 2^32-1
    }

    // generates a random number on [0,1)-real-interval
    export function random() {
        return randomInt() * (1.0 / 4294967296.0);
        // divided by 2^32
    }

    // generates a random number on (0,1)-real-interval
    // origin name genrand_real3
    export function randomExcl() {
        return (randomInt() + 0.5) * (1.0 / 4294967296.0);
        // divided by 2^32
    }

    // generates a random number on [0,1) with 53-bit resolution*/
    // origin name genrand_res53
    export function randomLong() {
        const a = randomInt() >>> 5,
              b = randomInt() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }
};

export { RandomGenerator };